<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\City;
use App\Models\Post;
use App\Models\PostImage;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('images', 'city', 'ward')->where('status', 'visible')->get();

        return Inertia::render('Home', [
            'posts' => $posts,
            'isHome' => true,
        ]);
    }

    public function show($slug)
    {
        $post = Post::with('images', 'city', 'ward', 'user', 'utilities', 'category')
            ->where('slug', $slug)
            ->where('status', 'visible')
            ->firstOrFail();

        $related = Post::with('images', 'city', 'ward')
            ->where('status', 'visible')
            ->where('id', '!=', $post->id)
            ->take(20)
            ->get();

        return Inertia::render('PropertyDetail/PropertyDetail', [
            'post' => $post,
            'relatedPosts' => $related,
        ]);
    }

    public function create(Request $request)
    {
        $cityId = $request->query('city_id');
        $wardId = $request->query('ward_id');

        return Inertia::render('Posts/Create', [
            'cities' => City::all(),
            'categories' => Category::all(),
            'city_id' => $cityId,
            'ward_id' => $wardId,
            'subscriptions' => Subscription::where('active', true)->orderByDesc('priority')->get(),
        ]);
    }

    public function store(Request $request)
    {
        return match ((int) $request->step) {
            1 => $this->storeStep1($request),
            2 => $this->storeStep2($request),
            default => abort(400, 'Invalid step'),
        };
    }

    private function storeStep1(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:30|max:88',
            'description' => 'required|string|min:30|max:2000',
            'address' => 'required|string',
            'address_detail' => 'required|string',
            'area' => 'required|numeric|gt:0|max:10000',
            'price' => 'required|integer|gt:0|max:1000000000000',
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'livingrooms' => 'nullable|integer',
            'kitchens' => 'nullable|integer',
            'status' => 'in:hidden,visible,draft',
            'type' => 'required|in:rent,sale',
            'category_id' => 'required|exists:categories,id',
            'city_id' => 'required|exists:cities,id',
            'ward_id' => 'required|exists:wards,id',
            'floors' => 'nullable|integer',
            'direction' => 'nullable|string',
            'legal' => 'nullable|string',
            'furniture' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ], [
            'required' => 'Thông tin này bắt buộc phải điền',
            'price.gt' => 'Thông tin này bắt buộc phải điền',
            'price.max' => 'Giá không được vượt quá 1.000 tỷ',
            'title.min' => 'Vui lòng nhập tối thiểu 30 ký tự',
            'title.max' => 'Vui lòng nhập tối đa 88 ký tự',
            'description.min' => 'Vui lòng nhập tối thiểu 30 ký tự',
            'description.max' => 'Vui lòng nhập tối đa 2000 ký tự',
        ]);

        // UPDATE draft nếu có post_id
        if ($request->filled('post_id')) {
            $post = Post::where('id', $request->post_id)
                ->where('user_id', Auth::id())
                ->where('status', 'draft')
                ->firstOrFail();

            $post->update($validated);

            return redirect()->back()->with('post_id', $post->id);
        }

        // CREATE mới nếu chưa có
        $slug = Str::slug($validated['title']);
        $counter = 1;

        while (Post::where('slug', $slug)->exists()) {
            $slug = Str::slug($validated['title']) . '-' . $counter;
            $counter++;
        }

        $post = Post::create([
            ...$validated,
            'slug' => $slug,
            'user_id' => Auth::id(),
            'status' => 'draft',
        ]);

        return redirect()->back()->with('post_id', $post->id);
    }

    private function storeStep2(Request $request)
    {
        // dd($request->all(), $request->file('video'));

        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'images'   => 'required|array|min:3|max:24',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:20480', //20MB
            'images_360'   => 'nullable|array|max:5',
            'images_360.*' => 'integer',
            'video' => 'nullable|mimes:mp4,mov,webm|max:204800', // 200MB
            'youtube_url' => [
                'nullable',
                'url',
                'regex:/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)/'
            ],
        ]);

        if ($request->filled('youtube_url') && $request->hasFile('video')) {
            return back()->withErrors([
                'video' => 'Chỉ được chọn 1 trong 2: video upload hoặc link YouTube',
            ]);
        }

        $validated['youtube_url'] = $this->extractYoutubeId(
            $validated['youtube_url'] ?? null
        );

        $post = Post::where('id', $validated['post_id'])
            ->where('user_id', Auth::id())
            ->where('status', 'draft')
            ->firstOrFail();

        // Nếu có youtube_url -> clear video
        if (!empty($validated['youtube_url'])) {
            $post->update([
                'youtube_url' => $validated['youtube_url'],
                'video' => null,
            ]);
        }

        // Nếu upload video -> clear youtube_url
        if ($request->hasFile('video')) {
            $post->update([
                'youtube_url' => null,
            ]);
        }

        // Lấy index ảnh 360
        $images360 = collect($request->input('images_360', []))
            ->map(fn($i) => (int) $i)
            ->toArray();

        // Check nghiệp vụ
        $totalImages = count($request->file('images'));
        $total360 = count($images360);
        $normalImages = $totalImages - $total360;

        if ($normalImages < 3) {
            return back()->withErrors([
                'images' => 'Cần ít nhất 3 ảnh thường',
            ]);
        }

        if ($total360 > 5) {
            return back()->withErrors([
                'images_360' => 'Tối đa 5 ảnh 360',
            ]);
        }

        foreach ($images360 as $i) {
            if ($i < 0 || $i >= $totalImages) {
                return back()->withErrors([
                    'images_360' => 'Index ảnh 360 không hợp lệ',
                ]);
            }
        }

        $destDir = "posts/{$post->id}";
        $manager = new ImageManager(new Driver());

        foreach ($request->file('images') as $index => $image) {
            $filename = uniqid() . '.' . $image->getClientOriginalExtension();

            $is360 = in_array($index, $images360);

            $originalPath = "{$destDir}/original_{$filename}";
            $mediumPath   = "{$destDir}/medium_{$filename}";
            $thumbPath    = "{$destDir}/thumb_{$filename}";

            $image->storeAs($destDir, "original_{$filename}", 'public');

            $originalFullPath = storage_path("app/public/{$originalPath}");

            // MEDIUM
            $manager->read($originalFullPath)
                ->scaleDown($is360 ? 3072 : 1600)
                ->toWebp(75)
                ->save(storage_path("app/public/{$mediumPath}"));

            // THUMB
            $manager->read($originalFullPath)
                ->scaleDown($is360 ? 512 : 400)
                ->toWebp(70)
                ->save(storage_path("app/public/{$thumbPath}"));

            gc_collect_cycles();

            PostImage::create([
                'post_id' => $post->id,
                'image_path' => $originalPath,
                'medium_path' => $mediumPath,
                'thumb_path' => $thumbPath,
                'is360' => $is360,
            ]);
        }

        // Lưu video
        if ($request->hasFile('video')) {
            $post->update([
                'video' => $request->file('video')->store($destDir, 'public'),
                'status' => 'draft'
            ]);
        }
        
        return back();
    }

    private function extractYoutubeId(?string $url): ?string
    {
        if (!$url) return null;

        preg_match(
            '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/',
            $url,
            $matches
        );

        return $matches[1] ?? null;
    }
}

<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPostImage;
use App\Models\Category;
use App\Models\City;
use App\Models\Payment;
use App\Models\Post;
use App\Models\PostImage;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('images', 'city', 'ward')->where('status', 'visible')->get();

        return Inertia::render('Home', [
            'posts' => $posts,
            'isHome' => true,

            // statics
            'posts_per_month' => Post::where('status', 'visible')->count(),
            'success_transactions' => Payment::where('status', 'success')->count(),
            'customers' => User::count(),
            'views' => DB::table('post_view_histories')->count(),
        ]);
    }

    public function show($slug)
    {
        $post = Post::with('images', 'city', 'ward', 'user', 'utilities', 'category')
            ->where('slug', $slug)
            ->where('status', 'visible')
            ->firstOrFail();

        // GHI LỊCH SỬ XEM
        if (Auth::check()) {
            $user = Auth::user();

            // Ghi / cập nhật lịch sử xem
            $user->viewedPosts()->syncWithoutDetaching([
                $post->id => [
                    'viewed_at' => now(),
                ],
            ]);

            // GIỮ LẠI 100 TIN GẦN NHẤT
            $viewedIds = $user->viewedPosts()
                ->pluck('posts.id');

            if ($viewedIds->count() > 100) {
                $idsToDelete = $viewedIds->slice(100);

                $user->viewedPosts()->detach($idsToDelete);
            }
        }


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

            if ($post->title !== $validated['title']) {
                $slug = Str::slug($validated['title']);
                $counter = 1;

                while (
                    Post::where('slug', $slug)
                    ->where('id', '!=', $post->id)
                    ->exists()
                ) {
                    $slug = Str::slug($validated['title']) . '-' . $counter++;
                }

                $post->slug = $slug;
            }

            $post->update([
                ...$validated,
                'last_activity_at' => now(),
            ]);

            return redirect()->back()->with('post_id', $post->id);
        }

        $existingDraft = Post::where('user_id', Auth::id())
            ->where('status', 'draft')
            ->latest('last_activity_at')
            ->first();

        if ($existingDraft) {
            if ($existingDraft->title !== $validated['title']) {
                $slug = Str::slug($validated['title']);
                $counter = 1;

                while (
                    Post::where('slug', $slug)
                    ->where('id', '!=', $existingDraft->id)
                    ->exists()
                ) {
                    $slug = Str::slug($validated['title']) . '-' . $counter++;
                }

                $existingDraft->slug = $slug;
            }

            $existingDraft->fill([
                ...$validated,
                'last_activity_at' => now(),
            ])->save();

            return back()->with('post_id', $existingDraft->id);
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
            'last_activity_at' => now(),
            'slug' => $slug,
            'user_id' => Auth::id(),
            'status' => 'draft',
        ]);

        return redirect()->back()->with('post_id', $post->id);
    }


    private function storeStep2(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'images' => 'required|array|min:3|max:24',
            'images.*.path' => 'required|string',
            'images.*.is360' => 'boolean',
            'video' => 'nullable|string',
            'youtube_url' => [
                'nullable',
                'url',
                'regex:/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)/'
            ],
        ], [
            'images.required' => 'Vui lòng đăng tối thiểu 3 ảnh',
            'images.min' => 'Vui lòng đăng tối thiểu 3 ảnh',
            'images.*.max' => 'Ảnh không thể tải lên do quá dung lượng, tối đa 20MB'
        ]);

        if (!empty($validated['video']) && !empty($validated['youtube_url'])) {
            abort(422, 'Chỉ được chọn 1 trong video hoặc YouTube');
        }

        $post = Post::where('id', $validated['post_id'])
            ->where('user_id', Auth::id())
            ->where('status', 'draft')
            ->firstOrFail();

        // xử lý youtube
        $post->update([
            'youtube_url' => $this->extractYoutubeId($validated['youtube_url'] ?? null),
            'video' => $validated['video'] ?? null,
            'last_activity_at' => now(),
        ]);

        // xoá ảnh cũ (nếu cần)
        PostImage::where('post_id', $post->id)->delete();

        foreach ($validated['images'] as $img) {
            $postImage = PostImage::create([
                'post_id' => $post->id,
                'image_path' => $img['path'],   // path R2
                'medium_path' => null,
                'thumb_path' => null,
                'is360' => $img['is360'] ?? false,
            ]);

            // xử lý resize sau bằng queue
            ProcessPostImage::dispatch($postImage->id);
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

    public function edit(Post $post)
    {
        abort_if(
            $post->user_id !== Auth::id(),
            403
        );

        abort_if(
            $post->status === 'visible',
            403,
            'Tin đang hiển thị không được chỉnh sửa'
        );

        return Inertia::render('Posts/Create', [
            'mode' => 'edit',
            'post' => $post->load('images', 'city', 'ward', 'category'),
            'cities' => City::all(),
            'categories' => Category::all(),
            'subscriptions' => Subscription::where('active', true)
                ->orderByDesc('priority')
                ->get(),

            // QUYẾT ĐỊNH STEP 3
            'allowPackage' => $post->status === 'draft',
        ]);
    }


    public function update(Request $request, Post $post)
    {
        abort_if($post->user_id !== Auth::id(), 403);

        abort_if(
            !in_array($post->status, ['draft', 'expired', 'hidden']),
            403
        );

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
            'address_detail.required' => 'Vui lòng nhập số nhà, tên đường',
        ]);

        // update slug nếu đổi title
        if ($post->title !== $validated['title']) {
            $slug = Str::slug($validated['title']);
            $counter = 1;

            while (
                Post::where('slug', $slug)
                ->where('id', '!=', $post->id)
                ->exists()
            ) {
                $slug = Str::slug($validated['title']) . '-' . $counter++;
            }

            $validated['slug'] = $slug;
        }

        $post->update([
            ...$validated,
            'last_activity_at' => now(),
        ]);

        return back()->with('success', 'Cập nhật tin thành công');
    }

    public function updateMedia(Request $request, Post $post)
    {
        abort_if($post->user_id !== Auth::id(), 403);

        abort_if(
            !in_array($post->status, ['draft', 'expired', 'hidden']),
            403
        );

        $validated = $request->validate([
            'images' => 'required|array|min:3|max:24',
            'images.*.path' => 'required|string',
            'images.*.is360' => 'boolean',
            'video' => 'nullable|string',
            'youtube_url' => [
                'nullable',
                'url',
                'regex:/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)/'
            ],
        ]);

        if (!empty($validated['video']) && !empty($validated['youtube_url'])) {
            abort(422, 'Chỉ được chọn 1 trong video hoặc YouTube');
        }

        // update media info
        $post->update([
            'youtube_url' => $this->extractYoutubeId($validated['youtube_url'] ?? null),
            'video' => $validated['video'] ?? null,
            'last_activity_at' => now(),
        ]);

        // reset images
        PostImage::where('post_id', $post->id)->delete();

        foreach ($validated['images'] as $img) {
            $postImage = PostImage::create([
                'post_id' => $post->id,
                'image_path' => $img['path'],
                'medium_path' => null,
                'thumb_path' => null,
                'is360' => $img['is360'] ?? false,
            ]);

            ProcessPostImage::dispatch($postImage->id);
        }

        return back()->with('success', 'Cập nhật hình ảnh thành công');
    }
}

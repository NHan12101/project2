<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\City;
use App\Models\Notification;
use App\Models\Post;
use App\Models\PostImage;
use App\Models\Subscription;
use App\Models\Ward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        ]);
    }

    public function show($slug)
    {
        // Thêm 'user' vào with() để load thông tin người đăng bài
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
        $packages = Subscription::all();

        return Inertia::render('Posts/Create', [
            'cities' => City::all(),
            'wards' => $cityId ? Ward::where('city_id', $cityId)->get() : [],
            'categories' => Category::all(),
            'city_id' => $cityId,
            'ward_id' => $wardId,
            'packages' => $packages,
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());

        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|integer',
            'address' => 'required|string',
            'area' => 'required|numeric',
            'bedrooms' => 'required|integer',
            'bathrooms' => 'required|integer',
            'livingrooms' => 'required|integer',
            'kitchens' => 'required|integer',
            'is_vip' => 'boolean',
            'status' => 'in:hidden,visible',
            'type' => 'required|in:rent,sale',
            'category_id' => 'required|exists:categories,id',
            'city_id' => 'required|exists:cities,id',
            'ward_id' => 'nullable|exists:wards,id',
            'images.*' => 'image|mimes:jpg,png,jpeg,webp|max:5120',
            'subscription_id' => 'required|exists:subscriptions,id',
            'payment_method' => 'required|string',
        ]);

        $validated['user_id'] = Auth::id();

        // ============================

        // Tạo slug từ title
        $slug = Str::slug($validated['title']);

        // Kiểm tra trùng slug, thêm số nếu cần
        $counter = 1;
        while (Post::where('slug', $slug)->exists()) {
            $slug = Str::slug($validated['title']) . '-' . $counter;
            $counter++;
        }

        // Gán slug vào validated
        $validated['slug'] = $slug;

        // ============================

        // Lấy thông tin gói đăng ký
        $subscription = Subscription::find($validated['subscription_id']);

        if ($subscription && $subscription->price == 0) {
            // Gói free hiển thị
            $validated['status'] = 'visible';
            $validated['is_vip'] = true;

            // Set thời gian hết hạn cho gói free
            if (isset($subscription->days)) {
                $validated['package_expired_at'] = now()->addDays($subscription->days);
            }
        } else {
            // Gói trả phí ẩn bài trước khi thanh toán
            $validated['status'] = 'hidden';
        }

        // dd($request->all(), $validated);


        $post = Post::create($validated); // Tạo bài post dưới dạng hidden

        // dd($post->toArray());

        $storageDisk = 'public';
        $destDir = "posts/{$post->id}";

        $savedPaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store($destDir, $storageDisk);
                $savedPaths[] = $path;

                PostImage::create([
                    'post_id' => $post->id,
                    'image_path' => $path,
                ]);
            }
        }

        // Tạo thông báo cho gói free
        if ($post->status === 'visible') {
            Notification::create([
                'user_id' => Auth::id(),
                'type' => 'post_published',
                'data' => [
                    'post_id' => $post->id,
                    'title' => $post->title,
                ],
            ]);
        }

        // Nếu là gói free thì trả về view chi tiết ngay
        if ($subscription && $subscription->price == 0) {
            return Inertia::location(route('propertyDetail.show', $post->slug));
        }

        // Nếu gói trả phí thì tạo session thanh toán
        session([
            'pending_post_id' => $post->id,
            'pending_payment_method' => $validated['payment_method'],
        ]);
        // dd('Session after store', session()->all(), $post->toArray());

        return Inertia::location(route('payments.create'));
    }
}

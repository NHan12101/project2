<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\City;
use App\Models\Post;
use App\Models\PostImage;
use App\Models\Ward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    public function show($id)
    {
        // Thêm 'user' vào with() để load thông tin người đăng bài
        $posts = Post::with('images', 'city', 'ward', 'user')->findOrFail($id);

        $related = Post::with('images', 'city', 'ward')
            ->where('id', '!=', $id)
            ->take(6)
            ->get();

        return Inertia::render('PropertyDetail/PropertyDetail', [
            'post' => $posts,
            'relatedPosts' => $related,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    public function index()
    {
        $posts = Post::with('images', 'city', 'ward')->get();

        return Inertia::render('Home', [
            'auth' => [
                'user' => Auth::user(), // null nếu chưa đăng nhập
            ],

            'posts' => $posts,
        ]);
    }

    public function create(Request $request)
    {
        $cityId = $request->query('city_id');
        $wardId = $request->query('ward_id');

        return Inertia::render('Posts/Create', [
            'cities' => City::all(),
            'wards' => $cityId ? Ward::where('city_id', $cityId)->get() : [],
            'categories' => Category::all(),
            'city_id' => $cityId,
            'ward_id' => $wardId,
        ]);
    }

    public function store(Request $request)
    {
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
            'status' => 'required|in:hidden,visible',
            'type' => 'required|in:rent,sale',
            'category_id' => 'required|exists:categories,id',
            'city_id' => 'required|exists:cities,id',
            'ward_id' => 'nullable|exists:wards,id',
            'images.*' => 'image|mimes:jpg,png,jpeg,webp|max:5120',
        ]);
        $validated['user_id'] = Auth::id();
        
        $post = Post::create($validated); // Tạo bài post

        // lưu hình ảnh
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {

                $path = $image->store('posts', 'public');

                PostImage::create([
                    'post_id' => $post->id,
                    'image_path' => $path,
                ]);
            }
        }

        return redirect()->route('posts.create')->with('success', 'Đăng bài thành công');
    }
}

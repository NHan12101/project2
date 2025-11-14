<?php

namespace App\Http\Controllers;

use App\Models\Post;
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
        // Lấy tất cả posts kèm ảnh và loacation
        $posts = Post::with('images', 'city', 'ward')->get();

        // return response()->json($posts);
        return Inertia::render('Home', [
            'auth' => [
                'user' => Auth::user(), // null nếu chưa đăng nhập
            ],

            'posts' => $posts,
        ]);
    }

    public function create()
    {
        return inertia('Posts/Create', [
            'cities' => \App\Models\City::all(),
            'categories' => \App\Models\Category::all(),
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
        ]);
        
        $validated['user_id'] = Auth::id();

        Post::create($validated);

        return redirect()->route('posts.create')->with('success', 'Đăng bài thành công');
    }
}

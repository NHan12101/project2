<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    public function show($id)
    {
        // Thêm 'user' vào with() để load thông tin người đăng bài
        $posts = Post::with('images', 'location', 'user')->findOrFail($id);

        $related = Post::with('images', 'location')
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
        $posts = Post::with('images', 'location')->get();

        // return response()->json($posts);
        return Inertia::render('Home', [
            'auth' => [
                'user' => Auth::user(), // null nếu chưa đăng nhập
            ],

            'posts' => $posts,
        ]);
    }
}

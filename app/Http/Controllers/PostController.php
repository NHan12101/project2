<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;

class PostController extends Controller
{
    public function show($id)
    {
        $posts = Post::with('images', 'location')->findOrFail($id);

        return Inertia::render('PropertyDetail', ['posts' => $posts]);
    }

    public function index()
    {
        // Lấy tất cả posts kèm ảnh và loacation
        $posts = Post::with('images', 'location')->get();

        // Trả về JSON
        return response()->json($posts);
    }
}

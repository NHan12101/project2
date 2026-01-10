<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostViewedController extends Controller
{
    public function index()
    {
        $posts = Auth::user()
            ->viewedPosts()
            ->where('posts.status', 'visible')
            ->with(['images', 'city', 'ward', 'user'])
            ->limit(100)
            ->get();

        return Inertia::render('Posts/Viewed', [
            'posts' => $posts,
        ]);
    }
}

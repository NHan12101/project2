<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    // Bấm tim (thêm hoặc xóa)
    public function toggle(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id'
        ]);

        $favorite = Favorite::where('user_id', Auth::id())
            ->where('post_id', $request->post_id)
            ->first();

        if ($favorite) {
            $favorite->delete();
        } else {
            Favorite::create([
                'user_id' => Auth::id(),
                'post_id' => $request->post_id
            ]);
        }

        Cache::forget('latest_favorite_post_' . Auth::id());

        return back();
    }

    public function index()
    {
        $savedPosts = Post::with(['user', 'images', 'city', 'ward'])
            ->join('favorites', 'favorites.post_id', '=', 'posts.id')  // Join với bảng favorites
            ->where('favorites.user_id', Auth::id())  // Lọc theo user_id
            ->orderBy('favorites.created_at', 'desc')  // Sắp xếp theo thời gian thêm yêu thích
            ->select('posts.*')  // Chỉ chọn các cột của bảng posts
            ->limit(100)
            ->get();

        return Inertia::render('Posts/SavedList', [
            'savedPosts' => $savedPosts,
        ]);
    }
}

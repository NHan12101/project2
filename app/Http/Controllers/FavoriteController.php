<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        // Không được trả JSON nếu gọi bằng Inertia
        return back();
    }

    // Xóa khỏi trang SavedList
    public function remove(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id'
        ]);

        Favorite::where('user_id', Auth::id())
            ->where('post_id', $request->post_id)
            ->delete();

        // QUAN TRỌNG: Không được trả JSON
        return back();
    }

    // Trả dữ liệu cho SavedList.jsx
    public function index()
    {
        $savedPosts = Post::with(['user', 'images'])
            ->whereIn('id', Favorite::where('user_id', Auth::id())->pluck('post_id'))
            ->latest()
            ->get();

        return Inertia::render('SavedList/SavedList', [
            'savedPosts' => $savedPosts,
            'auth' => [
                'user' => Auth::user()
            ],
        ]);
    }
}

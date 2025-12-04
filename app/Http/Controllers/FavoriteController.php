<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
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

        return redirect()->back(303);        
    }

    public function index() {
        
    }
}

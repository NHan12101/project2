<?php

namespace App\Providers;

use App\Models\Favorite;
use App\Models\Notification;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (request()->isSecure() || request()->header('X-Forwarded-Proto') === 'https') {
            URL::forceScheme('https');
        }

        // Chia sẻ titles toàn cục cho Suggest
        Inertia::share([
            'favoritePostIds' => function () {
                return Favorite::where('user_id', Auth::id())
                    ->pluck('post_id')
                    ->toArray();
            },

            // Chỉ dùng cho Navbar phần hiển thị tin đã lưu
            'latestFavoritePost' => function () {
                if (!Auth::check()) return null;

                return Cache::remember(
                    'latest_favorite_post_' . Auth::id(),
                    now()->addMinutes(5),
                    function () {
                        return Post::with('images')
                            ->join('favorites', 'favorites.post_id', '=', 'posts.id')
                            ->where('favorites.user_id', Auth::id())
                            ->orderBy('favorites.created_at', 'desc')
                            ->select('posts.*')
                            ->first();
                    }
                );
            },

            'notifications' => function () {
                return Notification::where('user_id', Auth::id())
                    ->orderBy('created_at', 'desc')
                    ->get();
            },

            'suggestTitles' => function () {
                return Post::pluck('title'); // chỉ lấy title
            },
        ]);
    }
}

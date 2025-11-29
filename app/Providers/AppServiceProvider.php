<?php

namespace App\Providers;

use App\Models\Post;
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
            'suggestTitles' => function () {
                return Post::pluck('title'); // chỉ lấy title
            },
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\City;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FilterController extends Controller
{
    public function index(Request $request)
    {
        // DEBUG: Log tất cả parameters
        Log::info('Filter Request:', $request->all());

        $query = Post::with(['images', 'city', 'ward', 'category'])->where('status', 'visible');

        // --- KEYWORD ---
        if ($request->filled('keyword')) {
            $keyword = trim($request->keyword);
            $words = preg_split('/\s+/', $keyword);

            $query->where(function ($q) use ($words) {
                foreach ($words as $w) {
                    if ($w !== '') {
                        $q->orWhere('title', 'LIKE', "%$w%");
                    }
                }
            });
        }

        // --- SIMPLE FILTERS ---
        $query->when($request->filled('city_id'), fn($q) => $q->where('city_id', $request->city_id));

        $query->when($request->filled('ward_id'), fn($q) => $q->where('ward_id', $request->ward_id));

        $query->when($request->filled('category_id'), fn($q) => $q->where('category_id', $request->category_id));

        // --- HƯỚNG NHÀ ---
        if ($request->filled('direction')) {

            Log::info('Direction filter:', ['direction' => $request->direction]);

            $query->where('direction', $request->direction);
        }

        // --- GIẤY TỜ PHÁP LÝ ---
        if ($request->filled('legal')) {
            Log::info('Legal doc filter:', ['legal' => $request->legal]);

            $query->where('legal', $request->legal);
        }

        // --- TYPE (sale / rent) ---
        if ($request->filled('type')) {
            if ($request->type === 'sale') {
                $query->where('type', 'sale');
            }
            if ($request->type === 'rent') {
                $query->where('type', 'rent');
            }
        }

        // --- PRICE ---
        if ($request->filled('minPrice') && $request->filled('maxPrice')) {
            $minPrice = (float)$request->minPrice;
            $maxPrice = (float)$request->maxPrice;

            Log::info('Price range filter:', compact('minPrice', 'maxPrice'));

            $query->whereBetween('price', [$minPrice, $maxPrice]);
        } else {
            if ($request->filled('minPrice')) {
                $minPrice = (float)$request->minPrice;

                Log::info('Min price filter:', compact('minPrice'));

                $query->where('price', '>=', $minPrice);
            }
            if ($request->filled('maxPrice')) {
                $maxPrice = (float)$request->maxPrice;

                Log::info('Max price filter:', compact('maxPrice'));

                $query->where('price', '<=', $maxPrice);
            }
        }

        // --- AREA ---
        if ($request->filled('minArea') && $request->filled('maxArea')) {
            $minArea = (float)$request->minArea;
            $maxArea = (float)$request->maxArea;

            Log::info('Area range filter:', compact('minArea', 'maxArea'));

            $query->whereBetween('area', [$minArea, $maxArea]);
        } else {
            if ($request->filled('minArea')) {
                $minArea = (float)$request->minArea;

                Log::info('Min area filter:', compact('minArea'));

                $query->where('area', '>=', $minArea);
            }
            if ($request->filled('maxArea')) {
                $maxArea = (float)$request->maxArea;

                Log::info('Max area filter:', compact('maxArea'));

                $query->where('area', '<=', $maxArea);
            }
        }

        // --- BEDROOMS ---
        if ($request->filled('bedrooms')) {
            $bedrooms = (int)$request->bedrooms;

            Log::info('Bedrooms filter:', compact('bedrooms'));

            $query->where('bedrooms', $bedrooms); // Đổi lại thành = thay vì >=
        }

        // --- SORT ---
        switch ($request->sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'area_asc':
                $query->orderBy('area', 'asc');
                break;
            case 'area_desc':
                $query->orderBy('area', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        // DEBUG: Log SQL query
        Log::info('SQL Query:', [
            'sql' => $query->toSql(),
            'bindings' => $query->getBindings()
        ]);

        $posts = $query->paginate(20)->withQueryString();

        return Inertia::render('Posts/HomeFinder', [
            'list' => $posts,
            'cities' => City::all(),
            'categories' => Category::all(),
            'filters' => $request->all(),
        ]);
    }
}

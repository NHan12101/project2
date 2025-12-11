<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\City;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FilterController extends Controller
{
    public function index(Request $request)
    {
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
        $query->when($request->filled('minPrice'), fn($q) => $q->where('price', '>=', $request->minPrice));
        $query->when($request->filled('maxPrice'), fn($q) => $q->where('price', '<=', $request->maxPrice));

        // --- AREA ---
        $query->when($request->filled('minArea'), fn($q) => $q->where('area', '>=', $request->minArea));
        $query->when($request->filled('maxArea'), fn($q) => $q->where('area', '<=', $request->maxArea));

        // --- BEDROOMS ---
        $query->when($request->filled('bedrooms'), fn($q) => $q->where('bedrooms', $request->bedrooms));

        // --- SORT ---
        switch ($request->sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
        }

        $posts = $query->paginate(20)->withQueryString();

        return Inertia::render('Posts/HomeFinder', [
            'list' => $posts,
            'cities' => City::all(),
            'categories' => Category::all(),
            'filters' => $request->all(),
        ]);
    }
}

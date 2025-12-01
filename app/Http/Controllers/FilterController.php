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
        $query = Post::with(['images', 'city', 'ward', 'category']);

        // --- FILTER BY KEYWORD ---
        if ($request->keyword) {
            $words = explode(' ', $request->keyword);
            $query->where(function ($q) use ($words) {
                foreach ($words as $w) {
                    $q->orWhere('title', 'LIKE', "%$w%");
                }
            });
        }

        // --- FILTER BY CITY ---
        if ($request->city_id) {
            $query->where('city_id', $request->city_id);
        }

        // --- FILTER BY WARD ---
        if ($request->ward_id) {
            $query->where('ward_id', $request->ward_id);
        }

        // --- FILTER BY CATEGORY ---
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // --- PRICE ---
        if ($request->minPrice) {
            $query->where('price', '>=', $request->minPrice);
        }
        if ($request->maxPrice) {
            $query->where('price', '<=', $request->maxPrice);
        }

        // --- AREA ---
        if ($request->minArea) {
            $query->where('area', '>=', $request->minArea);
        }
        if ($request->maxArea) {
            $query->where('area', '<=', $request->maxArea);
        }

        // --- BEDROOMS ---
        if ($request->bedrooms) {
            $query->where('bedrooms', $request->bedrooms);
        }

        // --- SORT ---
        if ($request->sort === 'price_asc') {
            $query->orderBy('price', 'asc');
        }
        if ($request->sort === 'price_desc') {
            $query->orderBy('price', 'desc');
        }

        // --- RETURN filters to frontend ---
        $filters = $request->only([
            'keyword',
            'city_id',
            'ward_id',
            'category_id',
            'minPrice',
            'maxPrice',
            'minArea',
            'maxArea',
            'bedrooms',
            'sort',
        ]);

        return Inertia::render('Posts/HomeFinder', [
            'list' => $query->get(),
            'cities' => City::all(),
            'categories' => Category::all(),
            'filters' => $filters,
        ]);
    }
}

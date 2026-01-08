<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class MapboxGeocodeController
{
    /**
     * Geocode full address (confirm address)
     * Dùng khi user bấm "Xác nhận"
     */
    public function geocode(Request $request)
    {
        $request->validate([
            'address' => 'required|string|min:5',
        ]);

        $address = trim($request->address);

        $cacheKey = 'mapbox:geocode:' . md5($address);

        return Cache::remember($cacheKey, now()->addDays(7), function () use ($address) {
            $response = Http::timeout(5)->get(
                'https://api.mapbox.com/geocoding/v5/mapbox.places/' .
                    urlencode($address) . '.json',
                [
                    'access_token' => config('services.mapbox.token'),
                    'limit'        => 1,
                    'country'      => 'VN',
                    'language'     => 'vi',
                    'types'        => 'address',
                ]
            );

            if (!$response->successful()) {
                return ['features' => []];
            }

            return $response->json();
        });
    }

    /**
     * Autocomplete street / address
     * Dùng khi user đang gõ
     */
    public function autocomplete(Request $request)
    {
        $request->validate([
            'query'           => 'required|string|min:3',
            'proximity.lat'   => 'nullable|numeric',
            'proximity.lng'   => 'nullable|numeric',
        ]);

        $query     = trim($request->input('query'));
        $proximity = $request->input('proximity');

        if (!$query) {
            return response()->json(['features' => []]);
        }

        $params = [
            'access_token' => config('services.mapbox.token'),
            'autocomplete' => true,
            'limit'        => 5,
            'country'      => 'VN',
            'types'        => 'street,place,locality',
        ];

        if (
            is_array($proximity) &&
            isset($proximity['lat'], $proximity['lng'])
        ) {
            $params['proximity'] =
                $proximity['lng'] . ',' . $proximity['lat'];
        }

        $cacheKey = 'mapbox:autocomplete:' . md5(
            $query . json_encode($params['proximity'] ?? null)
        );

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use (
            $query,
            $params
        ) {
            $response = Http::timeout(5)->get(
                'https://api.mapbox.com/geocoding/v5/mapbox.places/' .
                    urlencode($query) . '.json',
                $params
            );

            if (!$response->successful()) {
                return ['features' => []];
            }

            return $response->json();
        });
    }
}

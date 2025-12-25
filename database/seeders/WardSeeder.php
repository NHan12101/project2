<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;
use App\Models\Ward;
use Illuminate\Support\Facades\Http;

class WardSeeder extends Seeder
{
    protected string $jsonFile;
    protected string $cacheFile;

    public function __construct()
    {
        $this->jsonFile = storage_path('app/all_wards.json');     // toàn bộ dữ liệu ward
        $this->cacheFile = storage_path('app/geocode_cache.json'); // cache tọa độ Mapbox
    }

    public function run(): void
    {
        $cache = file_exists($this->cacheFile) ? json_decode(file_get_contents($this->cacheFile), true) : [];

        // Nếu JSON tồn tại → seed trực tiếp từ file, cực nhanh
        if (file_exists($this->jsonFile)) {
            $allWards = json_decode(file_get_contents($this->jsonFile), true);
            foreach ($allWards as $ward) {
                Ward::create($ward);
            }
            return;
        }

        // Nếu chưa có JSON → gọi API + Mapbox
        $cities = City::all();
        $allWards = [];

        foreach ($cities as $city) {
            $url = "https://34tinhthanh.com/api/wards?province_code=" . $city->province_code;
            $response = Http::retry(5, 300)->get($url);

            if (!$response->successful()) {
                echo "API lỗi HTTP tại: {$city->name}\n";
                continue;
            }

            $json = $response->json();
            $wards = $json['data'] ?? (is_array($json) ? $json : []);

            foreach ($wards as $ward) {
                if (!isset($ward['ward_name'], $ward['ward_code'])) {
                    echo "Bỏ qua ward do thiếu 'ward_name' hoặc 'ward_code'\n";
                    continue;
                }

                // Lấy tọa độ Mapbox (có cache)
                $coords = $this->geocodeWard($ward['ward_name'], $city->name, $city->latitude, $city->longitude, $cache);

                $wardData = [
                    'ward_code' => $ward['ward_code'],
                    'ward_name' => $ward['ward_name'],
                    'city_id'   => $city->id,
                    'latitude'  => $coords['lat'],
                    'longitude' => $coords['lng'],
                ];

                Ward::create($wardData);
                $allWards[] = $wardData;

                usleep(200000); // tránh rate-limit
            }
        }

        // Lưu cache Mapbox
        file_put_contents($this->cacheFile, json_encode($cache, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        // Lưu toàn bộ ward vào JSON → seed offline lần sau
        file_put_contents($this->jsonFile, json_encode($allWards, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        echo "Seed API + Mapbox hoàn tất! Tổng ward: " . count($allWards) . "\n";
    }

    protected function geocodeWard(string $wardName, string $cityName, float $cityLat, float $cityLng, array &$cache): array
    {
        $cacheKey = "{$wardName}_{$cityName}";
        if (isset($cache[$cacheKey])) {
            return $cache[$cacheKey];
        }

        try {
            $response = Http::get('https://api.mapbox.com/geocoding/v5/mapbox.places/' .
                urlencode("$wardName, $cityName, Việt Nam") . '.json', [
                    'access_token' => config('services.mapbox.token'),
                    'limit' => 1,
                ])->json();

            if (!empty($response['features'][0]['center'])) {
                $result = [
                    'lat' => $response['features'][0]['center'][1],
                    'lng' => $response['features'][0]['center'][0],
                ];
            } else {
                $result = ['lat' => $cityLat, 'lng' => $cityLng];
            }
        } catch (\Throwable $e) {
            $result = ['lat' => $cityLat, 'lng' => $cityLng];
            echo "Geocode lỗi: {$wardName}, {$cityName}\n";
        }

        // Thêm offset nhỏ tránh marker trùng nhau
        $result['lat'] += mt_rand(-5, 5) * 0.00005;
        $result['lng'] += mt_rand(-5, 5) * 0.00005;

        $cache[$cacheKey] = $result;

        return $result;
    }
}

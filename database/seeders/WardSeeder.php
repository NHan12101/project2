<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;
use App\Models\Ward;
use Illuminate\Support\Facades\Http;

class WardSeeder extends Seeder
{
    public function run(): void
    {
        $cities = City::all();

        foreach ($cities as $city) {
            $url = "https://34tinhthanh.com/api/wards?province_code=" . $city->province_code;

            $response = Http::retry(5, 300)->get($url);

            if (!$response->successful()) {
                echo "API lỗi HTTP tại: {$city->name}\n";
                continue;
            }
            $json = $response->json();

            if (isset($json['data'])) {
                $wards = $json['data'];
            } else if (is_array($json)) {
                $wards = $json; // API trả mảng trực tiếp
            } else {
                echo "API không phải là mảng tại {$city->name}\n";
                continue;
            }
            foreach ($wards as $ward) {
                if (!isset($ward['ward_name']) || !isset($ward['ward_code'])) {
                    echo "Bỏ qua ward do thiếu key 'ward_name' hoặc 'ward_code'\n";
                    continue;
                }
                Ward::create([
                    'ward_code' => $ward['ward_code'],
                    'ward_name' => $ward['ward_name'],
                    'city_id'   => $city->id,
                ]);
            }
        }
    }
}

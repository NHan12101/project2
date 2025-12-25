<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $cities = [
            '01' => ['name' => 'Thành phố Hà Nội', 'lat' => 21.0285, 'lng' => 105.8542],
            '79' => ['name' => 'Thành phố Hồ Chí Minh', 'lat' => 10.7769, 'lng' => 106.7009],
            '31' => ['name' => 'Thành phố Hải Phòng', 'lat' => 20.8449, 'lng' => 106.6881],
            '92' => ['name' => 'Thành phố Cần Thơ', 'lat' => 10.0452, 'lng' => 105.7469],
            '48' => ['name' => 'Thành phố Đà Nẵng', 'lat' => 16.0544, 'lng' => 108.2022],
            '46' => ['name' => 'Thành phố Huế', 'lat' => 16.4637, 'lng' => 107.5909],
            '08' => ['name' => 'Tuyên Quang', 'lat' => 21.8230, 'lng' => 105.2143],
            '15' => ['name' => 'Lào Cai', 'lat' => 22.4856, 'lng' => 103.9707],
            '19' => ['name' => 'Thái Nguyên', 'lat' => 21.5942, 'lng' => 105.8480],
            '25' => ['name' => 'Phú Thọ', 'lat' => 21.3227, 'lng' => 105.4019],
            '24' => ['name' => 'Bắc Ninh', 'lat' => 21.1861, 'lng' => 106.0763],
            '33' => ['name' => 'Hưng Yên', 'lat' => 20.6464, 'lng' => 106.0511],
            '37' => ['name' => 'Ninh Bình', 'lat' => 20.2506, 'lng' => 105.9745],
            '04' => ['name' => 'Cao Bằng', 'lat' => 22.6666, 'lng' => 106.2639],
            '20' => ['name' => 'Lạng Sơn', 'lat' => 21.8537, 'lng' => 106.7610],
            '12' => ['name' => 'Lai Châu', 'lat' => 22.3862, 'lng' => 103.4582],
            '11' => ['name' => 'Điện Biên', 'lat' => 21.3853, 'lng' => 103.0169],
            '14' => ['name' => 'Sơn La', 'lat' => 21.1022, 'lng' => 103.7289],
            '22' => ['name' => 'Quảng Ninh', 'lat' => 21.0064, 'lng' => 107.2925],
            '38' => ['name' => 'Thanh Hóa', 'lat' => 19.8067, 'lng' => 105.7852],
            '40' => ['name' => 'Nghệ An', 'lat' => 18.6796, 'lng' => 105.6813],
            '42' => ['name' => 'Hà Tĩnh', 'lat' => 18.3559, 'lng' => 105.8877],
            '44' => ['name' => 'Quảng Trị', 'lat' => 16.7465, 'lng' => 107.1850],
            '51' => ['name' => 'Quảng Ngãi', 'lat' => 15.1200, 'lng' => 108.7920],
            '52' => ['name' => 'Gia Lai', 'lat' => 13.9833, 'lng' => 108.0000],
            '56' => ['name' => 'Khánh Hòa', 'lat' => 12.2585, 'lng' => 109.0526],
            '68' => ['name' => 'Lâm Đồng', 'lat' => 11.9404, 'lng' => 108.4583],
            '66' => ['name' => 'Đắk Lắk', 'lat' => 12.7100, 'lng' => 108.2378],
            '75' => ['name' => 'Đồng Nai', 'lat' => 10.9574, 'lng' => 106.8420],
            '80' => ['name' => 'Tây Ninh', 'lat' => 11.3350, 'lng' => 106.1099],
            '86' => ['name' => 'Vĩnh Long', 'lat' => 10.2537, 'lng' => 105.9722],
            '82' => ['name' => 'Đồng Tháp', 'lat' => 10.4938, 'lng' => 105.6882],
            '96' => ['name' => 'Cà Mau', 'lat' => 9.1760, 'lng' => 105.1500],
            '91' => ['name' => 'An Giang', 'lat' => 10.5216, 'lng' => 105.1259],
        ];

        $order = 1;

        foreach ($cities as $province_code => $data) {
            City::updateOrCreate(
                ['province_code' => $province_code],
                [
                    'name'      => $data['name'],
                    'order'     => $order++,
                    'latitude'  => $data['lat'],
                    'longitude' => $data['lng'],
                ]
            );
        }
    }
}

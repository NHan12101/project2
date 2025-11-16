<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        // province_code => name
        $cities = [
            '01' => 'Thành phố Hà Nội',
            '79' => 'Thành phố Hồ Chí Minh',
            '31' => 'Thành phố Hải Phòng',
            '92' => 'Thành phố Cần Thơ',
            '48' => 'Thành phố Đà Nẵng',
            '46' => 'Thành phố Huế',
            '08' => 'Tuyên Quang',
            '15' => 'Lào Cai',
            '19' => 'Thái Nguyên',
            '25' => 'Phú Thọ',
            '24' => 'Bắc Ninh',
            '33' => 'Hưng Yên',
            '37' => 'Ninh Bình',
            '04' => 'Cao Bằng',
            '20' => 'Lạng Sơn',
            '12' => 'Lai Châu',
            '11' => 'Điện Biên',
            '14' => 'Sơn La',
            '22' => 'Quảng Ninh',
            '38' => 'Thanh Hóa',
            '40' => 'Nghệ An',
            '42' => 'Hà Tĩnh',
            '44' => 'Quảng Trị',
            '51' => 'Quảng Ngãi',
            '52' => 'Gia Lai',
            '56' => 'Khánh Hòa',
            '68' => 'Lâm Đồng',
            '66' => 'Đắk Lắk',
            '75' => 'Đồng Nai',
            '80' => 'Tây Ninh',
            '86' => 'Vĩnh Long',
            '82' => 'Đồng Tháp',
            '96' => 'Cà Mau',
            '91' => 'An Giang',
        ];

        $order = 1;

        foreach ($cities as $province_code => $name) {
            City::updateOrCreate(
                ['province_code' => $province_code],
                [
                    'name'  => $name,
                    'order' => $order++,
                ]
            );
        }
    }
}

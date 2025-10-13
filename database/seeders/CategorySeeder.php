<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Căn hộ', 'Nhà phố', 'Biệt thự', 'Phòng trọ', 'Studio'];

        foreach ($categories as $cat) {
            Category::create([
                'name' => $cat,
            ]);
        }
    }
}

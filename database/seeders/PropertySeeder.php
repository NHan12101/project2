<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\PropertyImage;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        Property::factory(50)->create()->each(function ($property) {
            $images = [
                'images/home1.png',
                'images/home2.png',
                'images/home3.png',
            ];
            foreach ($images as $img) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $img,
                ]);
            }
        });
    }
}

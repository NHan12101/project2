import { Head } from '@inertiajs/react';
import { MapPin } from 'lucide-react';

export default function PropertyDetail({ posts }) {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Head title={posts.title} />
            <h1 className="">{posts.title}</h1>

            <div className="">
                {posts.images.map((img, index) => (
                    <img
                        key={index}
                        src={`/${img.image_path}`}
                        alt=""
                        className=""
                    />
                ))}
            </div>

            <p className="text-lg font-semibold text-red-500 mb-2">
                {posts.price}
            </p>
            <p>
                <MapPin className="w-5 h-5 inline" /> {posts.location.City}
            </p>
            <p className="mt-2 text-gray-600">
                {posts.area}m² • {posts.bedrooms} phòng ngủ
            </p>
            <p className="mt-4 text-gray-700">{posts.description}</p>
        </div>
    );
}

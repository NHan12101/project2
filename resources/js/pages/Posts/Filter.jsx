import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Filter({ filters }) {

    const [form, setForm] = useState({
        type: filters.type || '',
        category_id: filters.category_id || '',
        city_id: filters.city_id || '',
        ward_id: filters.ward_id || '',
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
        min_area: filters.min_area || '',
        max_area: filters.max_area || '',
        bedrooms: filters.bedrooms || '',
        bathrooms: filters.bathrooms || '',
        keyword: filters.keyword || '',
    });

    const updateFilter = (key, value) => {
        setForm({ ...form, [key]: value });

        router.get('/posts', { ...form, [key]: value }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            {/* Loại giao dịch */}
            <select
                value={form.type}
                onChange={e => updateFilter('type', e.target.value)}
                className="border p-2 rounded w-full mb-3"
            >
                <option value="">Loại giao dịch</option>
                <option value="rent">Cho thuê</option>
                <option value="sale">Bán</option>
            </select>

            {/* Keyword */}
            <input
                type="text"
                placeholder="Tìm theo tên hoặc địa chỉ"
                value={form.keyword}
                onChange={e => updateFilter('keyword', e.target.value)}
                className="border p-2 rounded w-full"
            />
        </div>
    );
}

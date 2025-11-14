import { useForm } from '@inertiajs/react';

export default function Create({ cities, categories }) {

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        price: '',
        address: '',
        area: '',
        bedrooms: 0,
        bathrooms: 0,
        livingrooms: 0,
        kitchens: 0,
        is_vip: false,
        status: 'visible',
        type: 'rent',
        category_id: '',
        city_id: '',
        ward_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/posts');
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <input type="text" placeholder="Tiêu đề"
                value={data.title}
                onChange={e => setData('title', e.target.value)}
            />
            {errors.title && <div>{errors.title}</div>}

            {errors && <pre>{JSON.stringify(errors, null, 2)}</pre>}


            <textarea placeholder="Mô tả"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
            />
            {errors.description && <div>{errors.description}</div>}

            <input type="number" placeholder="Giá"
                value={data.price}
                onChange={e => setData('price', e.target.value)}
            />

            <input type="text" placeholder="Địa chỉ"
                value={data.address}
                onChange={e => setData('address', e.target.value)}
            />

            <input type="number" placeholder="Diện tích"
                value={data.area}
                onChange={e => setData('area', e.target.value)}
            />

            <select
                value={data.category_id}
                onChange={e => setData('category_id', e.target.value)}
            >
                <option value="">Chọn danh mục</option>
                {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            <select
                value={data.city_id}
                onChange={e => setData('city_id', e.target.value)}
            >
                <option value="">Chọn thành phố</option>
                {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                ))}
            </select>

            <button disabled={processing}>Đăng bài</button>
        </form>
    );
}

import { useForm } from '@inertiajs/react';
import './Create.css';

export default function Create({ cities, categories }) {
    console.log(cities)
    console.log(categories)
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
    });

    const submit = (e) => {
        e.preventDefault();
        post('/posts');
    };

    return (
        <form className="post-form" onSubmit={submit}>
            {/* Title */}
            <div className="post-form__field">
                <label className="post-form__label">Tiêu đề</label>
                <input
                    className="post-form__input"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                />
                {errors.title && (
                    <div className="post-form__error">{errors.title}</div>
                )}
            </div>

            {/* Description */}
            <div className="post-form__field">
                <label className="post-form__label">Mô tả</label>
                <textarea
                    className="post-form__textarea"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                {errors.description && (
                    <div className="post-form__error">{errors.description}</div>
                )}
            </div>

            {/* Price */}
            <div className="post-form__field">
                <label className="post-form__label">Giá</label>
                <input
                    className="post-form__input"
                    type="number"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                />
            </div>

            {/* Address */}
            <div className="post-form__field">
                <label className="post-form__label">Địa chỉ</label>
                <input
                    className="post-form__input"
                    type="text"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                />
            </div>

            {/* Area */}
            <div className="post-form__field">
                <label className="post-form__label">Diện tích (m²)</label>
                <input
                    className="post-form__input"
                    type="number"
                    value={data.area}
                    onChange={(e) => setData('area', e.target.value)}
                />
            </div>

            {/* Bedrooms */}
            <div className="post-form__field">
                <label className="post-form__label">Số phòng ngủ</label>
                <input
                    className="post-form__input"
                    type="number"
                    value={data.bedrooms}
                    onChange={(e) => setData('bedrooms', e.target.value)}
                />
            </div>

            {/* Bathrooms */}
            <div className="post-form__field">
                <label className="post-form__label">Số phòng tắm</label>
                <input
                    className="post-form__input"
                    type="number"
                    value={data.bathrooms}
                    onChange={(e) => setData('bathrooms', e.target.value)}
                />
            </div>

            {/* Livingrooms */}
            <div className="post-form__field">
                <label className="post-form__label">Phòng khách</label>
                <input
                    className="post-form__input"
                    type="number"
                    value={data.livingrooms}
                    onChange={(e) => setData('livingrooms', e.target.value)}
                />
            </div>

            {/* Kitchens */}
            <div className="post-form__field">
                <label className="post-form__label">Phòng bếp</label>
                <input
                    className="post-form__input"
                    type="number"
                    value={data.kitchens}
                    onChange={(e) => setData('kitchens', e.target.value)}
                />
            </div>

            {/* VIP Checkbox */}
            <div className="post-form__field post-form__field--row">
                <input
                    type="checkbox"
                    checked={data.is_vip}
                    onChange={(e) => setData('is_vip', e.target.checked)}
                />
                <label className="post-form__label-inline">Đăng VIP</label>
            </div>

            {/* Status */}
            <div className="post-form__field">
                <label className="post-form__label">Trạng thái</label>
                <select
                    className="post-form__select"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                >
                    <option value="visible">Hiển thị</option>
                    <option value="hidden">Ẩn</option>
                </select>
            </div>

            {/* Type */}
            <div className="post-form__field">
                <label className="post-form__label">Loại hình</label>
                <select
                    className="post-form__select"
                    value={data.type}
                    onChange={(e) => setData('type', e.target.value)}
                >
                    <option value="rent">Cho thuê</option>
                    <option value="sale">Bán</option>
                </select>
            </div>

            {/* Category */}
            <div className="post-form__field">
                <label className="post-form__label">Danh mục</label>
                <select
                    className="post-form__select"
                    value={data.category_id}
                    onChange={(e) => setData('category_id', e.target.value)}
                >
                    <option value="">Chọn danh mục</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* City */}
            <div className="post-form__field">
                <label className="post-form__label">Thành phố</label>
                <select
                    className="post-form__select"
                    value={data.city_id}
                    onChange={(e) => setData('city_id', e.target.value)}
                >
                    <option value="">Chọn thành phố</option>
                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Submit */}
            <button className="post-form__button" disabled={processing}>
                Đăng bài
            </button>
        </form>
    );
}

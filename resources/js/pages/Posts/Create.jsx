import { router, useForm } from '@inertiajs/react';
import Navbar from '../components/Headers/Navbar/Navbar.jsx';
import './Create.css';

export default function Create({
    cities,
    wards,
    categories,
    city_id,
    ward_id,
    packages,
}) {
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
        status: 'hidden',
        type: 'rent',
        category_id: '',
        city_id: city_id ?? '',
        ward_id: ward_id ?? '',
        images: [],
        subscription_id: '',
        payment_method: 'momo',
    });

    const submit = (e) => {
        e.preventDefault();
        console.log('Form data sắp gửi:', data); // kiểm tra dữ liệu trước khi post
        router.post('/posts', data, {
            onSuccess: () => router.visit('/payments/create'),
        });
    };

    function handleCityChange(e) {
        const value = e.target.value;

        setData('city_id', value);
        setData('ward_id', ''); // reset ward khi đổi city

        router.visit(`/posts/create?city_id=${value}`, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function handleWardChange(e) {
        const value = e.target.value;

        setData('ward_id', value);

        router.visit(`/posts/create?city_id=${data.city_id}&ward_id=${value}`, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <>
            <Navbar />

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
                        <div className="post-form__error">
                            {errors.description}
                        </div>
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
                        onChange={handleCityChange}
                    >
                        <option value="">Chọn thành phố</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="post-form__field">
                    <label className="post-form__label">Phường / Xã</label>
                    <select
                        className="post-form__select"
                        value={data.ward_id}
                        onChange={handleWardChange}
                    >
                        <option value="">Chọn Phường Xã</option>
                        {wards.map((ward) => (
                            <option key={ward.id} value={ward.id}>
                                {ward.ward_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Chọn gói</label>
                    <select
                        value={data.subscription_id}
                        onChange={(e) =>
                            setData('subscription_id', e.target.value)
                        }
                    >
                        <option value="">-- Chọn gói --</option>
                        {packages.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>
                                {pkg.name} - {pkg.price} {pkg.currency}
                            </option>
                        ))}
                    </select>
                    {errors.subscription_id && (
                        <div className="error">{errors.subscription_id}</div>
                    )}
                </div>

                <div>
                    <label>Phương thức thanh toán</label>
                    <select
                        value={data.payment_method}
                        onChange={(e) =>
                            setData('payment_method', e.target.value)
                        }
                    >
                        <option value="momo">MoMo</option>
                        <option value="vnpay">VNPay</option>
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>

                <div className="post-form__field">
                    <label className="post-form__label">Hình ảnh</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setData('images', e.target.files)}
                    />
                </div>

                {/* Submit */}
                <button className="post-form__button" disabled={processing}>
                    Đăng bài & Thanh toán
                </button>
            </form>
        </>
    );
}

import { router, useForm } from '@inertiajs/react';
import Navbar from '../components/Headers/Navbar/Navbar.jsx';
import './Create.css';

export default function Create({
    cities,
    wards,
    categories,
    city_id,
    ward_id,
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
        status: 'visible',
        type: 'rent',
        category_id: '',
        city_id: city_id ?? '',
        ward_id: ward_id ?? '',
        images: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post('/posts');
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

            <div className="main-contain">
                <div className="post-form">
                    <div className="post-form__field">
                        <label className="post-form__label">Tiêu đề</label>
                        <input
                            className="post-form__input"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && (
                            <div className="post-form__error">
                                {errors.title}
                            </div>
                        )}
                    </div>

                    <div className="post-form__file--primary">
                        <input
                            type="file"
                            id="img-post"
                            style={{ display: 'none' }}
                        />
                        <label
                            htmlFor="img-post"
                            style={{
                                height: 60,
                                width: 60,
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid red',
                                background: 'red'
                            }}
                        >
                            Hình ảnh
                        </label>
                    </div>
                    <div>
                        <div className="post-form__file"></div>
                        <div className="post-form__file"></div>
                        <div className="post-form__file"></div>
                        <div className="post-form__file"></div>
                    </div>
                </div>
            </div>
        </>
    );
}

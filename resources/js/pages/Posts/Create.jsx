import { router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import './Create.css';
import AdditionalInfoSection from './sections/AdditionalInfoSection.jsx';
import AddressSection from './sections/AddressSection.jsx';
import DemandSection from './sections/DemandSection.jsx';
import MainInfoSection from './sections/MainInfoSection.jsx';
import PostContentSection from './sections/PostContentSection.jsx';
import PostMediaSection from './sections/PostMediaSection.jsx';
import PostPackageSection from './sections/PostPackageSection.jsx';

export default function Create({
    cities,
    categories,
    city_id,
    ward_id,
    subscriptions,
}) {
    const form = useForm({
        title: '',
        description: '',
        price: '',
        address: '',
        address_detail: '',
        area: '',
        bedrooms: 0,
        bathrooms: 0,
        livingrooms: 0,
        kitchens: 0,
        floors: 0,
        type: null,
        category_id: '',
        city_id: city_id ?? '',
        ward_id: ward_id ?? '',
        direction: '',
        legal: '',
        furniture: '',
        latitude: '',
        longitude: '',
        images: [],
        video: null,
        youtube_url: '',
        step: 1,
        post_id: '',
        subscription_id: '',
        days: 15,
        payment_method: 'momo',
    });

    const [step, setStep] = useState(1);

    useEffect(() => {
        const raw = sessionStorage.getItem('create-post-draft');
        if (!raw) return;

        try {
            const { data, savedAt } = JSON.parse(raw);

            // timeout 2 phút
            if (Date.now() - savedAt > 2 * 60 * 1000) {
                sessionStorage.removeItem('create-post-draft');
                return;
            }

            form.setData(data);
            setStep(data.step ?? 1);
        } catch (e) {
            sessionStorage.removeItem('create-post-draft');
        }
    }, []);

    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

    useEffect(() => {
        if (
            !showAdditionalInfo &&
            form.data.category_id &&
            Number(form.data.area) > 0 &&
            Number(form.data.price) > 0
        ) {
            setShowAdditionalInfo(true);
            form.clearErrors();
        }
    }, [
        showAdditionalInfo,
        form.data.category_id,
        form.data.area,
        form.data.price,
    ]);

    useEffect(() => {
        if (step !== 1) return;

        const t = setTimeout(() => {
            sessionStorage.setItem(
                'create-post-draft',
                JSON.stringify({
                    data: form.data,
                    savedAt: Date.now(),
                }),
            );
        }, 500);

        return () => clearTimeout(t);
    }, [form.data, step]);

    function submitStep1() {
        form.setData('step', 1);

        form.post('/posts', {
            preserveScroll: true,
            onSuccess: (page) => {
                form.setData('post_id', page.props.flash.post_id);
                setStep(2);
            },
        });
    }

    function submitStep2(e) {
        e.preventDefault();

        const fd = new FormData();

        fd.append('step', 2);
        fd.append('post_id', form.data.post_id);

        // youtube
        if (form.data.youtube_url) {
            fd.append('youtube_url', form.data.youtube_url);
        }

        // images
        const images360Indexes = [];

        form.data.images.forEach((img, index) => {
            fd.append('images[]', img.file);
            if (img.is360) images360Indexes.push(index);
        });

        // images 360
        images360Indexes.forEach((i) => {
            fd.append('images_360[]', i);
        });

        if (form.data.video) {
            fd.append('video', form.data.video);
        }

        router.post('/posts', fd, {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                sessionStorage.removeItem('create-post-draft');
                setStep(3);
            },
        });
    }

    function submitStep3() {
        form.post(
            `/posts/${form.data.post_id}/package`,
            {
                subscription_id: form.data.subscription_id,
                days: form.data.days,
                payment_method: form.data.payment_method,
            },
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <section className="post-create">
            {/* Phần hiển thị các bước đang làm */}
            <div className="post-create__header">
                <div className="post-create__header-top">
                    <h1 className="post-create__title">Tạo tin đăng</h1>

                    <div className="post-create__actions">
                        <button className="post-create__action post-create__action--preview">
                            <img src="/icons/eye.svg" alt="eye" />
                            Xem trước
                        </button>
                        <button
                            className="post-create__action post-create__action--exit"
                            onClick={() => window.history.back()}
                        >
                            Thoát
                        </button>
                    </div>
                </div>

                <div className="post-create__step">
                    <span className="post-create__step-info">
                        {step === 1 && 'Bước 1: Thông tin BĐS'}
                        {step === 2 && 'Bước 2: Hình ảnh & video'}
                        {step === 3 && 'Bước 3: Cấu hình & thanh toán'}
                    </span>

                    <div className="post-create__step--item-wrapper">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={
                                    'post-create__step--line ' +
                                    (step >= s
                                        ? 'post-create__step--line-active'
                                        : '')
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Phần nội dung */}
            <form className="post-form">
                {/* ===== STEP 1 ===== */}
                {step === 1 && (
                    <>
                        <DemandSection form={form} />

                        {form.data.type && (
                            <AddressSection form={form} cities={cities} />
                        )}

                        {form.data.type &&
                            form.data.city_id &&
                            form.data.ward_id && (
                                <MainInfoSection
                                    form={form}
                                    categories={categories}
                                />
                            )}

                        {showAdditionalInfo && (
                            <>
                                <AdditionalInfoSection form={form} />
                                <PostContentSection form={form} />
                            </>
                        )}
                    </>
                )}

                {/* ===== STEP 2 ===== */}
                {step === 2 && <PostMediaSection form={form} />}

                {/* ===== STEP 3 ===== */}
                {step === 3 && (
                    <PostPackageSection
                        form={form}
                        subscriptions={subscriptions}
                    />
                )}

                {/* Phần chân trang */}
                <div className="post-create__footer">
                    {step > 1 && (
                        <button
                            type="button"
                            className="post-create__action post-create__action--preview"
                            style={{ padding: '12px 20px' }}
                            onClick={() => setStep(step - 1)}
                        >
                            Quay lại
                        </button>
                    )}

                    {step === 1 && (
                        <button
                            type="button"
                            className="post-create__action post-create__action--exit"
                            style={{ padding: '12px 20px', marginLeft: 'auto' }}
                            onClick={submitStep1}
                        >
                            Tiếp tục
                        </button>
                    )}

                    {step === 2 && (
                        <button
                            type="button"
                            onClick={submitStep2}
                            disabled={form.processing}
                            className="post-create__action post-create__action--exit"
                            style={{ padding: '12px 20px' }}
                        >
                            Tiếp tục
                        </button>
                    )}

                    {step === 3 && (
                        <button
                            type="button"
                            className="post-create__action post-create__action--exit"
                            style={{ padding: '12px 20px' }}
                            disabled={
                                !form.data.subscription_id || form.processing
                            }
                            onClick={submitStep3}
                        >
                            Tiếp tục
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

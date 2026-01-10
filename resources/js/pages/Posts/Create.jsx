import { router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
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
        subscription_id: 1,
        days: 15,
        payment_method: 'momo',
    });

    const [draftReady, setDraftReady] = useState(false);

    const R2_PUBLIC_BASE_URL = import.meta.env.VITE_R2_PUBLIC_BASE_URL;

    const [showConfirm, setShowConfirm] = useState(false);

    const endDate = (() => {
        const d = new Date();
        d.setDate(d.getDate() + form.data.days);
        return d.toLocaleDateString('vi-VN');
    })();

    const previewImage = useMemo(() => {
        if (!form.data.images?.length) return '/images/no-image.png';

        const img = form.data.images[0];

        if (img.path) return `${R2_PUBLIC_BASE_URL}/${img.path}`;

        return '/images/no-image.png';
    }, [form.data.images]);

    const selectedPackage = subscriptions.find(
        (s) => s.id === form.data.subscription_id,
    );

    const totalPrice = selectedPackage
        ? selectedPackage.price_per_day * form.data.days
        : 0;

    const [step, setStep] = useState(1);

    useEffect(() => {
        const raw = sessionStorage.getItem('create-post-draft');
        if (!raw) {
            setDraftReady(true);
            return;
        }

        try {
            const { data, savedAt } = JSON.parse(raw);

            if (Date.now() - savedAt > 10 * 60 * 1000) {
                sessionStorage.removeItem('create-post-draft');
                setDraftReady(true);
                return;
            }

            const restoredImages = data.images.map((img) => ({
                id: crypto.randomUUID(),
                path: img.path,
                preview: null,
                is360: img.is360 || false,
            }));

            const restoredVideo = data.video ? data.video.path : null;

            form.setData((prev) => ({
                ...prev,
                ...data,
                images: restoredImages,
                video: restoredVideo,
            }));

            setStep(data.step || 1);
        } catch {
            sessionStorage.removeItem('create-post-draft');
        } finally {
            setDraftReady(true);
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
        if (step === 3) return;

        const t = setTimeout(() => {
            const { images, ...safeData } = form.data;

            const imagesForDraft = images.map((img) => ({
                path: img.path,
                is360: img.is360 || false,
            }));

            const videoForDraft = form.data.video
                ? { path: form.data.video }
                : null;

            sessionStorage.setItem(
                'create-post-draft',
                JSON.stringify({
                    data: {
                        ...safeData,
                        step,
                        images: imagesForDraft,
                        video: videoForDraft,
                    },
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

    function submitStep2() {
        router.post(
            '/posts',
            {
                step: 2,
                post_id: form.data.post_id,

                video: form.data.video,

                youtube_url: form.data.youtube_url || null,

                images: form.data.images.map((img) => ({
                    path: img.path, //path R2 đã upload
                    is360: img.is360 || false,
                })),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setStep(3);
                },
            },
        );
    }

    function submitStep3() {
        router.post(
            `/posts/${form.data.post_id}/package`,
            {
                subscription_id: form.data.subscription_id,
                days: form.data.days,
                payment_method: form.data.payment_method,
            },
            {
                preserveScroll: true,

                onFinish: () => {
                    sessionStorage.removeItem('create-post-draft');
                },
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
                        {/* <button className="post-create__action post-create__action--preview">
                            <img src="/icons/eye.svg" alt="eye" />
                            Xem trước
                        </button> */}
                        <button
                            className="post-create__action post-create__action--exit"
                            onClick={() => {
                                sessionStorage.removeItem('create-post-draft');
                                window.history.back();
                            }}
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
                            disabled={!draftReady || form.processing}
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
                        <div className="post-create__total">
                            <div className="post-create__total01">
                                <span>Tổng tiền </span>
                                <strong>{totalPrice.toLocaleString()} đ</strong>
                            </div>

                            <span style={{ color: '#888' }}>|</span>

                            <button
                                type="button"
                                className="post-create__action post-create__action--exit"
                                style={{ padding: '12px 20px' }}
                                disabled={
                                    !form.data.subscription_id ||
                                    form.processing
                                }
                                // onClick={submitStep3}
                                onClick={() => setShowConfirm(true)}
                            >
                                Tiếp tục
                            </button>
                        </div>
                    )}
                </div>

                {showConfirm && (
                    <div className="auth-form">
                        <div className="confirm-modal">
                            <h3>Chi tiết thanh toán</h3>

                            {/* BÀI ĐĂNG */}
                            <div className="confirm-section">
                                <h4>Thông tin bài đăng</h4>

                                <div className="post-preview">
                                    <img src={previewImage} alt="home" />

                                    <div className="post-preview01">
                                        <p className="post-title">
                                            {form.data.title}
                                        </p>
                                        <p className="post-address">
                                            {form.data.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* GÓI ĐĂNG */}
                            <div className="confirm-section">
                                <h4>Thông tin gói đăng</h4>

                                <div className="confirm-row">
                                    <span>Loại tin</span>
                                    <strong>{selectedPackage?.name}</strong>
                                </div>

                                <div className="confirm-row">
                                    <span>Đơn giá</span>
                                    <strong>
                                        {selectedPackage?.price_per_day.toLocaleString()}{' '}
                                        đ/ngày
                                    </strong>
                                </div>

                                <div className="confirm-row">
                                    <span>Số ngày</span>
                                    <strong>{form.data.days} ngày</strong>
                                </div>

                                <div className="confirm-row">
                                    <span>Thời gian kết thúc</span>
                                    <strong>{endDate}</strong>
                                </div>

                                <div className="confirm-row">
                                    <span>Phương thức thanh toán </span>

                                    <strong>{form.data.payment_method}</strong>
                                </div>
                            </div>

                            {/* TỔNG TIỀN */}
                            <div className="confirm-total confirm-row">
                                <span>Tổng tiền</span>
                                <strong>{totalPrice.toLocaleString()} đ</strong>
                            </div>

                            {/* ACTION */}
                            <div className="confirm-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setShowConfirm(false)}
                                >
                                    Quay lại
                                </button>

                                <button
                                    type="button"
                                    className="btn-confirm"
                                    onClick={() => {
                                        setShowConfirm(false);
                                        submitStep3();
                                    }}
                                >
                                    Xác nhận & Thanh toán
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </section>
    );
}

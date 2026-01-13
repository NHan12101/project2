import { router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function RenewPackage({ post, subscriptions, onClose }) {
    const { data, setData } = useForm({
        subscription_id: 1,
        days: 15,
        payment_method: 'momo',
    });

    const priorityLabels = {
        1: 'Hiển thị cuối cùng',
        2: 'Dưới VIP Vàng',
        3: 'Dưới VIP Kim Cương',
        4: 'Hiển thị trên cùng',
    };

    const colorPackage = [
        {
            1: '#1C1F22',
            2: '#009194',
            3: '#C3810A',
            4: '#C20000',
        },
        {
            1: '#95d1d2',
            2: '#95d1d2',
            3: '#e6cb99',
            4: '#e69696',
        },
        {
            1: '0',
            2: '8',
            3: '15',
            4: '30',
        },
    ];

    const getRectColorsAndHeights = (priority) => {
        switch (priority) {
            case 3: // Vip Vàng
                return {
                    colors: ['#C1C9D2', '#C3810A', '#C1C9D2', '#C1C9D2'],
                    heights: [4, 8, 4, 4],
                    rx: [2, 4, 2, 2],
                    y: [4, 10, 20, 26],
                };
            case 2: // Vip Bạc
                return {
                    colors: ['#C1C9D2', '#C1C9D2', '#009194', '#C1C9D2'],
                    heights: [4, 4, 8, 4],
                    rx: [2, 2, 4, 2],
                    y: [4, 10, 16, 26],
                };
            case 1: // Tin thường
                return {
                    colors: ['#C1C9D2', '#C1C9D2', '#C1C9D2', '#1C1F22'],
                    heights: [4, 4, 4, 8],
                    rx: [2, 2, 2, 4],
                    y: [4, 10, 16, 22],
                };
            default: // Vip Kim Cương
                return {
                    colors: ['#C20000', '#C1C9D2', '#C1C9D2', '#C1C9D2'],
                    heights: [8, 4, 4, 4],
                    rx: [4, 2, 2, 2],
                    y: [4, 14, 20, 26],
                };
        }
    };

    const selectedPackage = subscriptions.find(
        (s) => s.id === data.subscription_id,
    );

    const paymentMethods = ['momo', 'vnpay', 'stripe', 'paypal'];

    const selectedPriority = selectedPackage?.priority;

    // Danh sách ngày theo loại tin
    const daysOptions =
        selectedPriority === 1
            ? [15, 30, 60] // Tin thường
            : [7, 10, 15]; // VIP

    // Reset ngày mặc định khi đổi gói
    useEffect(() => {
        if (!selectedPriority) return;

        if (selectedPriority === 1) {
            // Tin thường
            setData('days', 15);
        } else {
            // VIP
            setData('days', 7);
        }
    }, [selectedPriority]);

    const paymentMethodImages = {
        momo: '/images/Momo.svg',
        vnpay: '/images/VNPAY.svg',
        stripe: '/images/STRIPE.svg',
        paypal: '/images/PAYPAL.svg',
    };

    function handleSubmit() {
        router.post(
            `/posts/${post.id}/package`,
            {
                subscription_id: data.subscription_id,
                days: data.days,
                payment_method: data.payment_method,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Gia hạn tin thành công!');
                    onClose(); // đóng modal
                },
                onError: (errors) => {
                    console.log(errors);
                    toast.error('Có lỗi xảy ra khi gia hạn.');
                },
            },
        );
    }

    return (
        <div className="post-package__renew">
            <div className="post-package__renew--heading">
                <h1 className="address-panel__title">Gia hạn tin đăng</h1>
                <button onClick={onClose} className="address-panel__close">
                    ✕
                </button>
            </div>

            <span className="post-form__label post-media__title">
                Chọn loại tin
            </span>

            <div className="package-list">
                {subscriptions.map((pkg) => {
                    const { colors, heights, rx, y } = getRectColorsAndHeights(
                        pkg.priority,
                    );

                    return (
                        <div
                            key={pkg.id}
                            className={
                                'package-card ' +
                                (data.subscription_id === pkg.id
                                    ? 'active'
                                    : '')
                            }
                            onClick={() => setData('subscription_id', pkg.id)}
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 34"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    x="4"
                                    y={y[0]}
                                    width="24"
                                    height={heights[0]}
                                    rx={rx[0]}
                                    fill={colors[0]}
                                />
                                <rect
                                    x="4"
                                    y={y[1]}
                                    width="24"
                                    height={heights[1]}
                                    rx={rx[1]}
                                    fill={colors[1]}
                                />
                                <rect
                                    x="4"
                                    y={y[2]}
                                    width="24"
                                    height={heights[2]}
                                    rx={rx[2]}
                                    fill={colors[2]}
                                />
                                <rect
                                    x="4"
                                    y={y[3]}
                                    width="24"
                                    height={heights[3]}
                                    rx={rx[3]}
                                    fill={colors[3]}
                                />
                            </svg>

                            <h4 className="package-name">{pkg.name}</h4>
                            <span className="package-priorty">
                                {priorityLabels[pkg.priority]}
                            </span>

                            <div className="package-box">
                                {pkg.priority !== 1 && (
                                    <div
                                        className="package-box__bg"
                                        style={{
                                            backgroundImage: `linear-gradient(90deg, ${colorPackage[1][pkg.priority]} 0, #fff 75%)`,
                                        }}
                                    >
                                        <div
                                            className="package-box__01"
                                            style={{
                                                background: `${colorPackage[0][pkg.priority]}`,
                                            }}
                                        >
                                            X{colorPackage[2][pkg.priority]}
                                        </div>
                                        <span className="package-priorty__span">
                                            lượt liên hệ <br /> so với tin
                                            thường
                                        </span>
                                    </div>
                                )}
                            </div>

                            <p className="package-price_per_day">
                                {pkg.price_per_day.toLocaleString()} đ/ngày
                            </p>
                        </div>
                    );
                })}
            </div>

            <span
                className="post-form__label"
                style={{ marginTop: 26, display: 'block' }}
            >
                Chọn số ngày
            </span>
            <div className="package-days">
                {daysOptions.map((d) => (
                    <div
                        key={d}
                        className={`package-days__button ${
                            data.days === d ? 'active' : ''
                        }`}
                        onClick={() => setData('days', d)}
                    >
                        <div>
                            <span style={{ fontWeight: 600 }}>{d} ngày</span>

                            {selectedPackage && (
                                <p style={{ marginTop: '12px' }}>
                                    {(
                                        selectedPackage.price_per_day * d
                                    ).toLocaleString()}{' '}
                                    đ
                                </p>
                            )}
                        </div>

                        <input
                            id="select-package"
                            type="radio"
                            name="select-package"
                            hidden
                        />
                        <label
                            htmlFor="select-package"
                            className={`select-package__radio ${
                                data.days === d ? 'active' : ''
                            }`}
                        ></label>
                    </div>
                ))}
            </div>

            <span
                className="post-form__label"
                style={{ marginTop: 26, display: 'block' }}
            >
                Chọn phương thức thanh toán
            </span>

            <div className="payment-methods">
                {paymentMethods.map((method) => (
                    <div
                        key={method}
                        className={`payment-methods__box ${
                            data.payment_method === method ? 'active' : ''
                        }`}
                        onClick={() => setData('payment_method', method)}
                    >
                        <img
                            src={paymentMethodImages[method]}
                            alt={method}
                            className={`payment-methods__box--images ${
                                data.payment_method === method ? 'active' : ''
                            }`}
                        />
                    </div>
                ))}
            </div>

            <button onClick={handleSubmit} className="btn-primary__renew">
                Xác nhận gia hạn
            </button>
        </div>
    );
}

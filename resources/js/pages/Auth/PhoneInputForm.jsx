import { useForm } from '@inertiajs/react';
import './ForgotPasswordForm.css';

export default function PhoneInputForm({ onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        phone: '',
        type: 'verify_phone',
    });

    function normalizePhone(value) {
        return value.replace(/\D/g, '').slice(0, 10);
    }

    function handleSubmit(e) {
        e.preventDefault();

        post('/phone/send-otp', {
            preserveScroll: true,

            onSuccess: () => {
                onClose();
            },
        });
    }

    return (
        <div className="forgot">
            <h2 className="forgot__title">Nhập số điện thoại</h2>

            <p>Vui lòng nhập số điện thoại để nhận mã OTP</p>

            <form onSubmit={handleSubmit} className="forgot__form">
                <input
                    autoFocus
                    inputMode="numeric"
                    placeholder="Nhập số điện thoại"
                    value={data.phone}
                    onChange={(e) =>
                        setData('phone', normalizePhone(e.target.value))
                    }
                    className="forgot__input"
                />

                {errors.phone && (
                    <span className="forgot__error">{errors.phone}</span>
                )}

                {errors.message && (
                    <span className="forgot__error">{errors.message}</span>
                )}

                <button
                    type="submit"
                    disabled={processing || data.phone.length !== 10}
                    className={`forgot__button ${
                        processing || data.phone.length !== 10
                            ? 'forgot__button--disabled'
                            : ''
                    }`}
                >
                    {processing ? 'Đang gửi...' : 'Gửi OTP'}
                </button>
            </form>

            <button onClick={onClose} className="forgot__close-button">
                ✕
            </button>
        </div>
    );
}

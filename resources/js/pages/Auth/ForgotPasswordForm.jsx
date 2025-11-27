import { useForm } from '@inertiajs/react';
import './ForgotPasswordForm.css';

export default function ForgotPasswordForm({ onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/forgot-password');
    }

    return (
        <div className="forgot">
            <h2 className="forgot__title">Quên mật khẩu</h2>

            <p>Vui lòng cung cấp Email để đặt lại mật khẩu</p>

            <form onSubmit={handleSubmit} className="forgot__form">
                <input
                    autoFocus
                    placeholder="Nhập email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="forgot__input"
                />

                {errors.email && (
                    <span className="forgot__error">{errors.email}</span>
                )}

                <button
                    type="submit"
                    disabled={processing || !data.email}
                    className={`forgot__button ${processing || !data.email ? 'forgot__button--disabled' : ''
                        }`}
                >
                    Gửi OTP
                </button>
            </form>

            <button onClick={onClose}>Quay lại trang đăng nhập</button>

            <button
                onClick={onClose}
                className="forgot__close-button"
            >
                ✕
            </button>
        </div>
    );
}

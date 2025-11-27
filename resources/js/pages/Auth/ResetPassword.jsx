import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import './ResetPassword.css';

export default function ResetPassword({ email, onClose }) {
    const { data, setData, post, processing, errors: backendErrors, reset } = useForm({
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const [frontendErrors, setFrontendErrors] = useState({});
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;

    useEffect(() => {
        if (email) {
            setData('email', email);
        }
    }, [email]);

    function validateFrontend(form) {
        const errors = {};

        if (!form.password) errors.password = 'Mật khẩu là bắt buộc.';
        else if (!passwordRegex.test(form.password))
            errors.password =
                'Mật khẩu phải ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.';

        if (form.password !== form.password_confirmation)
            errors.password_confirmation = 'Mật khẩu xác nhận không khớp.';

        return errors;
    }

    function handleChange(field, value) {
        // tạo bản copy để validate chính xác
        const newData = { ...data, [field]: value };

        setData(field, value);

        const newErrors = validateFrontend(newData);
        setFrontendErrors(newErrors);
    };

    function handleSubmit(e) {
        e.preventDefault();

        const newErrors = validateFrontend(data);

        if (Object.keys(newErrors).length > 0) {
            setFrontendErrors(newErrors);
            return;
        }

        post('/forgot-password/reset', {
            onSuccess: () => {
                reset();
                setFrontendErrors({});
                if (onClose) onClose(false);
            },
        });
    };

    function getError(field) {
        return frontendErrors[field] || backendErrors[field] || null;
    }

    return (
        <div className="modal-resetpassword">
            <h2 className="modal-resetpassword__title">Đặt lại mật khẩu</h2>

            <form onSubmit={handleSubmit} className="modal-resetpassword__form">

                {/* Email ẩn */}
                <input type="hidden" value={data.email} />

                <div className="input-password">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        autoFocus
                        placeholder="Nhập mật khẩu mới"
                        value={data.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                    />
                    <div
                        className='eye-toggle__reset'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <img src="/icons/eye-off.svg" alt="hide" />
                        ) : (
                            <img src="/icons/eye.svg" alt="show" />
                        )}
                    </div>
                </div>

                {getError('password') && (
                    <div className='notification__error'>{getError('password')}</div>
                )}

                <div className="input-password">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Xác nhận mật khẩu"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            handleChange('password_confirmation', e.target.value)
                        }
                    />
                    <div
                        className='eye-toggle__reset'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <img src="/icons/eye-off.svg" alt="hide" />
                        ) : (
                            <img src="/icons/eye.svg" alt="show" />
                        )}
                    </div>
                </div>

                {getError('password_confirmation') && (
                    <div className='notification__error'>{getError('password_confirmation')}</div>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="button-submit"
                >
                    Xác nhận
                </button>

                <button
                    type="button"
                    className="button-cancel"
                    onClick={() => onClose(false)}
                >
                    ✕
                </button>
            </form>
        </div>
    );
}

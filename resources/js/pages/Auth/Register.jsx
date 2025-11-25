import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import style from './AuthForm.module.css';

export default function Register({ onClose }) {
    const { data, setData, post, processing, errors: backendErrors, reset } = useForm({
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false)
    const [frontendErrors, setFrontendErrors] = useState({});

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;

    // Validate frontend
    function validateFrontend(form) {
        const errors = {};

        if (!form.email) errors.email = 'Email là bắt buộc.';
        else if (!/\S+@\S+\.\S+/.test(form.email))
            errors.email = 'Email không hợp lệ.';

        if (!form.password) errors.password = 'Mật khẩu là bắt buộc.';
        else if (!passwordRegex.test(form.password))
            errors.password =
                'Mật khẩu phải ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.';

        if (form.password !== form.password_confirmation)
            errors.password_confirmation = 'Mật khẩu xác nhận không khớp.';

        return errors;
    };

    function handleChange(field, value) {
        // tạo bản copy để validate chính xác
        const newData = { ...data, [field]: value };

        setData(field, value);

        const newErrors = validateFrontend(newData);
        setFrontendErrors(newErrors);
    };

    function handleRegister(e) {
        e.preventDefault();

        const newErrors = validateFrontend(data);

        if (Object.keys(newErrors).length > 0) {
            setFrontendErrors(newErrors);
            return;
        }

        post('/register', {
            onSuccess: () => {
                reset();
                setFrontendErrors({});
                if (onClose) onClose();
            },
        });
    };

    function getError(field) {
        return frontendErrors[field] || backendErrors[field] || null;
    }

    return (
        <div className={`${style['form-container']} ${style['register-container']}`}>
            <form onSubmit={handleRegister}>
                <h1 className={style['form-container__header']}>Register</h1>

                <input
                    autoComplete="email"
                    className={style['input__auth-form']}
                    placeholder="Email"
                    value={data.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                />
                {getError('email') && (
                    <div className={style.error}>{getError('email')}</div>
                )}

                <div className={style['input-wrapper']}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="password"
                        className={style['input__auth-form']}
                        placeholder="Password"
                        value={data.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                    />

                    <div
                        className={style['eye-toggle']}
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
                    <div className={style.error}>{getError('password')}</div>
                )}

                <div className={style['input-wrapper']}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        className={style['input__auth-form']}
                        placeholder="Confirm Password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            handleChange('password_confirmation', e.target.value)
                        }
                    />

                    <div
                        className={style['eye-toggle']}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <img src="/icons/eye-off.svg" alt="hide" />
                        ) : (
                            <img src='/icons/eye.svg' alt="show" />
                        )}
                    </div>
                </div>
                {getError('password_confirmation') && (
                    <div className={style.error}>
                        {getError('password_confirmation')}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className={style['form-container__btn']}
                >
                    {processing ? 'Loading...' : 'Register'}
                </button>

                <span className={style['form-container__span']}>or use your account</span>

                <div className={style['social-container']}>
                    <button
                        className={style['login-google']}
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = '/auth/google';
                        }}
                    >
                        <img src="/icons/google.svg" alt="google" />
                        <span>Tiếp tục với Google</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import style from './AuthForm.module.css';

export default function Login({ onClose, onForgotPassword}) {
    const { data, setData, post, processing, errors: backendErrors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false)
    const [frontendErrors, setFrontendErrors] = useState({});

    function validateFrontend(form) {
        const errors = {};

        if (!form.email) errors.email = 'Email là bắt buộc.';
        else if (!/\S+@\S+\.\S+/.test(form.email))
            errors.email = 'Email không hợp lệ.';

        if (!form.password) errors.password = 'Mật khẩu là bắt buộc.';

        return errors;
    };

    function handleChange(field, value) {
        const newData = { ...data, [field]: value };
        setData(field, value);

        setFrontendErrors(validateFrontend(newData));
    };

    function handleLogin(e) {
        e.preventDefault();

        const errors = validateFrontend(data);

        if (Object.keys(errors).length > 0) {
            setFrontendErrors(errors);
            return;
        }

        post('/login', {
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
        <div className={`${style['form-container']} ${style['login-container']}`}>
            <form onSubmit={handleLogin}>
                <h1 className={style['form-container__header']}>Login</h1>

                <input
                    type="email"
                    autoComplete="email"
                    autoFocus
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
                        autoComplete="current-password"
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

                <div className={style['form-container__content']}>
                    <div className={style.checkbox}>
                        <input
                            type="checkbox"
                            id="remember"
                            checked={data.remember}
                            onChange={(e) => handleChange('remember', e.target.checked)}
                        />
                        <label htmlFor="remember">Remember me</label>
                    </div>

                    <div className={style['pass-link']}>
                        <a onClick={onForgotPassword} className={style['pass-link__forgot']}>
                            Forgot password?
                        </a>
                    </div>
                </div>

                <button
                    type="submit"
                    className={style['form-container__btn']}
                    disabled={processing}
                >
                    {processing ? 'Loading...' : 'Login'}
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

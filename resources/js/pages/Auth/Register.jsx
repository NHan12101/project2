import { useForm } from '@inertiajs/react';
import style from './AuthForm.module.css';

export default function Register({ onClose }) {
    const {
        data: registerData,
        setData: setRegisterData,
        post: registerPost,
        processing: registerLoading,
        errors: registerErrors,
        reset,
    } = useForm({
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleRegister = (e) => {
        e.preventDefault();

        registerPost('/register', {
            onSuccess: () => {
                // Reset toàn bộ form về ban đầu
                reset();

                // Đóng form modal
                if (onClose) onClose();
            },
        });
    };

    return (
        <div
            className={`${style['form-container']} ${style['register-container']}`}
        >
            <form onSubmit={handleRegister}>
                <h1 className={style['form-container__header']}>Register</h1>
                <input
                    className={style['input__auth-form']}
                    type="email"
                    placeholder="Email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData('email', e.target.value)}
                />
                {registerErrors.email && (
                    <div className={style.error}>{registerErrors.email}</div>
                )}
                <input
                    className={style['input__auth-form']}
                    type="password"
                    placeholder="Password"
                    value={registerData.password}
                    onChange={(e) =>
                        setRegisterData('password', e.target.value)
                    }
                />
                {registerErrors.password && (
                    <div className={style.error}>{registerErrors.password}</div>
                )}
                <input
                    className={style['input__auth-form']}
                    type="password"
                    placeholder="Confirm Password"
                    value={registerData.password_confirmation}
                    onChange={(e) =>
                        setRegisterData('password_confirmation', e.target.value)
                    }
                />
                {registerErrors.password_confirmation && (
                    <div className={style.error}>
                        {registerErrors.password_confirmation}
                    </div>
                )}

                <button
                    type="submit"
                    className={style['form-container__btn']}
                    disabled={registerLoading}
                >
                    Register
                </button>
                <span className={style['form-container__span']}>
                    or use your account
                </span>
                <div className={style['social-container']}>
                    <button
                        className={style['login-google']}
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = '/auth/google';
                        }}
                    >
                        <img src="/icons/google.svg" alt="google" />
                        <span>Đăng kí bằng Google</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

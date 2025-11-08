import { useForm } from '@inertiajs/react';
import style from './AuthForm.module.css';

export default function Login({ onClose }) {
    const {
        data: loginData,
        setData: setLoginData,
        post: loginPost,
        processing: loginLoading,
        errors: loginErrors,
        reset,
    } = useForm({
        email: '',
        password: '',
    });

    const handleLogin = (e) => {
        e.preventDefault();

        loginPost('/login', {
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
            className={`${style['form-container']} ${style['login-container']}`}
        >
            <form onSubmit={handleLogin}>
                <h1 className={style['form-container__header']}>Login</h1>
                <input
                    className={style['input__auth-form']}
                    type="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => setLoginData('email', e.target.value)}
                />
                {loginErrors.email && (
                    <div className={style.error}>{loginErrors.email}</div>
                )}

                <input
                    className={style['input__auth-form']}
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData('password', e.target.value)}
                />
                {loginErrors.password && (
                    <div className={style.error}>{loginErrors.password}</div>
                )}
                <div className={style['form-container__content']}>
                    <div className={style.checkbox}>
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember me</label>
                    </div>
                    <div className={style['pass-link']}>
                        <a href="#" className={style['pass-link__forgot']}>
                            Forgot password?
                        </a>
                    </div>
                </div>
                <button
                    type="submit"
                    className={style['form-container__btn']}
                    disabled={loginLoading}
                >
                    Login
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
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        <span>Tiếp tục với Google</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

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
                        <img src="/icons/google.svg" alt="google" />
                        <span>Tiếp tục với Google</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

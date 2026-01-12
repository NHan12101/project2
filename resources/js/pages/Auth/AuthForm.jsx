import { useState } from 'react';
import style from './AuthForm.module.css';
import Login from './Login';
import Register from './Register';

export default function AuthForm({ ref, onClose, onForgotPassword }) {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    return (
        <article
            ref={ref}
            className={`${style['form-login']} ${isRightPanelActive ? style['right-panel-active'] : ''}`}
            id="container"
        >
            <Register onClose={onClose} />
            <Login onClose={onClose} onForgotPassword={onForgotPassword} />

            <div className={style['overlay-container']}>
                <div className={style.overlay}>
                    <div
                        className={`${style['overlay-panel']} ${style['overlay-left']}`}
                    >
                        <h1 className={style['overlay-container__title']}>
                            Hello Friends
                        </h1>
                        <p className={style['overlay-container__desc']}>
                            If you already have an account, login here and have
                            fun
                        </p>
                        <button
                            className={`${style['ghost']} ${style['form-container__btn']}`}
                            id="login"
                            onClick={() => setIsRightPanelActive(false)}
                        >
                            ← Login
                        </button>
                    </div>
                    <div
                        className={`${style['overlay-panel']} ${style['overlay-right']}`}
                    >
                        <h1 className={style['overlay-container__title']}>
                            Start Your Journey
                        </h1>
                        <p className={style['overlay-container__desc']}>
                            If you don't have an account yet, join us and start
                            your journey.
                        </p>
                        <button
                            className={`${style['ghost']} ${style['form-container__btn']}`}
                            id="register"
                            onClick={() => setIsRightPanelActive(true)}
                        >
                            Register →
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}

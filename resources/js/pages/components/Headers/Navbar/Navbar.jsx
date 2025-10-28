import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import logo from '../../../../../../public/images/StayHub.svg';
import avatar from '../../../../../../public/images/ava2.jpg';
import Notification from '../Notification/Notification';

export default function Navbar() {
    const [isLogin, setIsLogin] = useState(false);
    const { props } = usePage();
    const auth = props.auth;
    useEffect(() => {
        setIsLogin(!!auth?.user);
    }, [auth]);

    const [theme, setTheme] = useState(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    );

    const toggleTheme = () => {
        window.toggleTheme(); // gọi hàm trong blade
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <nav
            className="nav"
            style={{ background: theme === 'dark' ? '#0a0a0ada' : '#fffffff4' }}
        >
            <button
                onClick={toggleTheme}
            >
                {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <div className="nav__item">
                <a href="./">
                    <img src={logo} alt="Logo" className="nav__item--logo" />
                </a>

                <ul className="nav__list">
                    <li>
                        <a href="" className="active">
                            Trang chủ
                        </a>
                    </li>
                    <li>
                        <a href="">Mua nhà</a>
                    </li>
                    <li>
                        <a href="">Thuê nhà</a>
                    </li>
                    <li>
                        <a href="">Dự án</a>
                    </li>
                    <li>
                        <a href="">Liên hệ</a>
                    </li>
                </ul>

                {isLogin ? (
                    <div className="header__info">
                        <div className="header__info--name">
                            <img
                                src={avatar}
                                alt="avatar"
                                className="header__info--avatar"
                            />
                            <h4>
                                Xin chào, {auth.user.name ?? 'bạn'}
                            </h4>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className="dropdown-icon"
                            />
                            <div
                                className="header__info--list"
                                style={{ display: 'none' }}
                            >
                                <p className="header__info--desc">Hồ sơ</p>
                                <p className="header__info--desc">Lịch sử</p>
                                <p className="header__info--desc">undefined</p>
                                <p className="header__info--desc">undefined</p>
                                <p className="header__info--desc">Liên hệ</p>
                                <p className="header__info--desc">Đăng xuất</p>
                            </div>
                        </div>

                        <div className="header__button--right">
                            <Notification />
                            <button
                                className="btn header__btn-register"
                                onClick={() => router.post('/logout')}
                            >
                                Đăng tin
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="header__btn">
                        <button
                            className="btn header__btn-login"
                            onClick={() => router.visit('/login')}
                        >
                            Đăng nhập
                        </button>
                        <button
                            className="btn header__btn-register"
                            onClick={() => router.visit('/register')}
                        >
                            Đăng ký
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { FaDoorOpen } from 'react-icons/fa';
import logo from '../../../../../../public/images/StayHub.svg';
import avatar from '../../../../../../public/images/ava2.jpg';
import Notification from '../Notification/Notification.jsx';
import './Navbar.css';

export default function Navbar() {
    const [isLogin, setIsLogin] = useState(false);
    const { auth } = usePage().props;
    useEffect(() => {
        setIsLogin(!!auth?.user);
    }, [auth]);
    
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            <button onClick={toggleTheme}>
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
                    <div className="nav__info">
                        <div className="nav__info--name" ref={menuRef}>
                            <button
                                className="dropdown-btn"
                                onClick={() => setOpen((pre) => !pre)}
                            >
                                <img
                                    src={avatar}
                                    alt="avatar"
                                    className="nav__info--avatar"
                                />
                                <h4>Xin chào, {auth.user.name ?? 'bạn'}</h4>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`dropdown-icon arrow ${open ? 'rotate' : ''}`}
                                />
                                {open && (
                                    <div className="dropdown-menu">
                                        <p className="dropdown-menu--desc">
                                            Hồ sơ
                                        </p>
                                        <p className="dropdown-menu--desc">
                                            Lịch sử
                                        </p>
                                        <p className="dropdown-menu--desc">
                                            undefined
                                        </p>
                                        <p className="dropdown-menu--desc">
                                            undefined
                                        </p>
                                        <p className="dropdown-menu--desc">
                                            Liên hệ
                                        </p>
                                        <span className="dropdown-menu__equally"></span>
                                        <div
                                            className="dropdown-menu--desc drop-logout"
                                            onClick={() =>
                                                router.post('/logout')
                                            }
                                        >
                                            Đăng xuất
                                            <FaDoorOpen className="icon dooropen" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>

                        <div className="nav__button--right">
                            <Notification />
                            <button
                                className="btn nav__btn-register"
                                // onClick={() => router.post('/logout')}
                            >
                                Đăng tin
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="nav__btn">
                        <button
                            className="btn nav__btn-login"
                            onClick={() => router.visit('/login')}
                        >
                            Đăng nhập
                        </button>
                        <button
                            className="btn nav__btn-register"
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

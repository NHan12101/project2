import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import logo from '../../../../../../public/images/StayHub.svg';
import AuthForm from '../../../Auth/AuthForm.jsx';
import Notification from '../Notification/Notification.jsx';
import Dropdown from './Dropdown.jsx';
import './Navbar.css';

export default function Navbar() {
    const { props, url } = usePage();
    const { auth } = props;
    const [isLogin, setIsLogin] = useState(false);
    const [open, setOpen] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [show, setShow] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        setIsLogin(!!auth?.user);
    }, [auth]);

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

    useEffect(() => {
        if (url === '/home') {
            const handleScroll = () => {
                console.log(window.scrollY)
                setShow(window.scrollY > 690);
            };

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [url]);

    return (
        <nav
            className="nav"
            style={{
                background:
                    theme === 'dark' ? '#0a0a0ada' : show ? '#fff' : undefined,
                position: show ? 'sticky' : 'relative',
            }}
        >
            {/* <button onClick={toggleTheme} style={{ display: '' }}>
                {theme === 'light' ? 'Dark' : 'Light'}
            </button> */}
            <div className="nav__item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 46}}>
                    <a href="/home">
                        <img
                            src={logo}
                            alt="Logo"
                            className="nav__item--logo"
                        />
                    </a>
                    <ul
                        className={`${show ? 'nav__item--list-scroll' : 'nav__item--list'}`}
                    >
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
                </div>

                <div
                    className="container-search__box"
                    style={{
                        display: show ? 'flex' : 'none',
                    }}
                >
                    <div className="container-search__box--iconsearch">
                        <div className="aw__cf5h6c0">
                            <img src="/icons/icon-search.svg" alt="search" />
                        </div>
                    </div>
                    <input
                        autocomplete="off"
                        class="container-search__box--input"
                        placeholder="Tìm bất động sản..."
                        // value=""
                    />
                    <div className="container-search__box--iconbutton">
                        <button>
                            <svg
                                data-type="monochrome"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                fill="none"
                            >
                                <path
                                    d="M18.2798 11.4399C18.2797 7.66239 15.2175 4.6001 11.4399 4.6001C7.66244 4.60018 4.60018 7.66244 4.6001 11.4399C4.6001 15.2175 7.66239 18.2797 11.4399 18.2798C15.2176 18.2798 18.2798 15.2176 18.2798 11.4399ZM20.2798 11.4399C20.2798 13.5439 19.5432 15.4748 18.3159 16.9927L21.0952 19.6812L21.1655 19.7563C21.4922 20.1438 21.4786 20.7232 21.1187 21.0952C20.7586 21.4674 20.1798 21.5 19.7817 21.186L19.7046 21.1187L16.8901 18.396C15.3881 19.5745 13.4972 20.2798 11.4399 20.2798C6.55782 20.2797 2.6001 16.3221 2.6001 11.4399C2.60018 6.55787 6.55787 2.60018 11.4399 2.6001C16.3221 2.6001 20.2797 6.55782 20.2798 11.4399Z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="nav__info">
                    <div className="nav__button--icon">
                        <button className="icon-btn">
                            <img src="/icons/heart.svg" alt="heart-icon" />
                        </button>
                        <button
                            className="icon-btn"
                            onClick={() => router.visit('/chatbox')}
                        >
                            <img src="/icons/chat.svg" alt="chat-icon" />
                        </button>
                        <Notification
                            isLogin={isLogin}
                            setShowAuth={() => setShowAuth(true)}
                        />

                        <div>
                            <button
                                className="nav__btn-story--manager"
                                onClick={
                                    isLogin
                                        ? () => router.visit('/')
                                        : () => setShowAuth(true)
                                }
                            >
                                {isLogin ? 'Quản lý tin' : 'Đăng nhập'}
                            </button>
                        </div>
                        <div>
                            <button className="nav__btn-story">Đăng tin</button>
                        </div>
                        <div className="nav__info--name" ref={menuRef}>
                            <button
                                className="dropdown-btn"
                                onClick={() => setOpen((pre) => !pre)}
                            >
                                <img
                                    src={
                                        isLogin
                                            ? auth.user.avatar_image_url
                                                ? `/${auth.user.avatar_image_url}`
                                                : auth.user.avatar
                                                  ? auth.user.avatar
                                                  : '/images/ava2.jpg'
                                            : '/images/ava2.jpg'
                                    }
                                    alt="avatar"
                                    className="nav__info--avatar"
                                />
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`dropdown-icon arrow ${open ? 'rotate' : ''}`}
                                />
                            </button>

                            {open && (
                                <Dropdown
                                    isLogin={isLogin}
                                    auth={auth}
                                    onChange={() => setShowAuth(true)}
                                    setOpen={() => setOpen(false)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showAuth && (
                <div className="auth-form" onClick={() => setShowAuth(false)}>
                    <AuthForm onClose={() => setShowAuth(false)} />
                </div>
            )}
        </nav>
    );
}

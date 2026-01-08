import useDropdown from '@/hooks/useDropdown.js';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import logo from '../../../../../../public/images/StayHub.svg';
import AuthForm from '../../../Auth/AuthForm.jsx';
import ForgotPasswordForm from '../../../Auth/ForgotPasswordForm.jsx';
import PhoneInputForm from '../../../Auth/PhoneInputForm.jsx';
import ResetPassword from '../../../Auth/ResetPassword.jsx';
import VerifyOtp from '../../../Auth/VerifyOtp.jsx';
import VerifyPhoneOtp from '../../../Auth/VerifyPhoneOtp.jsx';
import Notification from '../Notification/Notification.jsx';
import Suggest from '../Suggest.jsx';
import Dropdown from './Dropdown.jsx';
import './Navbar.css';

export default function Navbar() {
    const { props, url } = usePage();
    const { auth, flash, favoritePostIds, latestFavoritePost } = props;

    const [isLogin, setIsLogin] = useState(false);

    const { menuRef, open, setOpen } = useDropdown();
    const {
        menuRef: saveRef,
        open: openSave,
        setOpen: setOpenSave,
    } = useDropdown();

    const [showAuth, setShowAuth] = useState(false);
    const [showVerify, setShowVerify] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState('');

    const [showReset, setShowReset] = useState(false);
    const [showForgot, setShowForgot] = useState(false);

    const [showVerifyPhone, setShowVerifyPhone] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [verifyPhone, setVerifyPhone] = useState('');

    const [keyword, setKeyword] = useState('');

    const [show, setShow] = useState(false);

    const R2_PUBLIC_BASE_URL = import.meta.env.VITE_R2_PUBLIC_BASE_URL;

    useEffect(() => {
        setIsLogin(!!auth?.user);
    }, [auth]);

    useEffect(() => {
        if (url !== '/home') {
            setShow(true);
        }

        if (url === '/home') {
            function handleScroll() {
                setShow(window.scrollY > 730);
            }

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [url]);

    useEffect(() => {
        if (!flash) return;

        // OTP khi đăng kí
        if (flash.otp_required && flash.otp_type === 'register') {
            setShowAuth(false);
            setShowReset(false);
            setVerifyEmail(flash.email);
            setShowVerify(true);
        }

        // OTP khi quên mật khẩu
        if (flash.otp_required && flash.otp_type === 'forgot_password') {
            setShowForgot(false); // tắt popup nhập email
            setShowVerify(true);
            setVerifyEmail(flash.email);
        }

        // OTP hợp lệ thì cho phép reset password
        if (flash.reset_password_allowed && flash.email) {
            setShowVerify(false);
            setVerifyEmail(flash.email);
            setShowReset(true); // bật popup reset mật khẩu
        }

        // OTP xác thực số điện thoại
        const isPhoneVerified =
            localStorage.getItem('phone_verified') === 'true';

        // OTP xác thực số điện thoại
        if (flash.phone_otp_required && !isPhoneVerified) {
            setVerifyPhone(flash.phone || '');
            setShowPhone(!flash.phone);
            setShowVerifyPhone(!!flash.phone);
        }
    }, [flash]);

    const [theme, setTheme] = useState(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    );
    const toggleTheme = () => {
        window.toggleTheme(); // gọi hàm trong blade
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const queryParams = url.includes('?')
        ? new URLSearchParams(url.split('?')[1])
        : null;
    const currentType = queryParams?.get('type') || null;

    function handleSearch() {
        router.get(
            '/home-finder',
            { keyword: keyword || null },
            {
                preserveState: false,
                preserveScroll: true,
            },
        );
    }

    return (
        <nav
            className="nav"
            style={{
                background:
                    theme === 'dark' ? '#0a0a0ada' : show ? '#fff' : undefined,
                position: show ? 'sticky' : 'relative',
            }}
        >
            {/* <button onClick={toggleTheme}>
                {theme === 'light' ? 'Dark' : 'Light'}
            </button> */}

            <div
                className="nav__item"
                style={{
                    boxShadow: show
                        ? '0px 1px 16px rgba(0, 0, 0, 0.08)'
                        : 'none',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
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
                            <button
                                className={`nav-link ${url === '/home' ? 'active' : ''}`}
                                onClick={() => router.get('/home')}
                            >
                                Trang chủ
                            </button>
                        </li>
                        <li>
                            <button
                                className={`nav-link ${url.startsWith('/home-finder') && currentType === 'sale' ? 'active' : ''}`}
                                onClick={() =>
                                    router.get('/home-finder', { type: 'sale' })
                                }
                            >
                                Mua nhà
                            </button>
                        </li>
                        <li>
                            <button
                                className={`nav-link ${url.startsWith('/home-finder') && currentType === 'rent' ? 'active' : ''}`}
                                onClick={() =>
                                    router.get('/home-finder', { type: 'rent' })
                                }
                            >
                                Thuê nhà
                            </button>
                        </li>
                        <li>
                            <button
                                className="nav-link"
                                onClick={() => router.get('/')}
                            >
                                Dự án
                            </button>
                        </li>
                        <li>
                            <button
                                className="nav-link"
                                onClick={() => router.get('/')}
                            >
                                Tin tức
                            </button>
                        </li>
                    </ul>
                </div>

                <div
                    style={{
                        display: show ? 'block' : 'none',
                        position: 'relative',
                        width: 'calc(100% - 1060px)',
                    }}
                >
                    <Suggest
                        value={keyword}
                        setKeyword={setKeyword}
                        classContainer={'container-search__box'}
                        classInput={'container-search__box--input'}
                        classScroll={show}
                    />

                    <div className="container-search__box--iconbutton">
                        <button onClick={handleSearch}>
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
                        <div className="nav-dropdown__icon-heart" ref={saveRef}>
                            <button
                                className="icon-btn"
                                onClick={() => setOpenSave((pre) => !pre)}
                            >
                                <img src="/icons/heart.svg" alt="heart-icon" />
                            </button>

                            {openSave && (
                                <div className="nav-dropdown__icon-heart--box">
                                    <div className="nav-dropdown__icon-heart--title">
                                        <span>
                                            Tin đăng đã lưu{' '}
                                            {favoritePostIds.length > 0 &&
                                                `(${favoritePostIds.length})`}
                                        </span>

                                        {favoritePostIds.length > 0 && (
                                            <a href="/saved">Xem tất cả</a>
                                        )}
                                    </div>

                                    {latestFavoritePost ? (
                                        <Link
                                            href={`/property-detail/${latestFavoritePost.slug}`}
                                            className="nav-dropdown__icon-heart--content"
                                        >
                                            <img
                                                src={`${R2_PUBLIC_BASE_URL}/${latestFavoritePost?.images[0]?.thumb_path}`}
                                                alt="thumb-post"
                                                loading="lazy"
                                            />

                                            <span>
                                                {latestFavoritePost.title}
                                            </span>
                                        </Link>
                                    ) : (
                                        <div className="nav-dropdown__icon-heart--nocontent">
                                            <span>
                                                {isLogin
                                                    ? 'Bạn chưa lưu tin đăng nào'
                                                    : 'Đăng nhập để xem tin đã lưu'}
                                            </span>

                                            <p>
                                                {isLogin
                                                    ? 'Lưu tin yêu thích, tin sẽ hiển thị ở đây để bạn dễ dàng quay lại sau.'
                                                    : 'Bạn có thể thêm và quản lý tin đăng đã lưu sau khi đăng nhập.'}
                                            </p>

                                            {!isLogin && (
                                                <button
                                                    onClick={() => {
                                                        setShowAuth(true);
                                                        setOpenSave(false);
                                                    }}
                                                >
                                                    Đăng nhập
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            className="icon-btn"
                            onClick={() =>
                                isLogin
                                    ? router.visit('/chatbox')
                                    : setShowAuth(true)
                            }
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
                                        ? () => router.visit('/cc')
                                        : () => setShowAuth(true)
                                }
                            >
                                {isLogin ? 'Quản lý tin' : 'Đăng nhập'}
                            </button>
                        </div>

                        <div>
                            <button
                                className="nav__btn-story"
                                onClick={
                                    isLogin
                                        ? () => router.visit('/posts/create')
                                        : () => setShowAuth(true)
                                }
                            >
                                Đăng tin
                            </button>
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
                                    onLogin={() => {
                                        setShowAuth(true);
                                        setOpen(false);
                                    }}
                                    setOpen={() => setOpen(false)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showAuth && (
                <div className="auth-form" onClick={() => setShowAuth(false)}>
                    <AuthForm
                        onClose={() => setShowAuth(false)}
                        onForgotPassword={() => {
                            setShowAuth(false);
                            setShowForgot(true); // bật form nhập email
                        }}
                    />
                </div>
            )}

            {showVerify && (
                <div className="auth-form">
                    <VerifyOtp
                        email={verifyEmail}
                        onClose={setShowVerify}
                        flash={flash}
                    />
                </div>
            )}

            {showForgot && (
                <div className="auth-form">
                    <ForgotPasswordForm
                        onClose={() => {
                            setShowForgot(false);
                            setShowAuth(true);
                        }}
                    />
                </div>
            )}

            {showReset && (
                <div className="auth-form">
                    <ResetPassword
                        email={verifyEmail}
                        flash={flash}
                        onClose={() => setShowReset(false)}
                    />
                </div>
            )}

            {showPhone && (
                <div className="auth-form">
                    <PhoneInputForm onClose={() => setShowPhone(false)} />
                </div>
            )}

            {showVerifyPhone && (
                <div className="auth-form">
                    <VerifyPhoneOtp
                        phone={verifyPhone}
                        flash={flash}
                        onClose={() => {
                            setShowVerifyPhone(false);
                            setVerifyPhone('');
                        }}
                    />
                </div>
            )}
        </nav>
    );
}

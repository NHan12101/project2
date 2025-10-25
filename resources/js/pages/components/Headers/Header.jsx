import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import search_icon from '../../../../../public/images/Search-icon.svg';
import logo from '../../../../../public/images/StayHub.svg';
import {
    default as banner1,
    default as banner2,
    default as banner3,
} from '../../../../../public/images/baner.png';
import './Header.css';

export default function Header({ auth }) {
    const banners = [banner1, banner2, banner3];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => router.post('/logout');

    return (
        <header className="header">
            <div className="main-content">
                <nav className="nav">
                    <img src={logo} alt="Logo" />
                    <div className="header__search">
                        <input
                            type="text"
                            placeholder="Thanh tìm kiếm"
                            className="search"
                        />
                        <button className="header__search-btn">
                            <img
                                src={search_icon}
                                alt="icon"
                                className="header__search--icon"
                            />
                        </button>
                    </div>

                    {auth && auth.user ? (
                        <>
                            <h4>Xin chao, {auth.user.name}</h4>
                            <button
                                className="btn header__btn-register"
                                onClick={handleLogout}
                            >
                                Đăng xuất
                            </button>
                        </>
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
                </nav>

                <div className="header__banner">
                    <div
                        className="banner__wrapper"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {banners.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`banner-${index}`}
                                className="banner__image"
                            />
                        ))}
                    </div>

                    <div className="banner__dots">
                        {banners.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${current === index ? 'active' : ''}`}
                                onClick={() => setCurrent(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}

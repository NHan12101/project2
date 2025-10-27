import { useEffect, useState } from 'react';
import {
    default as banner1,
    default as banner2,
    default as banner3,
} from '../../../../../public/images/baner.png';
import './Header.css';

export default function Header() {
    const banners = [banner1, banner2, banner3];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header">
            <div className="main-contain">
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

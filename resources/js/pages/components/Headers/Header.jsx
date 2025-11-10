import { useEffect, useState } from 'react';
import banner_vip from '../../../../../public/images/banner-vip.jpg';
import banner_vip02 from '../../../../../public/images/banner-vip02.jpg';
import './Header.css';

export default function Header() {
    const banners = [banner_vip, banner_vip02];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header">
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

                <div className="banner__overlay">
                    <div className="banner__overlay--container">
                        <div className="banner__overlay--box">
                            <div className="hero-content">
                                <h1 className="hero-content__title">
                                    Tìm nhà dễ, sống hay, chọn ngay
                                    <br />
                                    <span> StayHub</span>
                                </h1>
                                <p className="hero-content__desc">
                                    Khám phá căn hộ, biệt thự và dự án mới để
                                    bắt đầu hành trình sống trọn vẹn như mơ tại
                                    Việt Nam
                                </p>

                                <div className="search-bar">
                                    <div className="search-bar__01">
                                        <div className="search-bar__02">
                                            <div className="search-bar__02--icon-search">
                                                <img
                                                    src="/icons/icon-search.svg"
                                                    alt="Tìm kiếm"
                                                />
                                            </div>

                                            <input
                                                type="text"
                                                className="search-bar__02--input"
                                                autoComplete="off"
                                                placeholder="Tìm bất động sản..."
                                            />

                                            <div className="search-bar__02--button">
                                                <button className="button-02 select-region">
                                                    <svg
                                                        data-type="monochrome"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        width="20px"
                                                        height="20px"
                                                        fill="none"
                                                        className="select-region__location"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            d="M20.0005 10.0439C20.0004 11.4492 19.4826 12.8887 18.7915 14.2021C18.0937 15.5284 17.1749 16.8075 16.2759 17.9131C15.3742 19.0219 14.4755 19.9768 13.8032 20.6533C13.4666 20.992 13.1851 21.2623 12.9868 21.4492C12.8876 21.5427 12.8088 21.6161 12.7544 21.666L12.7198 21.6979L12.6919 21.7236L12.6743 21.7393L12.0005 22.3418L11.3267 21.7393L11.3091 21.7236L11.2811 21.6979L11.2466 21.666C11.1921 21.6161 11.1134 21.5427 11.0142 21.4492C10.8158 21.2623 10.5344 20.992 10.1978 20.6533C9.52545 19.9768 8.62674 19.0219 7.7251 17.9131C6.82612 16.8075 5.90731 15.5284 5.20947 14.2021C4.51839 12.8887 4.0006 11.4492 4.00049 10.0439C4.00049 5.6075 7.57638 2 12.0005 2C16.4246 2 20.0005 5.6075 20.0005 10.0439ZM12.0005 13C13.7936 13 15.2368 11.5391 15.2368 9.75C15.2367 7.96099 13.7935 6.5 12.0005 6.5C10.2076 6.50015 8.76521 7.96108 8.76514 9.75C8.76514 11.539 10.2075 12.9998 12.0005 13Z"
                                                            fill="currentColor"
                                                        ></path>
                                                    </svg>
                                                    <span>Chọn khu vực</span>
                                                    <svg
                                                        data-type="monochrome"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        width="24px"
                                                        height="24px"
                                                        fill="none"
                                                    >
                                                        <g fill="currentColor">
                                                            <path d="M12.4495 14.8316C12.2013 15.0561 11.7987 15.0561 11.5505 14.8316L6.18623 9.98133C6.0044 9.81692 5.95001 9.56967 6.04841 9.35486C6.14682 9.14006 6.37864 9 6.63578 9L17.3642 9C17.6214 9 17.8532 9.14006 17.9516 9.35487C18.05 9.56967 17.9956 9.81693 17.8138 9.98133L12.4495 14.8316Z"></path>
                                                        </g>
                                                    </svg>
                                                </button>

                                                <button className="button-02 choose-type">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            d="M9.57294 5.63234C9.57285 6.09865 9.17286 6.47652 8.67925 6.47661H7.35808C6.86439 6.47661 6.46362 6.0987 6.46353 5.63234C6.46353 5.16591 6.86434 4.78727 7.35808 4.78727H8.67925C9.17291 4.78736 9.57294 5.16596 9.57294 5.63234ZM16.8394 16.6744C17.2199 16.7714 17.5 17.0993 17.5 17.4894C17.4999 17.9557 17.0999 18.3336 16.6063 18.3337H3.39455C2.90086 18.3337 2.50009 17.9558 2.5 17.4894C2.5 17.0994 2.7803 16.7715 3.16059 16.6744V4.17621C3.16059 2.7907 4.35008 1.66699 5.8167 1.66699H14.1842L14.3209 1.67024C15.7239 1.73756 16.8394 2.83408 16.8394 4.17621V16.6744ZM12.6428 6.47661C13.1364 6.47652 13.5364 6.09865 13.5365 5.63234C13.5365 5.16596 13.1364 4.78736 12.6428 4.78727H11.3216C10.8279 4.78727 10.4271 5.16591 10.4271 5.63234C10.4272 6.0987 10.8279 6.47661 11.3216 6.47661H12.6428ZM13.5365 8.12857C13.5364 8.59487 13.1364 8.97274 12.6428 8.97283H11.3216C10.8279 8.97283 10.4272 8.59493 10.4271 8.12857C10.4271 7.66213 10.8279 7.28349 11.3216 7.28349H12.6428C13.1364 7.28358 13.5365 7.66219 13.5365 8.12857ZM8.67925 8.97283C9.17286 8.97274 9.57285 8.59487 9.57294 8.12857C9.57294 7.66219 9.17291 7.28358 8.67925 7.28349H7.35808C6.86434 7.28349 6.46353 7.66213 6.46353 8.12857C6.46362 8.59493 6.86439 8.97283 7.35808 8.97283H8.67925ZM9.57294 10.6248C9.57285 11.0911 9.17286 11.469 8.67925 11.469H7.35808C6.86439 11.469 6.46362 11.0911 6.46353 10.6248C6.46353 10.1584 6.86434 9.77971 7.35808 9.77971H8.67925C9.17291 9.7798 9.57294 10.1584 9.57294 10.6248ZM12.6428 11.469C13.1364 11.469 13.5364 11.0911 13.5365 10.6248C13.5365 10.1584 13.1364 9.7798 12.6428 9.77971H11.3216C10.8279 9.77971 10.4271 10.1584 10.4271 10.6248C10.4272 11.0911 10.8279 11.469 11.3216 11.469H12.6428ZM11.6519 14.5893C11.705 14.5894 11.7482 14.6309 11.7482 14.6811V16.6443H13.5365V14.6811C13.5365 13.698 12.6925 12.9001 11.6519 12.9H8.34896C7.30825 12.9 6.46353 13.698 6.46353 14.6811V16.6443H8.25176V14.6811C8.25176 14.6309 8.29573 14.5893 8.34896 14.5893H11.6519Z"
                                                            fill="#fa3719"
                                                        />
                                                    </svg>
                                                    <span>Loại hình BĐS</span>
                                                </button>

                                                <div>
                                                    <button className="button-02__search">
                                                        Tìm nhà
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
        </header>
    );
}

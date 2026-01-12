import { router } from '@inertiajs/react';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import logo from '../../../../../public/images/StayHub.svg';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__top">
                <div className="footer__col" style={{ flex: '3' }}>
                    <a href="./">
                        <img
                            src={logo}
                            alt="Logo"
                            className="nav__item--logo"
                        />
                    </a>

                    <div style={{ marginTop: 18 }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="16"
                            viewBox="0 0 36 29"
                            fill="none"
                        >
                            <path
                                d="M15 16.0322V28C15 28.5522 14.5523 29 14 29H1C0.447723 29 0 28.5522 0 28V15.0322C0 9.68282 2.37552 -0.406295 14.0734 0.0126507C14.5945 0.0312054 15 0.468461 15 0.989946L15 4.05464C15 4.60713 14.5504 5.04878 14.0047 5.13326C10.4517 5.68282 6.51944 9.07466 6.04715 14.0327C5.99478 14.5825 6.44769 15.0322 6.99997 15.0322H14C14.5523 15.0322 15 15.4797 15 16.0322Z"
                                fill="#070707"
                            />
                            <path
                                d="M36 16.0322V28C36 28.5522 35.5523 29 35 29H22C21.4477 29 21 28.5522 21 28V15.0322C21 9.68282 23.3755 -0.406295 35.0734 0.0126507C35.5945 0.0312054 36 0.468461 36 0.989946L36 4.05464C36 4.60713 35.5504 5.04878 35.0047 5.13326C31.4517 5.68282 27.5194 9.07466 27.0471 14.0327C26.9948 14.5825 27.4477 15.0322 28 15.0322H35C35.5523 15.0322 36 15.4797 36 16.0322Z"
                                fill="#070707"
                            />
                        </svg>
                    </div>

                    <blockquote className="footer__slogan">
                        " Mua với sự thông minh, thanh toán đầy đủ và quản lý
                        cẩn thận, nó là khoản đầu tư an toàn nhất trên thế giới.
                        "
                    </blockquote>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            marginTop: 8,
                        }}
                    >
                        <span className="footer__slogan--span"></span>
                        <span
                            style={{
                                display: 'inline-block',
                                fontSize: '1.42rem',
                                fontStyle: 'italic',
                                color: '#070707',
                            }}
                        >
                            – Franklin D. Roosevelt –
                        </span>
                    </div>
                </div>

                <div className="footer__col">
                    <h3>Liên kết nhanh</h3>
                    <ul>
                        <li>
                            <a href="/home">Trang chủ</a>
                        </li>
                        <li>
                            <a
                                onClick={() =>
                                    router.get('/home-finder', { type: 'rent' })
                                }
                            >
                                Thuê nhà
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={() =>
                                    router.get('/home-finder', { type: 'sale' })
                                }
                            >
                                Mua nhà
                            </a>
                        </li>
                        <li>
                            <a href="/blog">Tin tức</a>
                        </li>
                    </ul>
                </div>

                <div className="footer__col">
                    <h3>Theo dõi chúng tôi</h3>
                    <ul className="footer__social">
                        <li>
                            <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                className="footer__col--icon"
                            >
                                <FaFacebook fontSize={26} />
                                <span>Facebook</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.tiktok.com/"
                                target="_blank"
                                className="footer__col--icon"
                            >
                                <FaTiktok fontSize={26} />
                                <span>Tiktok</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                className="footer__col--icon"
                            >
                                <FaInstagram fontSize={26} />
                                <span>Instagram</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer__col">
                    <ul>
                        <h3>Liên hệ</h3>
                        <a href="" className="footer__col--icon">
                            <MdEmail fontSize={26} /> Stayhub@gmail.com
                        </a>
                        <a href="" className="footer__col--icon">
                            <MdPhone fontSize={26} /> 0987878788
                        </a>
                    </ul>
                </div>
            </div>

            <div className="footer__copyright">
                © 2025 StayHub. All rights reserved.
            </div>
        </footer>
    );
}

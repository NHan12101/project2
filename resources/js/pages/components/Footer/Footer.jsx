import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import logo from '../../../../../public/images/StayHub.svg';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="main-contain">
                <div className="footer__top">
                    <div className="footer__col">
                        <a href='./'><img src={logo} alt="Logo" className='nav__item--logo' style={{marginLeft: '12px'}}/></a>
                        <p className="footer__slogan">"Nhà đẹp chọn nhanh"</p>
                    </div>

                    <div className="footer__col">
                        <h3>Liên kết nhanh</h3>
                        <ul>
                            <li>
                                <a href="">Trang chủ</a>
                            </li>
                            <li>
                                <a href="">Mua nhà</a>
                            </li>
                            <li>
                                <a href="">Blogs</a>
                            </li>
                            <li>
                                <a href="">Giới thiệu</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer__col">
                        <h3>Theo dõi chúng tôi</h3>
                        <ul className="footer__social">
                            <li>
                                <a href="" className="footer__col--icon">
                                    <FaFacebook fontSize={26} />
                                    <span>Facebook</span>
                                </a>
                            </li>
                            <li>
                                <a href="" className="footer__col--icon">
                                    <FaTiktok fontSize={26} />
                                    <span>Tiktok</span>
                                </a>
                            </li>
                            <li>
                                <a href="" className="footer__col--icon">
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
                                <MdPhone fontSize={26} /> 0987878799
                            </a>
                        </ul>
                    </div>
                </div>

                <div className="footer__copyright">
                    © 2025 StayHub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

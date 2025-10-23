import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import logo from '../../../../../public/images/StayHub.svg';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className='main-contain'>
                <div className="footer__top">
                    <div className="footer__col">
                        <img src={logo} alt="Logo" />
                        <p className="footer__slogan">"Nhà đẹp chọn nhanh"</p>
                    </div>
    
                    <div className="footer__col">
                        <h3>Liên kết nhanh</h3>
                        <ul>
                            <li>Trang chủ</li>
                            <li>Mua nhà</li>
                            <li>Blogs</li>
                            <li>Giới thiệu</li>
                        </ul>
                    </div>
    
                    <div className="footer__col">
                        <h3>Theo dõi chúng tôi</h3>
                        <div className="footer__social">
                            <FaFacebook />
                            <FaTiktok />
                            <FaInstagram />
                        </div>
                    </div>
    
                    <div className="footer__col">
                        <h3>Liên hệ</h3>
                        <p>
                            <MdEmail fontSize={26}/> Stayhub@gmail.com
                        </p>
                        <p>
                            <MdPhone fontSize={26}/> 0987878799
                        </p>
                    </div>
                </div>
    
                <div className="footer__bottom">
                    © 2025 StayHub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

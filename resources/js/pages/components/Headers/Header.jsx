import { router } from '@inertiajs/react';
import search_icon from '../../../../../public/images/Search-icon.svg';
import logo from '../../../../../public/images/StayHub.svg';
import banner from '../../../../../public/images/baner.png';
import './Header.css';

export default function Header({ auth }) {
    const handleLogout = () => {
        router.post('/logout');
    };
    return (
        <header className="header">
            <div className="main-content">
                <nav className="nav">
                    <img src={logo} alt="Logo" />
                    <div className="header__search">
                        <input type="text" placeholder="Thanh tìm kiếm" className='search'/>
                        <button className="header__search-btn">
                            {' '}
                            <img
                                src={search_icon}
                                alt="icon"
                                className="header__search--icon"
                            />
                        </button>
                    </div>

                    {auth ? (
                        <div className="header__btn">
                            <button className="btn header__btn-login">
                                Đăng nhập
                            </button>
                            <button className="btn header__btn-register">
                                Đăng kí
                            </button>
                        </div>
                    ) : (
                        <button
                            className="btn header__btn-register"
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </button>
                    )}
                </nav>
            </div>

            <div className="header__banner">
                <div className="main-content">
                    <img src={banner} alt="" />
                </div>
            </div>
        </header>
    );
}

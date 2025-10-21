import logo from '../../../../../public/images/StayHub.svg';
import search_icon from '../../../../../public/images/Search-icon.svg';
import './Header.css';


export default function Header() {
    return (
        <header className="header">
            <div className="main-content">
                <nav className="nav">
                    <img src={logo} alt="Logo" />
                    <div className="header__search">
                        <span className="header__search--icon"><img src={search_icon} alt="icon" /></span>
                        <span className="header__search--title">Thanh Tìm Kiếm</span>
                        <button className="header__search-btn">Tìm kiếm</button>
                    </div>  
                    <div className='header__btn'>
                        <button className="btn header__btn-login">
                            Đăng nhập
                        </button>
                        <button className="btn header__btn-register">
                            Đăng kí
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}

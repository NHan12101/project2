import './Dropdown.css';
import DropdownSection from './DropdownSection';

export default function Dropdown({ isLogin, auth, onLogin, setOpen }) {
    const menuData = [
        {
            title: 'Tiện ích',
            items: [
                { label: 'Tin đăng đã lưu', icon: '/icons/tin-dang-da-luu.svg', href: '/saved-posts' },
                { label: 'Tìm kiếm đã lưu', icon: '/icons/tim-kiem-da-luu.svg', href: '/saved-searches' },
                { label: 'Lịch sử xem tin', icon: '/icons/lich-su-xem-tin.svg', href: '/view-history' },
                { label: 'Đánh giá từ tôi', icon: '/icons/danh-gia-tu-toi.svg', href: '/my-reviews' },
            ],
        },
        {
            title: 'Dịch vụ trả phí',
            items: [
                { label: 'Gói Pro', icon: '/icons/goi-pro.svg', href: '/pro-plans' },
                { label: 'Lịch sử giao dịch', icon: '/icons/lich-su-xem-tin.svg', href: '/transactions' },
            ],
        },
        {
            title: 'Khác',
            items: [
                { label: 'Cài đặt tài khoản', icon: '/icons/cai-dat.svg', href: '/settings' },
                { label: 'Trợ giúp', icon: '/icons/tro-giup.svg', href: '/help' },
                ...(isLogin
                    ? [{ label: 'Đăng xuất', icon: '/icons/dang-xuat.svg', href: '/logout', method: 'post' }]
                    : []),
            ],
        },
    ];

    return (
        <div className="dropdown-menu">
            {isLogin ? (
                <div>
                    <div className="dropdown-menu__login">
                        <a href="/profile"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                height: 80,
                                width: 80,
                                borderRadius: '50%',
                                outline: '2px solid #ececec',
                            }}
                        >
                            <img
                                src={
                                    auth.user.avatar_image_url
                                        ? `/${auth.user.avatar_image_url}`
                                        : auth.user.avatar
                                            ? auth.user.avatar
                                            : '/images/ava2.jpg'
                                }
                                alt="avatar"
                                className="dropdown-menu__login--avatar"
                            />
                            <span className="dropdown-menu__login--custom">
                                <img
                                    src="/icons/sua-avatar.svg"
                                    alt="edit avatar"
                                />
                            </span>
                        </a>
                    </div>

                    <div className="dropdown-menu__login--name">
                        <a href="/profile"
                            style={{
                                color: '#222',
                                fontSize: '1.8rem',
                                fontWeight: '700',
                            }}
                        >
                            {auth.user.name}
                        </a>
                    </div>
                </div>
            ) : (
                <div className="dropdown-menu__none">
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                        }}
                    >
                        <span className="aw__s11qss7y">
                            Mua thì hời, bán thì lời.
                        </span>
                        <span className="aw__snh7o1a">Đăng nhập cái đã!</span>
                    </div>
                    <div
                        className="dropdown-menu__none--btn"
                        onClick={onLogin}
                    >
                        Đăng nhập
                    </div>
                </div>
            )}
            <div>
                {menuData.map((section, idx) => (
                    <DropdownSection
                        key={idx}
                        title={section.title}
                        items={section.items}
                        onNavigate={setOpen}
                    />
                ))}
            </div>
        </div>
    );
}

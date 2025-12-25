import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import './Notification.css';

function NotificationList({
    closeSidebar,
    isOpen,
    isLogin,
    setShowAuth,
    notifications,
}) {
    return (
        <>
            <div
                className={`overlay ${isOpen ? 'show' : ''}`}
                onClick={closeSidebar}
            ></div>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Thông báo</h2>
                    <button className="close-btn" onClick={closeSidebar}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                {isLogin ? (
                    <div className="sidebar-content">
                        <div className="notify-item">
                            <span>Bạn có {notifications.length} tin nhắn</span>
                        </div>
                        {/* <div className="notify-item">
                            <span>Bài đăng của bạn được duyệt</span>
                        </div>
                        <div className="notify-item">
                            <span>Cập nhật hệ thống lúc 12:00</span>
                        </div> */}
                    </div>
                ) : (
                    <div className="sidebar--notlogin">
                        <p>Vui lòng đăng nhập để xem thông báo!</p>
                        <button onClick={setShowAuth}>
                            Đăng ký / Đăng nhập
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default function Notification({ isLogin, setShowAuth }) {
    const { notifications } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);

    // console.log(notifications);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <button className="bell-btn" onClick={toggleSidebar}>
                <img src="/icons/bell.svg" alt="bell" />
                <span className="bell-count">7</span>
            </button>

            <NotificationList
                setShowAuth={setShowAuth}
                isLogin={isLogin}
                isOpen={isOpen}
                closeSidebar={() => setIsOpen(false)}
                notifications={notifications}
            />
        </>
    );
}

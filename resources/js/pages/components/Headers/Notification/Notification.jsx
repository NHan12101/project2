import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import './Notification.css';

function NotificationList({ closeSidebar, isOpen }) {
    return (
        <>
            {/* Overlay mờ đằng sau */}
            <div
                className={`overlay ${isOpen ? 'show' : ''}`}
                onClick={closeSidebar}
            ></div>

            {/* Sidebar bên phải */}
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Thông báo</h2>
                    <button className="close-btn" onClick={closeSidebar}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="sidebar-content">
                    <div className="notify-item">📩 Bạn có 1 tin nhắn mới</div>
                    <div className="notify-item">🏠 Bài đăng của bạn được duyệt</div>
                    <div className="notify-item">🔔 Cập nhật hệ thống lúc 12:00</div>
                </div>
            </div>
        </>
    );
}

export default function Notification() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <button className="bell-btn" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBell} className="bell-icon" />
                <span className="bell-count">16</span>
            </button>

            <NotificationList isOpen={isOpen} closeSidebar={() => setIsOpen(false)} />
        </>
    );
}

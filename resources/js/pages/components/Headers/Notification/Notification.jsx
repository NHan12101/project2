import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import './Notification.css';

function NotificationList({
    closeSidebar,
    isOpen,
    isLogin,
    setShowAuth,
    notifications,
    unreadCount,
}) {
    const markAllAsRead = () => {
        router.post(
            '/notifications/read-all',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleClickNotification = (notification) => {
        console.log(notification);
        // 1. Đánh dấu đã đọc
        router.post(
            `/notifications/${notification.id}/read`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // 2. Redirect theo type
                    switch (notification.type) {
                        case 'new_message':
                            router.visit(`/chatbox`);
                            break;

                        case 'post_published':
                        case 'post_expiring':
                            router.visit(
                                `/property-detail/${notification.data.slug}`,
                            );
                            break;

                        default:
                            break;
                    }
                },
            },
        );
    };

    return (
        <>
            <div
                className={`overlay ${isOpen ? 'show' : ''}`}
                onClick={closeSidebar}
            ></div>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Thông báo</h2>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        {isLogin && unreadCount > 0 && (
                            <button
                                className="mark-as-read__button"
                                onClick={markAllAsRead}
                            >
                                <img
                                    src="/icons/double-tick.svg"
                                    alt="double tick"
                                />
                                <span>Đánh dấu tất cả</span>
                            </button>
                        )}
                        <button className="close-btn" onClick={closeSidebar}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
                {isLogin ? (
                    <div className="sidebar-content">
                        {notifications.length === 0 && (
                            <div className="notify-empty">
                                Bạn không có thông báo nào !!
                            </div>
                        )}

                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`notify-item ${
                                    n.is_read ? '' : 'notify-unread'
                                }`}
                                onClick={() => handleClickNotification(n)}
                            >
                                <span>
                                    {n.type === 'new_message' && (
                                        <>
                                            Bạn có{' '}
                                            <strong>
                                                {n.data.unread_count}
                                            </strong>{' '}
                                            tin nhắn mới từ{' '}
                                            <strong>
                                                {n.data.sender_name}
                                            </strong>
                                        </>
                                    )}

                                    {n.type === 'post_published' && (
                                        <>
                                            Bài đăng{' '}
                                            <strong>{n.data.title}</strong> đã
                                            đăng thành công
                                        </>
                                    )}

                                    {n.type === 'post_renewed' && (
                                        <>
                                            Bài đăng{' '}
                                            <strong>{n.data.title}</strong> đã
                                            gia hạn thành công
                                        </>
                                    )}

                                    {n.type === 'post_expired' && (
                                        <>
                                            Bài đăng{' '}
                                            <strong>{n.data.title}</strong> đã
                                            hết hạn
                                        </>
                                    )}

                                    {n.type === 'post_expiring' && (
                                        <>
                                            Bài đăng{' '}
                                            <strong>{n.data.title}</strong> sắp
                                            hết hạn
                                        </>
                                    )}
                                </span>
                            </div>
                        ))}
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

    const toggleSidebar = () => setIsOpen(!isOpen);

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.is_read).length,
        [notifications],
    );

    return (
        <>
            <button className="bell-btn" onClick={toggleSidebar}>
                <img src="/icons/bell.svg" alt="bell" />
                {unreadCount > 0 && (
                    <span className="bell-count">{unreadCount}</span>
                )}
            </button>

            <NotificationList
                setShowAuth={setShowAuth}
                isLogin={isLogin}
                isOpen={isOpen}
                closeSidebar={() => setIsOpen(false)}
                notifications={notifications}
                unreadCount={unreadCount}
            />
        </>
    );
}

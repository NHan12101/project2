import { initFavorites } from '@/hooks/useFavorite';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer.jsx';
import Navbar from '../components/Headers/Navbar/Navbar.jsx';
import './PostManagement.css';
import RenewPackage from './RenewPackage.jsx';
import ViewedPostCard from './ViewedPostCard.jsx';

export default function PostManagement({
    posts,
    activeTab,
    counts,
    subscriptions,
    favoritePostIds,
}) {
    const [hover, setHover] = useState(false);

    const [currentRenewPost, setCurrentRenewPost] = useState(null);

    // hàm đóng modal
    const closeRenewModal = () => setCurrentRenewPost(null);

    const PER_PAGE = 10;

    const [visibleCount, setVisibleCount] = useState(PER_PAGE);

    const visibleItems = posts.slice(0, visibleCount);

    useEffect(() => {
        initFavorites(favoritePostIds || []);
    }, [favoritePostIds]);

    const navList = [
        { id: 1, name: 'Đang hiển thị', count: counts.visible },
        { id: 2, name: 'Hết hạn', count: counts.expired },
        { id: 3, name: 'Tin nháp', count: counts.draft },
        { id: 4, name: 'Đã ẩn', count: counts.hidden },
    ];

    const [activeId, setActiveId] = useState(activeTab);
    const [hoverId, setHoverId] = useState(null);

    const handleTabClick = (tabId) => {
        setActiveId(tabId);
        router.get('/posts/manage', { tab: tabId });
    };

    return (
        <>
            <Head title="StayHub | Quản lý tin" />

            <Navbar />

            <div className="viewed-container">
                {/* Header */}
                <div className="viewed-header">
                    <div className="viewed-header__link">
                        <Link href="/home">StayHub</Link>
                        <p>/</p>
                        <p>Quản lý tin</p>
                    </div>

                    <div className="viewed-header__title">
                        <p>Quản lý tin đăng</p>

                        <span>
                            <svg
                                data-type="monochrome"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="1em"
                                height="1em"
                                fill="none"
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                            >
                                <path
                                    d="M20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12ZM11 16.5V12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12V16.5C13 17.0523 12.5523 17.5 12 17.5C11.4477 17.5 11 17.0523 11 16.5ZM11 8.66504V8.625C11 8.07272 11.4477 7.625 12 7.625C12.5523 7.625 13 8.07272 13 8.625V8.66504C12.9997 9.2171 12.5521 9.66504 12 9.66504C11.4479 9.66504 11.0003 9.2171 11 8.66504ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                    fill="currentColor"
                                ></path>
                            </svg>

                            {hover && (
                                <div className="viewed-header__suggest">
                                    <h2>Quản lý tin đăng</h2>
                                    <span>
                                        Bạn có thể theo dõi trạng thái của tin
                                        đăng ...
                                    </span>
                                </div>
                            )}
                        </span>
                    </div>
                </div>

                <ul className="post-status-tabs">
                    {navList.map((item) => (
                        <li
                            key={item.id}
                            className={`post-status-tab ${item.id === activeId ? 'active' : ''} ${item.id === hoverId ? 'hover' : ''}`}
                            onMouseEnter={() => setHoverId(item.id)}
                            onMouseLeave={() => setHoverId(null)}
                            onClick={() => handleTabClick(item.id)}
                        >
                            {`${item.name} (${item.count})`}
                        </li>
                    ))}
                </ul>

                {/* Không có nội dung */}
                {visibleItems.length === 0 && (
                    <div className="viewed-empty" style={{ padding: '60px 0' }}>
                        <img src="/icons/empty-frame.svg" alt="empty" />

                        <h1 style={{ color: '#5d5d5d', marginTop: '6px' }}>
                            Không tìm thấy tin đăng
                        </h1>

                        <p>
                            Bạn hiện tại không có tin đăng nào cho trạng thái
                            này!!
                        </p>

                        <Link
                            href="/posts/create"
                            style={{ padding: '0 72px' }}
                        >
                            Đăng tin
                        </Link>
                    </div>
                )}

                {/* Phần hiển thị nội dung */}
                <div className="viewed-flex" style={{ marginTop: 18 }}>
                    {visibleItems.map((post) =>
                        ['expired', 'draft', 'hidden'].includes(post.status) ? (
                            <div key={post.id} className="viewed-card">
                                <ViewedPostCard
                                    post={post}
                                    showActions={true}
                                    onRenewClick={setCurrentRenewPost}
                                />
                                <div className="viewed-card__line"></div>
                            </div>
                        ) : (
                            <Link
                                key={post.id}
                                href={`/property-detail/${post.slug}`}
                                className="viewed-card"
                            >
                                <ViewedPostCard
                                    post={post}
                                    showActions={true}
                                    onRenewClick={setCurrentRenewPost}
                                />
                                <div className="viewed-card__line"></div>
                            </Link>
                        ),
                    )}

                    {visibleCount < posts.length && (
                        <div className="viewed-load-more">
                            <button
                                onClick={() =>
                                    setVisibleCount((prev) => prev + PER_PAGE)
                                }
                            >
                                Xem thêm
                            </button>
                        </div>
                    )}

                    {visibleCount >= posts.length && posts.length > 0 && (
                        <p className="viewed-flex__end">
                            Bạn đã xem hết tin đăng 🥂
                        </p>
                    )}
                </div>
            </div>

            {currentRenewPost && (
                <div className="auth-form">
                    <RenewPackage
                        post={currentRenewPost}
                        subscriptions={subscriptions}
                        onClose={closeRenewModal}
                    />
                </div>
            )}

            <Footer />
        </>
    );
}

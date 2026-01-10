import useDropdown from '@/hooks/useDropdown.js';
import { initFavorites, useFavorite } from '@/hooks/useFavorite.js';
import { formatPrice } from '@/utils/formatPrice';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Chat from '../Chat.jsx';
import Footer from '../components/Footer/Footer.jsx';
import Navbar from '../components/Headers/Navbar/Navbar.jsx';
import CardList from '../components/Main-content/cards/CardList.jsx';
import MapView from '../MapView.jsx';
import Image360Viewer from '../Posts/modals/Image360Viewer.jsx';
import './PropertyDetail.css';

export default function PropertyDetail({
    post,
    relatedPosts,
    favoritePostIds,
    auth,
}) {
    const utilities = useMemo(
        () => [
            { id: 1, icon: '/icons/bed-icon.png', value: post.bedrooms },
            { id: 2, icon: '/icons/bathroom-icon.png', value: post.bathrooms },
            {
                id: 3,
                icon: '/icons/livingroom-icon.png',
                value: post.livingrooms,
            },
            { id: 4, icon: '/icons/kitchen-icon.png', value: post.kitchens },
        ],
        [post],
    );

    const attribute = useMemo(
        () => [
            {
                id: 1,
                icon: '/icons/apartment_type.png',
                lable: 'Loại hình căn hộ',
                value: post.category.name,
            },
            {
                id: 2,
                icon: '/icons/price.png',
                lable: 'Khoảng giá',
                value: formatPrice(post.price),
            },
            {
                id: 3,
                icon: '/icons/size.png',
                lable: 'Diện tích',
                value: `${post.area} m²`,
            },
            {
                id: 4,
                icon: '/icons/bed-icon.png',
                lable: 'Số phòng ngủ',
                value: post.bedrooms,
            },
            {
                id: 5,
                icon: '/icons/bathroom-icon.png',
                lable: 'Số phòng tắm, vệ sinh',
                value: post.bathrooms,
            },
            {
                id: 6,
                icon: '/icons/livingroom-icon.png',
                lable: 'Số phòng khách',
                value: post.livingrooms,
            },
            {
                id: 7,
                icon: '/icons/kitchen-icon.png',
                lable: 'Số phòng bếp',
                value: post.kitchens,
            },
            {
                id: 8,
                icon: '/icons/floor.png',
                lable: 'Số tầng',
                value: post.floors,
            },
            {
                id: 9,
                icon: '/icons/direction.png',
                lable: 'Hướng nhà',
                value: post.direction,
            },
            {
                id: 10,
                icon: '/icons/property_legal_document.png',
                lable: 'Giấy tờ pháp lý',
                value: post.legal,
            },
            {
                id: 11,
                icon: '/icons/noithat.png',
                lable: 'Nội thất',
                value: post.furniture,
            },
        ],
        [post],
    );

    const subscription = {
        1: 'Tin thường',
        2: 'VIP Bạc',
        3: 'VIP Vàng',
        4: 'VIP Kim Cương',
    };

    const meta = [
        { id: 1, title: 'Ngày đăng', value: formatDate(post.updated_at) },
        {
            id: 2,
            title: 'Ngày hết hạn',
            value: formatDate(post.package_expired_at),
        },
        {
            id: 3,
            title: 'Loại đăng',
            value: subscription[post.subscription_id],
        },
    ];

    function formatDate(dateString) {
        const d = new Date(dateString);

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const { menuRef, open, setOpen } = useDropdown();
    const galleryRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const { isLiked, toggle } = useFavorite(post.id);

    useEffect(() => {
        initFavorites(favoritePostIds);
    }, [favoritePostIds]);

    // const [mediaList, setMediaList] = useState([]);
    const [activeMedia, setActiveMedia] = useState(null);

    const R2_PUBLIC_BASE_URL = import.meta.env.VITE_R2_PUBLIC_BASE_URL;

    const buildMediaList = (post) => {
        const list = [];

        if (post.video) {
            list.push({
                id: 'video',
                type: 'video',
                src: `${R2_PUBLIC_BASE_URL}/${post.video}`,
            });
        }

        if (post.youtube_url) {
            list.push({
                id: 'youtube',
                type: 'youtube',
                src: post.youtube_url,
            });
        }

        post.images?.forEach((img, index) => {
            list.push({
                id: `img-${index}`,
                type: img.is360 ? '360' : 'image',
                src: `${R2_PUBLIC_BASE_URL}/${img.medium_path}`, // ảnh medium
                thumb: `${R2_PUBLIC_BASE_URL}/${img.thumb_path}`, // thumbnail
                full: `${R2_PUBLIC_BASE_URL}/${img.image_path}`, // ảnh full
            });
        });

        return list;
    };

    const mediaList = useMemo(
        () => buildMediaList(post),
        [post.id, post.images, post.video, post.youtube_url],
    );

    useEffect(() => {
        setActiveMedia(
            mediaList.find((m) => m.type === 'video') ||
                mediaList.find((m) => m.type === 'youtube') ||
                mediaList.find((m) => m.type === '360') ||
                mediaList.find((m) => m.type === 'image'),
        );
    }, [mediaList]);

    // Tối ưu cảm giác load
    useEffect(() => {
        if (activeMedia?.type === 'image' || activeMedia?.type === '360') {
            const img = new Image();
            img.src = activeMedia.src;

            return () => {
                img.src = '';
            };
        }
    }, [activeMedia]);

    // Hàm kiểm tra scroll
    function checkScroll() {
        const el = galleryRef.current;
        if (!el) return;

        requestAnimationFrame(() => {
            const tolerance = 2;
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(
                el.scrollLeft + el.clientWidth < el.scrollWidth - tolerance,
            );
        });
    }

    function scrollGallery(direction = 1) {
        const el = galleryRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.8 * direction;
        el.scrollBy({ left: amount, behavior: 'smooth' });
    }

    // Dùng useLayoutEffect để chạy ngay sau render, trước khi paint
    useLayoutEffect(() => {
        checkScroll();
    }, [mediaList]); // mediaList thay đổi thì kiểm tra scroll

    // Gắn listener scroll / resize
    useEffect(() => {
        const el = galleryRef.current;
        if (!el) return;

        el.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);

        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, []);

    const handleStartChat = async () => {
        try {
            const res = await axios.post('/conversations/start', {
                receiver_id: post.user.id,
            });
            const conversationId = res.data.conversation_id;
            router.visit(`/chatbox?open=${conversationId}`);
        } catch (err) {
            console.error('Error starting conversation:', err);
            toast.error('Không thể bắt đầu cuộc trò chuyện.');
        }
    };

    const handleSelectMedia = (media) => {
        setActiveMedia(media);
    };

    return (
        <>
            <Head title={`StayHub | ${post.title}`} />
            <Navbar />
            <section className="property-detail">
                {/* ảnh phòng chính */}
                <div className="property-detail__main-image">
                    {/* Ưu tiên video upload */}
                    {activeMedia?.type === 'video' && (
                        <video
                            controls
                            playsInline
                            muted
                            width="100%"
                            height="100.2%"
                            key={activeMedia.id}
                        >
                            <source src={activeMedia.src} type="video/mp4" />
                        </video>
                    )}

                    {/* Nếu không có video thì dùng YouTube */}
                    {activeMedia?.type === 'youtube' && (
                        <iframe
                            key={activeMedia.id}
                            src={`https://www.youtube.com/embed/${activeMedia.src}?autoplay=0&mute=1`}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="main-video"
                        />
                    )}

                    {/* Nếu không có video và yt thì chơi ảnh 360 */}
                    {activeMedia?.type === '360' && (
                        <Image360Viewer
                            key={activeMedia.id}
                            src={activeMedia.full}
                        />
                    )}

                    {activeMedia?.type === 'image' && (
                        <img
                            key={activeMedia.id}
                            src={activeMedia.src} // medium
                            data-full={activeMedia.full}
                            alt={post.title}
                            loading="eager"
                            decoding="async"
                        />
                    )}
                </div>

                <div className="property-detail__content">
                    <div className="property-detail__info">
                        {/* ảnh con */}
                        <div className="gallery-wrapper">
                            {canScrollLeft && (
                                <button
                                    className="gallery-btn left"
                                    onClick={() => scrollGallery(-1)}
                                >
                                    ❮
                                </button>
                            )}

                            <div
                                ref={galleryRef}
                                id="galleryScroll"
                                className="property-detail__gallery"
                            >
                                {mediaList.map((media) => (
                                    <div
                                        key={media.id}
                                        className={`property-detail__gallery-item ${
                                            activeMedia?.id === media.id
                                                ? 'is-active'
                                                : ''
                                        }`}
                                        style={{ position: 'relative' }}
                                        onClick={() => handleSelectMedia(media)}
                                    >
                                        {media.type === 'video' && (
                                            <div className="video-thumb video-thumb__video">
                                                <img
                                                    style={{
                                                        height: 62,
                                                        width: 62,
                                                        objectFit: 'cover',
                                                    }}
                                                    src="/icons/icon-play.svg"
                                                    alt="icon-play"
                                                />
                                            </div>
                                        )}

                                        {media.type === 'youtube' && (
                                            <div className="video-thumb video-thumb__youtube">
                                                <svg
                                                    height="62px"
                                                    width="62px"
                                                    version="1.1"
                                                    viewBox="0 0 68 48"
                                                >
                                                    <path
                                                        d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                                                        fill="#ff0033"
                                                    ></path>
                                                    <path
                                                        d="M 45,24 27,14 27,34"
                                                        fill="#fff"
                                                    ></path>
                                                </svg>
                                            </div>
                                        )}

                                        {media.type === '360' && (
                                            <span
                                                className="image-cover-badge"
                                                style={{
                                                    background: '#e8e8e8',
                                                    color: '#000',
                                                }}
                                            >
                                                Ảnh 360°
                                            </span>
                                        )}

                                        {(media.type === 'image' ||
                                            media.type === '360') && (
                                            <img
                                                src={media.thumb ?? media.src}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {canScrollRight && (
                                <button
                                    className="gallery-btn right"
                                    onClick={() => scrollGallery(1)}
                                >
                                    ❯
                                </button>
                            )}
                        </div>

                        <div className="property-detail__header">
                            {/* Tiêu đề */}
                            <h1 className="property-detail__title">
                                {post.title}
                            </h1>

                            <div
                                className="property-detail__save"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggle();
                                }}
                            >
                                <img
                                    src={
                                        isLiked
                                            ? '/icons/heart-filled.svg'
                                            : '/icons/heart.svg'
                                    }
                                    alt="heart-empty.svg"
                                />
                                <span className="property-detail__save-text">
                                    {isLiked ? 'Đã lưu' : 'Lưu'}
                                </span>
                            </div>
                        </div>

                        {/* Địa chỉ */}
                        <div className="property-detail__address">
                            <svg
                                data-type="monochrome"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill="none"
                            >
                                <path
                                    d="M18.0005 10.0439C18.0005 6.70038 15.3084 4 12.0005 4C8.69261 4 6.00049 6.70038 6.00049 10.0439C6.00061 10.9862 6.35786 12.0899 6.979 13.2705C7.59357 14.4386 8.42503 15.6049 9.27588 16.6514C10.1241 17.6945 10.9756 18.599 11.6157 19.2432C11.7546 19.3829 11.8843 19.5096 12.0005 19.623C12.1167 19.5096 12.2464 19.3829 12.3853 19.2432C13.0254 18.599 13.8769 17.6945 14.7251 16.6514C15.5759 15.6049 16.4074 14.4386 17.022 13.2705C17.6431 12.0899 18.0004 10.9862 18.0005 10.0439ZM13.2368 9.75C13.2367 9.05386 12.6773 8.5 12.0005 8.5C11.3238 8.50016 10.7652 9.05396 10.7651 9.75C10.7651 10.4461 11.3238 10.9998 12.0005 11C12.6773 11 13.2368 10.4462 13.2368 9.75ZM20.0005 10.0439C20.0004 11.4492 19.4826 12.8887 18.7915 14.2021C18.0937 15.5284 17.1749 16.8075 16.2759 17.9131C15.3742 19.0219 14.4755 19.9768 13.8032 20.6533C13.4666 20.992 13.1851 21.2623 12.9868 21.4492C12.8876 21.5427 12.8088 21.6161 12.7544 21.666C12.7274 21.6908 12.7066 21.7103 12.6919 21.7236C12.6845 21.7303 12.6784 21.7356 12.6743 21.7393C12.6724 21.741 12.6706 21.7421 12.6694 21.7432L12.6675 21.7451L12.0005 22.3418L11.3335 21.7451L11.3315 21.7432C11.3304 21.7421 11.3286 21.741 11.3267 21.7393C11.3226 21.7356 11.3164 21.7303 11.3091 21.7236C11.2944 21.7103 11.2736 21.6908 11.2466 21.666C11.1921 21.6161 11.1134 21.5427 11.0142 21.4492C10.8158 21.2623 10.5344 20.992 10.1978 20.6533C9.52545 19.9768 8.62674 19.0219 7.7251 17.9131C6.82612 16.8075 5.90731 15.5284 5.20947 14.2021C4.51839 12.8887 4.0006 11.4492 4.00049 10.0439C4.00049 5.6075 7.57638 2 12.0005 2C16.4246 2 20.0005 5.6075 20.0005 10.0439ZM15.2368 9.75C15.2368 11.5391 13.7936 13 12.0005 13C10.2075 12.9998 8.76514 11.539 8.76514 9.75C8.76521 7.96108 10.2076 6.50015 12.0005 6.5C13.7935 6.5 15.2367 7.96099 15.2368 9.75Z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                            <span>{post.address}</span>
                        </div>

                        {/* mô tả bài đăng */}
                        <h3 className="property-detail__heading-title">
                            Thông tin mô tả
                        </h3>
                        <pre className="property-detail__description">
                            {post.description}
                        </pre>

                        {/* Đặc điểm bất động sản */}
                        <h3 className="property-detail__heading-title">
                            Đặc điểm bất động sản
                        </h3>

                        <div className="property-detail__features">
                            <div className="property-detail__feature-row">
                                {attribute.map((att) => (
                                    <div
                                        key={att.id}
                                        className="property-detail__feature-item"
                                    >
                                        <img
                                            loading="lazy"
                                            src={att.icon}
                                            alt={att.lable}
                                            className="property-detail__feature-icon"
                                        />
                                        <span className="property-detail__feature-label">
                                            {att.lable}
                                        </span>
                                        <strong className="property-detail__feature-value">
                                            {att.value}
                                        </strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/*================= Phần thông tin phòng ===============*/}
                    <div className="property-detail__room-info">
                        <p className="property-detail__room-title">
                            Thông tin ngắn gọn
                        </p>

                        <p className="property-detail__owner">
                            <span className="property-detail__owner-label">
                                Chủ sở hữu:{' '}
                            </span>
                            {post?.user?.name}
                        </p>

                        {/* Tiện ích */}
                        <div className="property-detail__amenities">
                            {/* Phòng ngủ phòng tắm phòng khách bếp diện tích */}
                            {utilities.map((item) => (
                                <div
                                    key={item.id}
                                    className="property-detail__amenity-item"
                                >
                                    <img
                                        loading="lazy"
                                        src={item.icon}
                                        alt="icon"
                                        className="property-detail__amenity-icon"
                                    />
                                    <span className="property-detail__amenity-value">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Giá cả */}
                        <div className="property-detail__price-box">
                            <div className="property-detail__price">
                                <span className="property-detail__price-label">
                                    Giá{' '}
                                </span>
                                <strong className="property-detail__price-value">
                                    {formatPrice(post.price)}
                                </strong>
                            </div>

                            <div className="property-detail__price">
                                <span className="property-detail__price-label">
                                    Diện tích{' '}
                                </span>
                                <strong className="property-detail__price-value">
                                    {post.area} m²
                                </strong>
                            </div>
                        </div>

                        {/* nút bấm */}
                        <div className="property-detail__actions">
                            <button
                                className="property-detail__button property-detail__button--primary"
                                onClick={() => setOpen(true)}
                            >
                                Thông tin liên hệ
                            </button>

                            <button
                                className="property-detail__button property-detail__button--chat"
                                onClick={() => {
                                    auth?.user
                                        ? handleStartChat()
                                        : toast.error(
                                              'Bạn cần đăng nhập để bắt đầu cuộc trò chuyện!',
                                          );
                                }}
                            >
                                <img src="/icons/chat.svg" alt="chat" />
                            </button>
                        </div>
                    </div>
                </div>

                {open && (
                    <div className="auth-form">
                        <div
                            ref={menuRef}
                            style={{
                                height: 600,
                                width: 400,
                                background: '#fff',
                            }}
                        >
                            <h1>Thông tin liên hệ</h1>
                            <div
                                style={{
                                    height: 60,
                                    width: 60,
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    style={{ height: '100%' }}
                                    src={`/${post.user?.avatar_image_url}`}
                                    alt="avatar"
                                />
                            </div>
                            <p>Chủ sở hữu: {post.user.name}</p>
                            <p>SĐT: {post.user.phone ?? 'Chưa cập nhật'}</p>
                            <p>Email: {post.user.email}</p>
                        </div>
                    </div>
                )}

                {/* Xem trên bản đồ */}
                <div className="property-detail__section--map">
                    <h3 className="property-detail__heading-title">
                        Xem trên bản đồ
                    </h3>

                    <div className="property-detail__map">
                        <MapView lng={post.longitude} lat={post.latitude} />
                    </div>
                </div>

                {/* Ngày đăng bài và ngày hết hạn */}
                <div className="property-detail__meta">
                    {meta.map((m) => (
                        <div key={m.id} className="property-detail__meta-item">
                            <span className="property-detail__meta-label">
                                {m.title}
                            </span>
                            <span className="property-detail__meta-value">
                                {m.value}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="property-detail__card-list">
                    <h1 className="header_title card__heading--title">
                        Bất động sản liên quan
                    </h1>

                    <CardList post={relatedPosts} limit={10} showMore={true} />
                </div>

                <Chat />
            </section>

            <Footer />
        </>
    );
}

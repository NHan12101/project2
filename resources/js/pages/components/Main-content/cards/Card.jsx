import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import {
    faChevronDown,
    faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import './Card.css';

export default function Card({post}) {
    const data = post || usePage().props.posts || [];
    // console.log(data)
    const [likedItems, setLikedItems] = useState([]);
    const [visibleCount, setVisibleCount] = useState(6);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [direction, setDirection] = useState(0);

    function toggleLike(id) {
        setLikedItems((prev) =>
            prev.includes(id)
                ? prev.filter((likedId) => likedId !== id)
                : [...prev, id],
        );
    }

    function handleShowMore() {
        if (visibleCount + 6 <= 12) {
            setVisibleCount(visibleCount + 6);
        } else {
            router.get('/login');
        }
    }

    function handlePrevImage(id, total) {
        setDirection(-1);
        setCurrentImageIndex((prev) => ({
            ...prev,
            [id]: prev[id] > 0 ? prev[id] - 1 : total - 1,
        }));
    }

    function handleNextImage(id, total) {
        setDirection(1);
        setCurrentImageIndex((prev) => ({
            ...prev,
            [id]: prev[id] < total - 1 ? prev[id] + 1 : 0,
        }));
    }

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            zIndex: 1,
        },
        exit: (direction) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            zIndex: 0,
        }),
    };

    return (
        <div className="main-contain">
            <div className="property-grid">
                {data.slice(0, visibleCount).map((item) => {
                    const isLiked = likedItems.includes(item.id);
                    const currentIndex = currentImageIndex[item.id] || 0;
                    // const imageSrc = `/${item?.images[currentIndex]?.image_path}`;
                    const imageSrc = `/storage/${item?.images[currentIndex]?.image_path}`;


                    return (
                        <div
                            key={item.id}
                            className="property-card"
                            onClick={() =>
                                router.get(`/property-detail/${item.id}`)
                            }
                        >
                            {item.is_vip ? (
                                <span className="vip-badge">VIP</span>
                            ) : undefined}

                            {item.images?.length > 0 && (
                                <div className="image-container">
                                    {/* prettier-ignore */}
                                    <AnimatePresence mode="popLayout" custom={direction}>
                                            <motion.img
                                                key={currentIndex}
                                                src={imageSrc}
                                                alt={item.title}
                                                className="property-img"
                                                custom={direction}
                                                variants={slideVariants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                            transition={{
                                            x: { type: 'spring', stiffness: 250, damping: 25 },
                                            opacity: { duration: 0.28 },
                                            }}
                                            />
                                        </AnimatePresence>

                                    {item.images.length > 1 && (
                                        <>
                                            <button
                                                className="arrow-btn left"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePrevImage(
                                                        item.id,
                                                        item.images.length,
                                                    );
                                                }}
                                            >
                                                ‹
                                            </button>
                                            <button
                                                className="arrow-btn right"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNextImage(
                                                        item.id,
                                                        item.images.length,
                                                    );
                                                }}
                                            >
                                                ›
                                            </button>
                                        </>
                                    )}

                                    <div className="dot-container">
                                        {item.images.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`card__dot ${
                                                    index === currentIndex
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    setCurrentImageIndex(
                                                        (prev) => ({
                                                            ...prev,
                                                            [item.id]: index,
                                                        }),
                                                    )
                                                }
                                            ></span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="property-info">
                                <h1 className="property-title">{item.title}</h1>
                                <p className="property-meta">
                                    Phòng ngủ: <b>{item.bedrooms}</b>
                                    &nbsp;|&nbsp; Diện tích:
                                    <b> {item.area}m²</b>
                                </p>
                                <p className="property-price">{item.price}</p>
                                <p className="property-location">
                                    <MapPin className="w-6 h-6" />
                                    <span>{item.city.name}</span>
                                </p>

                                <div className="property-heart">
                                    <p className="property-posted">
                                        Đăng {new Date().toLocaleDateString()}
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike(item.id);
                                        }}
                                        className="heart-button bell-btn"
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                isLiked
                                                    ? faHeartSolid
                                                    : faHeartRegular
                                            }
                                            color={isLiked ? '#ff4d4d' : '#888'}
                                            size="xl"
                                            style={{
                                                transition:
                                                    'transform 0.5s ease, color 0.6s ease',
                                                transform: isLiked
                                                    ? 'scale(1.26)'
                                                    : 'scale(1)',
                                            }}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {data.length > 6 && (
                <div className="show-more-container">
                    {visibleCount + 6 <= 12 ? (
                        <button
                            className="show-more-btn"
                            onClick={handleShowMore}
                        >
                            Mở rộng
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className="expand-icon"
                            />
                        </button>
                    ) : (
                        <button
                            className="show-more-btn"
                            onClick={handleShowMore}
                        >
                            Xem tất cả
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

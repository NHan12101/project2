import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useState } from 'react';

export default function CardItem({ item }) {
    const [likedItems, setLikedItems] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [direction, setDirection] = useState(0);

    function toggleLike(id) {
        setLikedItems(prev =>
            prev.includes(id)
                ? prev.filter(likedId => likedId !== id)
                : [...prev, id]
        );
    }

    function handlePrevImage(id, total) {
        setDirection(-1);
        setCurrentImageIndex(prev => ({
            ...prev,
            [id]: prev[id] > 0 ? prev[id] - 1 : total - 1,
        }));
    }

    function handleNextImage(id, total) {
        setDirection(1);
        setCurrentImageIndex(prev => ({
            ...prev,
            [id]: prev[id] < total - 1 ? prev[id] + 1 : 0,
        }));
    }

    const slideVariants = {
        enter: direction => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: direction => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
        }),
    };

    function formatPrice(price) {
        if (price >= 1_000_000_000) {
            return (price / 1_000_000_000).toFixed(1).replace('.', ',') + ' tỷ';
        } else if (price >= 1_000_000) {
            return (price / 1_000_000).toFixed(1).replace('.', ',') + ' triệu';
        } else {
            return price.toLocaleString('vi-VN');
        }
    }

    const isLiked = likedItems.includes(item.id);
    const currentIndex = currentImageIndex[item.id] || 0;
    const imageSrc = `/storage/${item?.images[currentIndex]?.image_path}`;

    return (
        <article
            className="property-card"
            onClick={() => router.get(`/property-detail/${item.id}`)}
        >
            {item.is_vip ? <span className="vip-badge">VIP</span> : undefined}

            {item.images?.length > 0 && (
                <div className="image-container">
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
                                onClick={e => {
                                    e.stopPropagation();
                                    handlePrevImage(item.id, item.images.length);
                                }}
                            >
                                ‹
                            </button>
                            <button
                                className="arrow-btn right"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleNextImage(item.id, item.images.length);
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
                                    index === currentIndex ? 'active' : ''
                                }`}
                                onClick={() =>
                                    setCurrentImageIndex(prev => ({
                                        ...prev,
                                        [item.id]: index,
                                    }))
                                }
                            ></span>
                        ))}
                    </div>
                </div>
            )}

            <div className="property-info">
                <h1 className="property-title">{item.title}</h1>

                <p className="property-meta">
                    Phòng ngủ: <b>{item.bedrooms}</b> | Diện tích: <b>{item.area}m²</b>
                </p>

                <p className="property-price">
                    <span>Giá:</span> {formatPrice(item.price)}
                </p>

                <p className="property-location">
                    <MapPin className="w-6 h-6" />
                    <span>{item.city.name}</span>
                    <span>{item?.category?.name}</span>
                </p>

                <div className="property-heart">
                    <p className="property-posted">
                        Đăng {new Date().toLocaleDateString()}
                    </p>

                    <button
                        className="heart-button"
                        onClick={e => {
                            e.stopPropagation();
                            toggleLike(item.id);
                        }}
                    >
                        <FontAwesomeIcon
                            icon={isLiked ? faHeartSolid : faHeartRegular}
                            color={isLiked ? '#ff4d4d' : '#181818'}
                            size="xl"
                            style={{ transition: 'color 0.4s' }}
                        />
                    </button>
                </div>
            </div>
        </article>
    );
}

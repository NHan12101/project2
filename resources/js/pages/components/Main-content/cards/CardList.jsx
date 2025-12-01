import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import './Card.css';
import CardItem from './CardItem';

export default function CardList({ post, limit = 8, showMore = true }) {
    const { posts, isHome } = usePage().props;
    const data = post || posts || [];

    const [visibleCount, setVisibleCount] = useState(limit);

    function handleShowMore() {
        if (visibleCount + 8 <= 16) {
            setVisibleCount(visibleCount + 8);
        } else {
            // Chỉ trang Home mới có logic XEM TẤT CẢ
            if (isHome) {
                router.get('/login');
            }
        }
    }

    return (
        <div className="main-contain">
            <div className="property-grid">
                {data.slice(0, visibleCount).map((item) => (
                    <CardItem key={item.id} item={item} />
                ))}
            </div>

            {showMore && data.length > limit && (
                <div className="show-more-container">
                    {/* nút MỞ RỘNG — luôn có */}
                    {visibleCount + 8 <= 16 && (
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
                    )}

                    {/* nút XEM TẤT CẢ — chỉ Home mới có */}
                    {visibleCount + 8 > 16 && isHome && (
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

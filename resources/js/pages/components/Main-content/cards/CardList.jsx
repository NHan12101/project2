import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import './Card.css';
import CardItem from './CardItem';

export default function CardList({ post, limit = 8, showMore = true }) {
    const { posts, favoritePostIds, isHome } = usePage().props;
    const data = post || posts || [];

    const [visibleCount, setVisibleCount] = useState(limit);

    const increment = isHome ? 8 : 10;
    const maxVisible = isHome ? 16 : 20;

    function handleShowMore() {
        if (visibleCount + increment <= maxVisible) {
            setVisibleCount(visibleCount + increment);
        } else {
            // Chỉ trang Home mới có logic XEM TẤT CẢ
            if (isHome) {
                router.get('/home-finder');
            }
        }
    }

    return (
        <>
            <div className="property-grid">
                {data.slice(0, visibleCount).map((item) => (
                    <CardItem key={item.id} item={item} favoritePostIds={favoritePostIds}/>
                ))}
            </div>

            {showMore && data.length > limit && (
                <div className="show-more-container">
                    {/* nút MỞ RỘNG — luôn có */}
                    {visibleCount + increment <= maxVisible && (
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
                    {visibleCount + increment > maxVisible && isHome && (
                        <button
                            className="show-more-btn"
                            onClick={handleShowMore}
                        >
                            Xem tất cả
                        </button>
                    )}
                </div>
            )}
        </>
    );
}

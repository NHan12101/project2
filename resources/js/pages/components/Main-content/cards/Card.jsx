import { useEffect, useState } from 'react';
import './Card.css';

export default function Card() {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        // Gọi API Laravel
        fetch('/api/properties')
            .then((res) => res.json())
            .then((data) => setProperties(data))
            .catch((err) => console.error('Lỗi tải dữ liệu:', err));
    }, []);

    function randomImage() {
        return Math.floor(Math.random()*3)
    }

    return (
        <div className="main-contain">
            <a href="../../../property-detail">
                <div className="property-grid">
                    {properties.map((item) => (
                        <div key={item.id} className="property-card">
                            {item.isVip && (
                                <span className="vip-badge">VIP</span>
                            )}

                            {/* Hiển thị ảnh đầu tiên */}
                            {item.images?.length > 0 && (
                                <img
                                    src={`http://localhost:8000/${item.images[randomImage()].image_path}`}
                                    alt={item.title}
                                    className="property-img"
                                />
                            )}

                            <div className="property-info">
                                <h3 className="property-title">{item.title}</h3>
                                <p className="property-meta">
                                    Phòng ngủ: <b>{item.bedrooms}</b>
                                    &nbsp;|&nbsp; Diện tích:
                                    <b>{item.area}m²</b>
                                </p>
                                <p className="property-price">{item.price}</p>
                                <p className="property-location">
                                    {item.location}
                                </p>
                                <p className="property-posted">
                                    {item.postedAt}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </a>
        </div>
    );
}

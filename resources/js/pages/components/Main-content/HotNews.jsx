import { useRef, useState } from 'react';
import './HotNews.css';
import { router } from '@inertiajs/react';

export default function HotNews() {
    const hotNews = {
        categories: [
            { id: 1, name: 'Tin nổi bật' },
            { id: 2, name: 'Tin tức' },
            { id: 3, name: 'BĐS TPHCM' },
            { id: 4, name: 'BĐS Hà Nội' },
        ],

        relatedPosts: [
            {
                id: 1,
                title: 'Trọn Bộ Lãi Suất Vay Mua Nhà Mới Nhất',
                image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop',
                date: 'Thứ hai, 15/12/2025',
                desc: 'Tổng hợp đầy đủ các gói lãi suất vay mua nhà từ các ngân hàng lớn tại Việt Nam, giúp bạn có cái nhìn toàn diện...',
            },
            {
                id: 2,
                title: 'Nhà Ở Xã Hội Tiếp Tục Tăng Giá Mạnh',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=600&fit=crop',
                date: 'Thứ hai, 12/01/2026',
                desc: 'Đã tăng giá không ngừng nghỉ của căn hộ thương mại trong suốt những năm gần đây cũng kéo theo đà tăng giá ...',
            },
            {
                id: 3,
                title: 'A&T Group Khởi Công Tuyến Đường Ven Sông Sài Gòn',
                image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=600&fit=crop',
                date: 'Thứ hai, 02/02/2026',
                desc: 'Dự án quy mô lớn của A&T Group hứa hẹn tạo nên một diện mạo mới cho khu vực ven sông Sài Gòn, mang đến...',
            },
            {
                id: 4,
                title: 'Giá Chung Cư Đi Ngang, Nhà Đầu Tư Đứng Ngồi Không Yên',
                image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop',
                date: 'Thứ ba, 18/11/2025',
                desc: 'Thị trường bất động sản đang trải qua giai đoạn khó khăn khi giá chung cư không tăng trong khi lãi suất...',
            },
            {
                id: 5,
                title:  'Hà Nội Đón Nguồn Cung Mới Thời Điểm Cuối Năm',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
                date: 'Thứ 2, 12/01/2025',
                desc: 'Khu vực phía Đông Hà Nội đang chứng kiến làn sóng nguồn cung mới từ nhiều dự án lớn, hứa hẹn mang đến...',
            },
        ],

        asideImages: ['/images/qc.jpg', '/images/qc1.jpg']
    };

    // State lưu bài chính
    const [mainPost, setMainPost] = useState(hotNews.relatedPosts[0]);
    const [fade, setFade] = useState(false);
    const [activeId, setActiveId] = useState(hotNews.categories[0].id); // mặc định "Tin nổi bật"
    const [hoverId, setHoverId] = useState(null);
    const timeoutRef = useRef(null);

    const handleMouseEnter = (post) => {
        setFade(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setMainPost(post);
            setFade(false);
        }, 100);
    };

    return (
        <section className="hot-news">
            <div className="main-contain">
                <div className="hot-news__container">
                    {/* LEFT CONTENT */}
                    <div className="hot-news__content">
                        {/* CATEGORY LIST */}
                        <div className="hot-news__categories">
                            <ul className="hot-news__category-list">
                                {hotNews.categories.map((cat) => (
                                    <li
                                        key={cat.id}
                                        className={`hot-news__category-item ${cat.id === activeId ? 'active' : ''} ${cat.id === hoverId ? 'hover' : ''}`}
                                        onMouseEnter={() => setHoverId(cat.id)}
                                        onMouseLeave={() => setHoverId(null)}
                                        onClick={() => setActiveId(cat.id)} // click sẽ set active
                                    >
                                        {cat.name}
                                    </li>
                                ))}
                            </ul>

                            <a href="" className="hot-news__view-more">
                                Xem thêm
                            </a>
                        </div>

                        {/* MAIN + RELATED POSTS */}
                        <div className="hot-news__body">
                            {/* MAIN FEATURED POST */}
                            <div
                                className={`hot-news__main-post ${fade ? 'fade' : ''}`}
                            >
                                <div className="hot-news__main-figure">
                                    <img
                                        className="hot-news__main-image"
                                        src={mainPost.image}
                                        alt={mainPost.title}
                                    />
                                </div>
                                <h2 className="hot-news__main-caption">
                                    {mainPost.title}
                                </h2>
                                <span className="hot-news__main-date">
                                    {mainPost.date}
                                </span>
                                <p className="hot-news__main-desc">
                                    {mainPost.desc}
                                </p>
                            </div>

                            {/* RELATED POSTS */}
                            <div className="hot-news__related">
                                {hotNews.relatedPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="hot-news__related-item"
                                        onClick={()=> router.visit('/blogs')}
                                        onMouseEnter={() =>
                                            handleMouseEnter(post)
                                        }
                                    >
                                        <div className="hot-news__related-figure">
                                            <img
                                                className="hot-news__related-image"
                                                src={post.image}
                                                alt={post.title}
                                            />
                                        </div>
                                        <h2 className="hot-news__related-caption">
                                            {post.title}
                                        </h2>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT IMAGES / ADS */}
                    <div className="hot-news__aside">
                        {hotNews.asideImages.map((img, index) => (
                            <div key={index} className="hot-news__aside--box">
                                {/* <img src={img} alt="qc" /> */}
                                <h3
                                    style={{
                                        textAlign: 'center',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Liên hệ quảng cáo tại đây <br />
                                    0987654321
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

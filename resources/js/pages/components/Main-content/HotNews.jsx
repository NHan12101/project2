import { useRef, useState } from 'react';
import './HotNews.css';

export default function HotNews() {
    const hotNews = {
        categories: [
            { id: 1, name: 'Tin nổi bật' },
            { id: 2, name: 'Tin Tức' },
            { id: 3, name: 'BĐS TPHCM' },
            { id: 4, name: 'BĐS Hà Nội' },
        ],

        relatedPosts: [
            {
                id: 1,
                title: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
                image: '/images/image.gif',
                date: '02/12/2025',
                desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum laboriosam quam sint debitis magnam!...',
            },
            {
                id: 2,
                title: 'Suscipit, ipsum? Fuga autem aliquam voluptas.',
                image: '/images/blog2.png',
                date: '06/12/2025',
                desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum laboriosam quam sint debitis magnam!...',
            },
            {
                id: 3,
                title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
                image: '/images/blog3.png',
                date: '08/12/2025',
                desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum laboriosam quam sint debitis magnam!...',
            },
            {
                id: 4,
                title: 'Suscipit, ipsum? Fuga autem aliquam voluptas.',
                image: '/images/blog4.png',
                date: '10/12/2025',
                desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum laboriosam quam sint debitis magnam!...',
            },
            {
                id: 5,
                title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
                image: '/images/blog1.png',
                date: '12/12/2025',
                desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum laboriosam quam sint debitis magnam!...',
            },
        ],

        asideImages: ['/images/blog4.png', '/images/blog4.png'],
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
                                {/* <img src={img} alt="" /> */}
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

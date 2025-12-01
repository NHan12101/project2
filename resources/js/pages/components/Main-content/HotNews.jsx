import './HotNews.css';

export default function HotNews() {
    return (
        <section className="hot-news">
            <div className="main-contain">
                <div className="hot-news__container">
                    {/* LEFT CONTENT */}
                    <div className="hot-news__content">
                        {/* CATEGORY LIST */}
                        <div className="hot-news__categories">
                            <ul className="hot-news__category-list">
                                <li className="hot-news__category-item hot-news__category-item--active">
                                    Tin nổi bật
                                </li>
                                <li className="hot-news__category-item">
                                    Tin Tức
                                </li>
                                <li className="hot-news__category-item">
                                    BĐS TPHCM
                                </li>
                                <li className="hot-news__category-item">
                                    BĐS Hà Nội
                                </li>
                            </ul>

                            <a href="" className="hot-news__view-more">
                                Xem thêm
                            </a>
                        </div>

                        {/* MAIN + RELATED POSTS */}
                        <div className="hot-news__body">
                            {/* MAIN FEATURED POST */}
                            <div className="hot-news__main-post">
                                <div className="hot-news__main-figure">
                                    <img
                                        className="hot-news__main-image"
                                        src="/"
                                        alt=""
                                    />
                                </div>

                                <h2 className="hot-news__main-caption">
                                    Lorem ipsum dolor sit, amet consectetur
                                    adipisicing elit. Quidem ab officiis nulla
                                    deleniti expedita.
                                </h2>

                                <span className="hot-news__main-date">
                                    Ngày Tháng
                                </span>

                                <p className="hot-news__main-desc">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Harum laboriosam quam sint
                                    debitis magnam! Unde assumenda, iure cumque
                                    aspernatur quam neque nulla nobis, facilis
                                    at molestiae aperiam, nam sint recusandae?
                                    Perspiciatis iusto libero esse! Accusantium?
                                    Lorem ipsum dolor sit, amet consectetur
                                    adipisicing elit.
                                </p>
                            </div>

                            {/* RELATED POSTS */}
                            <div className="hot-news__related">
                                <div className="hot-news__related-item">
                                    <div className="hot-news__related-figure">
                                        <img
                                            className="hot-news__related-image"
                                            src="/"
                                            alt=""
                                        />
                                    </div>
                                    <h2 className="hot-news__related-caption">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipisicing elit. Suscipit, ipsum? Fuga
                                        autem aliquam voluptas.
                                    </h2>
                                </div>
                                <div className="hot-news__related-item">
                                    <div className="hot-news__related-figure">
                                        <img
                                            className="hot-news__related-image"
                                            src="/"
                                            alt=""
                                        />
                                    </div>
                                    <h2 className="hot-news__related-caption">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipisicing elit. Suscipit, ipsum? Fuga
                                        autem aliquam voluptas.
                                    </h2>
                                </div>
                                <div className="hot-news__related-item">
                                    <div className="hot-news__related-figure">
                                        <img
                                            className="hot-news__related-image"
                                            src="/"
                                            alt=""
                                        />
                                    </div>
                                    <h2 className="hot-news__related-caption">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipisicing elit. Suscipit, ipsum? Fuga
                                        autem aliquam voluptas.
                                    </h2>
                                </div>
                                <div className="hot-news__related-item">
                                    <div className="hot-news__related-figure">
                                        <img
                                            className="hot-news__related-image"
                                            src="/"
                                            alt=""
                                        />
                                    </div>
                                    <h2 className="hot-news__related-caption">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipisicing elit. Suscipit, ipsum? Fuga
                                        autem aliquam voluptas.
                                    </h2>
                                </div>
                                <div className="hot-news__related-item">
                                    <div className="hot-news__related-figure">
                                        <img
                                            className="hot-news__related-image"
                                            src="/"
                                            alt=""
                                        />
                                    </div>
                                    <h2 className="hot-news__related-caption">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipisicing elit. Suscipit, ipsum? Fuga
                                        autem aliquam voluptas.
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT IMAGES / ADS */}
                    <div className="hot-news__aside">
                        <div className="hot-news__aside--box">
                            <img src="/" alt="" />
                        </div>
                        <div className="hot-news__aside--box">
                            <img src="/" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import {
    Bookmark,
    Calendar,
    Clock,
    Facebook,
    MessageCircle,
    ThumbsUp,
    Twitter,
    User,
} from 'lucide-react';
import { useState } from 'react';
// import('./BlogsDetail.css');
import { Link } from '@inertiajs/react';
const BlogDetail = () => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likes, setLikes] = useState(245);
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
        if (isLiked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setIsLiked(!isLiked);
    };

    const relatedPosts = [
        {
            id: 1,
            title: 'Đầu tư bất động sản: Căn hộ hay đất nền?',
            image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=400&h=250&fit=crop',
            date: '10/10/2025',
        },
        {
            id: 2,
            title: 'Thủ tục pháp lý khi mua bán nhà đất',
            image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop',
            date: '08/10/2025',
        },
        {
            id: 3,
            title: 'Phân tích thị trường bất động sản TP.HCM',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
            date: '05/10/2025',
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="blog-detail-container">
                <button className="back-btn">
                    <Link href="/blogs">Quay lại trang →</Link>
                </button>

                <div className="blog-detail-content">
                    <div className="main-content">
                        <span className="blog-category-badge">Thị trường</span>

                        <h1 className="blog-title">
                            Xu hướng thị trường bất động sản 2025: Cơ hội và
                            thách thức
                        </h1>

                        <div className="blog-meta">
                            <div className="meta-item">
                                <User size={18} />
                                <span>Nguyễn Văn A</span>
                            </div>
                            <div className="meta-item">
                                <Calendar size={18} />
                                <span>15/10/2025</span>
                            </div>
                            <div className="meta-item">
                                <Clock size={18} />
                                <span>8 phút đọc</span>
                            </div>
                        </div>

                        <div className="blog-featured-image">
                            <img
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop"
                                alt="Blog featured"
                            />
                        </div>

                        <div className="blog-body">
                            <p>
                                Thị trường bất động sản Việt Nam năm 2025 đang
                                chứng kiến những thay đổi đáng kể với nhiều cơ
                                hội mới cùng những thách thức không nhỏ. Trong
                                bối cảnh kinh tế phục hồi sau đại dịch, ngành
                                bất động sản đang dần tìm lại sự ổn định và phát
                                triển theo hướng bền vững hơn.
                            </p>

                            <h2>1. Những xu hướng nổi bật</h2>
                            <p>
                                Thị trường bất động sản 2025 được đánh dấu bởi
                                sự chuyển mình mạnh mẽ với nhiều xu hướng mới.
                                Các nhà đầu tư và người mua nhà đang có những
                                thay đổi đáng kể trong cách tiếp cận và lựa chọn
                                sản phẩm bất động sản.
                            </p>

                            <h3>1.1. Bất động sản xanh và bền vững</h3>
                            <p>
                                Xu hướng bất động sản xanh đang ngày càng được
                                ưa chuộng. Các dự án chú trọng đến yếu tố môi
                                trường, tiết kiệm năng lượng và thân thiện với
                                thiên nhiên đang thu hút sự quan tâm lớn từ thị
                                trường. Điều này không chỉ đáp ứng nhu cầu sống
                                xanh của cư dân mà còn góp phần bảo vệ môi
                                trường.
                            </p>

                            <blockquote>
                                Bất động sản xanh không chỉ là xu hướng mà đã
                                trở thành tiêu chuẩn mới của thị trường. Các dự
                                án không đáp ứng được tiêu chí này sẽ dần mất đi
                                lợi thế cạnh tranh.
                            </blockquote>

                            <h3>1.2. Chuyển đổi số trong giao dịch</h3>
                            <p>
                                Công nghệ đang thay đổi cách thức giao dịch bất
                                động sản. Từ việc xem nhà trực tuyến, ký kết hợp
                                đồng điện tử đến thanh toán không tiền mặt, tất
                                cả đang được số hóa để mang lại sự tiện lợi tối
                                đa cho khách hàng.
                            </p>

                            <h2>2. Phân khúc nào đáng chú ý?</h2>
                            <p>
                                Trong năm 2025, một số phân khúc bất động sản
                                đang nổi lên như những điểm sáng của thị trường:
                            </p>

                            <ul>
                                <li>
                                    <strong>Căn hộ cao cấp:</strong> Vẫn duy trì
                                    sức hút mạnh mẽ với tầng lớp trung và thượng
                                    lưu
                                </li>
                                <li>
                                    <strong>Nhà phố thương mại:</strong> Được ưa
                                    chuộng nhờ khả năng sinh lời cao
                                </li>
                                <li>
                                    <strong>Bất động sản nghỉ dưỡng:</strong>{' '}
                                    Phục hồi mạnh mẽ sau đại dịch
                                </li>
                                <li>
                                    <strong>
                                        Đất nền khu vực ngoại thành:
                                    </strong>{' '}
                                    Tiềm năng tăng giá trong trung và dài hạn
                                </li>
                            </ul>

                            <h2>3. Lời khuyên cho nhà đầu tư</h2>
                            <p>
                                Với những biến động của thị trường, các nhà đầu
                                tư cần có chiến lược rõ ràng và thận trọng. Việc
                                nghiên cứu kỹ lưỡng thị trường, đánh giá đúng
                                tiềm năng và rủi ro là vô cùng quan trọng.
                            </p>

                            <p>
                                Đặc biệt, nhà đầu tư nên chú ý đến các dự án có
                                pháp lý rõ ràng, chủ đầu tư uy tín và vị trí có
                                tiềm năng phát triển. Đồng thời, cần chuẩn bị
                                tài chính vững chắc và có kế hoạch đầu tư dài
                                hạn.
                            </p>

                            <h2>4. Kết luận</h2>
                            <p>
                                Thị trường bất động sản 2025 đang mở ra nhiều cơ
                                hội hấp dẫn cho cả nhà đầu tư và người mua để ở.
                                Tuy nhiên, để thành công trong lĩnh vực này, cần
                                có sự chuẩn bị kỹ lưỡng, kiến thức chuyên sâu và
                                khả năng nắm bắt thời cơ.
                            </p>
                        </div>

                        <div className="blog-actions">
                            <button
                                className={`action-btn ${isLiked ? 'liked' : ''}`}
                                onClick={handleLike}
                            >
                                <ThumbsUp size={20} />
                                {likes}
                            </button>
                            <button className="action-btn">
                                <MessageCircle size={20} />
                                24 Bình luận
                            </button>
                            <button
                                className={`action-btn ${isBookmarked ? 'bookmarked' : ''}`}
                                onClick={() => setIsBookmarked(!isBookmarked)}
                            >
                                <Bookmark size={20} />
                                Lưu bài
                            </button>
                        </div>
                    </div>

                    <div className="sidebar">
                        <div className="sidebar-card">
                            <div className="author-card">
                                <div className="author-avatar">NA</div>
                                <div className="author-info">
                                    <h4>Nguyễn Văn A</h4>
                                    <p>Chuyên gia bất động sản</p>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-card">
                            <h3 className="sidebar-title">Chia sẻ bài viết</h3>
                            <div className="share-buttons">
                                <button className="share-btn facebook">
                                    <Facebook size={20} />
                                    Chia sẻ Facebook
                                </button>
                                <button className="share-btn twitter">
                                    <Twitter size={20} />
                                    Chia sẻ Twitter
                                </button>
                                <button className="share-btn link-btn">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                    Sao chép liên kết
                                </button>
                            </div>
                        </div>

                        <div className="sidebar-card">
                            <h3 className="sidebar-title">
                                Bài viết liên quan
                            </h3>
                            <div className="related-posts">
                                {relatedPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="related-post-item"
                                    >
                                        <div className="related-post-image">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                            />
                                        </div>
                                        <div className="related-post-info">
                                            <h4>{post.title}</h4>
                                            <span className="related-post-date">
                                                {post.date}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;

import { Link } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from './components/Headers/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx'
import './Blogs.css';

const Blog = () => {
    // Database của tất cả bài viết
    const allBlogPosts = {
        1: {
            id: 1,
            title: 'Trọn Bộ Lãi Suất Vay Mua Nhà Mới Nhất',
            author: 'Trần Văn Bình',
            date: '15/12/2025',
            readTime: '6 phút',
            intro: 'Tổng hợp đầy đủ các gói lãi suất vay mua nhà từ các ngân hàng lớn tại Việt Nam, giúp bạn có cái nhìn toàn diện để đưa ra quyết định tài chính đúng đắn.',
            sections: [
                {
                    title: 'Lãi Suất Vay Mua Nhà Hiện Nay',
                    content: [
                        'Theo khảo sát mới nhất từ các ngân hàng thương mại, lãi suất vay mua nhà hiện dao động từ 6,5% - 9,5%/năm tùy thuộc vào thời gian vay và gói sản phẩm. Các ngân hàng lớn như Vietcombank, VietinBank, BIDV đang có chính sách hỗ trợ lãi suất cho khách hàng vay mua nhà lần đầu.',
                        'Đặc biệt, trong quý IV/2025, nhiều ngân hàng đã tung ra các chương trình ưu đãi với lãi suất chỉ từ 6,5% - 7,5% cho 6-12 tháng đầu, sau đó áp dụng lãi suất thả nổi hoặc cố định theo thỏa thuận.',
                    ],
                },
                {
                    title: 'So Sánh Lãi Suất Giữa Các Ngân Hàng',
                    content: [
                        'Vietcombank hiện đang có mức lãi suất ưu đãi 6,9%/năm cho 6 tháng đầu, sau đó áp dụng lãi suất 9,2%/năm. VietinBank cung cấp gói vay với lãi suất 7,2%/năm trong 12 tháng đầu. Trong khi đó, BIDV có chương trình ưu đãi lãi suất 6,5%/năm cho 9 tháng đầu tiên.',
                        'Các ngân hàng tư nhân như Techcombank, MB Bank cũng có các gói vay hấp dẫn với lãi suất cạnh tranh, dao động từ 7% - 8,5%/năm cho giai đoạn ưu đãi.',
                    ],
                },
                {
                    title: 'Lời Khuyên Khi Vay Mua Nhà',
                    content: [
                        'Trước khi quyết định vay, bạn nên so sánh kỹ lãi suất, thời gian ưu đãi, và các khoản phí phát sinh từ nhiều ngân hàng. Ngoài ra, cần đảm bảo thu nhập ổn định và khả năng trả nợ hàng tháng không vượt quá 30-40% tổng thu nhập.',
                        'Một số ngân hàng còn yêu cầu khách hàng phải có tài khoản giao dịch trong thời gian nhất định hoặc có mối quan hệ tín dụng tốt để được hưởng lãi suất ưu đãi.',
                    ],
                },
            ],
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop',
            tags: ['Vay mua nhà', 'Lãi suất', 'Ngân hàng'],
        },
        2: {
            id: 2,
            title: 'Nhà Ở Xã Hội Tiếp Tục Tăng Giá Mạnh',
            author: 'Nguyễn Nam',
            date: '05/11/2025',
            readTime: '5 phút',
            intro: 'Đã tăng giá không ngừng nghỉ của căn hộ thương mại trong suốt những năm gần đây cũng kéo theo đà tăng giá liên tiếp của nhà ở xã hội trong cùng biến động thời gian. Đến thời điểm hiện tại, nhà ở xã hội đã thiết lập một mặt bằng giá hoàn toàn mới trên thị trường.',
            sections: [
                {
                    title: 'Nhà Ở Xã Hội Trong Cuộc Đua Tăng Giá',
                    content: [
                        'Đầu năm 2024, khảo sát của Batdongsan.com.vn ghi nhận, nhà ở xã hội Rice City ở Long Biên (cũ) nay thuộc phường Bồ Đề có giá chào bán 2,3-2,4 tỷ đồng/căn, tăng trung bình 200 triệu đồng/căn so với tháng 11/2023. Và sau 2 năm, đến thời điểm hiện tại, giá bán các căn hộ đã tăng gấp đôi, đều từ 4 tỷ đồng/căn trở lên.',
                        'Cũng biến động thời gian, tại dự án nhà ở xã hội Hope Residence (phường Việt Hưng), giá bán cũng tăng gấp đôi, từ 2,1-2,3 tỷ đồng/căn của thời điểm đầu năm 2004 lên 3,8-4,3 tỷ đồng/căn. Tương tự, dự án nhà ở xã hội Thạch Bàn (phường Long Biên), giá cũng tăng gấp đôi, từ mức phổ biến 2,1-2,2 tỷ đồng/căn vào tháng 1/2024 lên 3,9-4,2 tỷ đồng/căn ở thời điểm hiện tại.',
                    ],
                },
                {
                    title: 'Nguyên Nhân Của Sự Tăng Giá',
                    content: [
                        'Theo các chuyên gia bất động sản, nguyên nhân chính của việc tăng giá là do nguồn cung hạn chế trong khi nhu cầu về nhà ở với mức giá phải chăng ngày càng tăng cao. Bên cạnh đó, chi phí xây dựng và giá vật liệu cũng tăng đáng kể trong thời gian qua.',
                        'Một yếu tố quan trọng khác là chính sách của Nhà nước về phát triển nhà ở xã hội. Trong năm 2024-2025, các dự án nhà ở xã hội mới được triển khai còn hạn chế, trong khi đó số lượng người có nhu cầu mua nhà với mức giá phải chăng ngày càng tăng, đặc biệt là tại các thành phố lớn như Hà Nội và TP.HCM.',
                    ],
                },
                {
                    title: 'Dự Báo Thị Trường Trong Thời Gian Tới',
                    content: [
                        'Dự báo trong thời gian tới, giá nhà ở xã hội vẫn sẽ tiếp tục có xu hướng tăng nhẹ, tuy nhiên tốc độ tăng sẽ chậm hơn so với giai đoạn 2023-2024. Điều này là do Chính phủ đang có nhiều chính sách hỗ trợ để tăng cung nhà ở xã hội, đồng thời kiểm soát chặt chẽ hơn về giá bán.',
                        'Các chuyên gia khuyến cáo người mua nên cân nhắc kỹ lưỡng về khả năng tài chính và nhu cầu thực tế trước khi quyết định mua nhà. Đồng thời, nên tìm hiểu kỹ về pháp lý của dự án, tiến độ xây dựng, và uy tín của chủ đầu tư để tránh rủi ro không đáng có.',
                    ],
                },
            ],
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=600&fit=crop',
            tags: ['Nhà ở xã hội', 'Thị trường BĐS', 'Đầu tư'],
        },
        3: {
            id: 3,
            title: 'A&T Group Chính Thức Khởi Công Chính Trang Tuyến Đường Ven Sông Sài Gòn',
            author: 'Lê Thị Oanh',
            date: '20/11/2025',
            readTime: '7 phút',
            intro: 'Dự án quy mô lớn của A&T Group hứa hẹn tạo nên một diện mạo mới cho khu vực ven sông Sài Gòn, mang đến không gian sống hiện đại và tiện nghi cho cư dân thành phố.',
            sections: [
                {
                    title: 'Tổng Quan Dự Án',
                    content: [
                        'A&T Group vừa chính thức khởi công dự án tuyến đường ven sông Sài Gòn với tổng vốn đầu tư lên đến 5.000 tỷ đồng. Dự án có chiều dài 8,5km, đi qua 3 quận nội thành, hứa hẹn giảm tải áp lực giao thông và tạo ra một không gian công cộng xanh - sạch - đẹp.',
                        'Theo kế hoạch, dự án sẽ hoàn thành vào năm 2027 với 6 làn xe, vỉa hè rộng rãi, khu vực công viên ven sông và các tiện ích thể thao ngoài trời. Đây được xem là một trong những dự án cơ sở hạ tầng quan trọng nhất của TP.HCM trong giai đoạn 2025-2030.',
                    ],
                },
                {
                    title: 'Tác Động Đến Thị Trường BĐS',
                    content: [
                        'Các chuyên gia dự báo, việc khởi công tuyến đường ven sông sẽ làm tăng giá trị bất động sản trong khu vực lên 20-30% trong vòng 2-3 năm tới. Các dự án căn hộ, nhà phố và biệt thự ven sông sẽ được hưởng lợi lớn từ cơ sở hạ tầng mới này.',
                        'Nhiều nhà đầu tư đã bắt đầu tìm kiếm cơ hội đầu tư tại các khu vực lân cận dự án, đặc biệt là các khu đất còn trống hoặc các dự án đang trong giai đoạn triển khai gần tuyến đường này.',
                    ],
                },
                {
                    title: 'Kỳ Vọng Từ Cư Dân',
                    content: [
                        'Cư dân sống trong khu vực bày tỏ sự phấn khởi về dự án này. Họ kỳ vọng tuyến đường mới sẽ giải quyết tình trạng kẹt xe kéo dài nhiều năm qua, đồng thời tạo ra không gian sống xanh và thoáng đãng hơn.',
                        'Ngoài ra, dự án còn được kỳ vọng sẽ thúc đẩy phát triển kinh tế khu vực, thu hút thêm nhiều doanh nghiệp và tạo ra hàng nghìn việc làm mới cho người dân địa phương.',
                    ],
                },
            ],
            image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=600&fit=crop',
            tags: ['Cơ sở hạ tầng', 'A&T Group', 'Đầu tư'],
        },
        4: {
            id: 4,
            title: 'Giá Chung Cư Đi Ngang, Lãi Suất Tăng: Nhà Đầu Tư Lướt Sóng Đứng Ngồi Không Yên',
            author: 'Phạm Văn Thái',
            date: '18/11/2025',
            readTime: '8 phút',
            intro: 'Thị trường bất động sản đang trải qua giai đoạn khó khăn khi giá chung cư không tăng trong khi lãi suất vay ngân hàng liên tục tăng, khiến nhiều nhà đầu tư lướt sóng gặp khó khăn.',
            sections: [
                {
                    title: 'Thị Trường Chững Lại',
                    content: [
                        'Theo số liệu từ các sàn giao dịch bất động sản, giá chung cư tại Hà Nội và TP.HCM đã đi ngang trong suốt 6 tháng qua. Điều này trái ngược hoàn toàn với xu hướng tăng mạnh trong giai đoạn 2021-2023, khiến nhiều nhà đầu tư bất ngờ.',
                        'Nguyên nhân được cho là do nguồn cung tăng mạnh từ các dự án mới, trong khi sức mua của thị trường giảm do chi phí đi vay tăng cao. Nhiều người mua nhà thực sự đang phải cân nhắc kỹ hơn trước khi quyết định mua.',
                    ],
                },
                {
                    title: 'Áp Lực Từ Lãi Suất',
                    content: [
                        'Lãi suất cho vay mua nhà đã tăng từ mức 6-7%/năm lên 9-10%/năm trong năm qua. Điều này khiến chi phí sở hữu nhà tăng đáng kể, ảnh hưởng trực tiếp đến khả năng chi trả của người mua.',
                        'Đối với nhà đầu tư lướt sóng, tình hình càng khó khăn hơn khi họ phải gánh chịu cả lãi suất cao và rủi ro giá không tăng. Nhiều người đã phải bán cắt lỗ hoặc chấp nhận giữ bất động sản lâu dài hơn dự kiến.',
                    ],
                },
                {
                    title: 'Lời Khuyên Cho Nhà Đầu Tư',
                    content: [
                        'Các chuyên gia khuyến nghị nhà đầu tư nên thận trọng hơn trong giai đoạn này. Thay vì lướt sóng ngắn hạn, nên tập trung vào đầu tư dài hạn với các dự án có tiềm năng tăng giá ổn định.',
                        'Đồng thời, cần đánh giá kỹ khả năng tài chính và chỉ nên vay vốn ở mức hợp lý để tránh áp lực trả nợ khi lãi suất tiếp tục biến động. Thị trường hiện tại đòi hỏi sự kiên nhẫn và chiến lược dài hạn hơn là mong muốn lợi nhuận nhanh.',
                    ],
                },
            ],
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop',
            tags: ['Thị trường', 'Lãi suất', 'Đầu tư'],
        },
        5: {
            id: 5,
            title: 'Phía Đông Hà Nội Rầm Rộ Đón Nguồn Cung Mới Thời Điểm Cuối Năm',
            author: 'Hoàng Văn Linh',
            date: '10/11/2025',
            readTime: '6 phút',
            intro: 'Khu vực phía Đông Hà Nội đang chứng kiến làn sóng nguồn cung mới từ nhiều dự án lớn, hứa hẹn mang đến nhiều lựa chọn cho người mua nhà vào dịp cuối năm.',
            sections: [
                {
                    title: 'Nguồn Cung Tăng Mạnh',
                    content: [
                        'Theo thống kê, trong quý IV/2025, khu vực phía Đông Hà Nội đón nhận hơn 15.000 căn hộ mới từ các dự án lớn như Vinhomes Ocean Park 3, The Manor Central Park, và Ecopark Sky Oasis. Đây là mức nguồn cung cao nhất trong 2 năm trở lại đây.',
                        'Các chủ đầu tư đang tận dụng thời điểm cuối năm - thời điểm truyền thống có nhu cầu mua nhà cao - để tung ra thị trường các sản phẩm mới với nhiều chính sách ưu đãi hấp dẫn.',
                    ],
                },
                {
                    title: 'Giá Bán Và Chính Sách',
                    content: [
                        'Giá bán các dự án mới dao động từ 30-50 triệu đồng/m2, phù hợp với phân khúc trung cấp đến cao cấp. Nhiều dự án còn có chính sách hỗ trợ lãi suất 0% trong 24-36 tháng, hoặc chiết khấu lên đến 10% cho khách hàng thanh toán nhanh.',
                        'Đặc biệt, một số chủ đầu tư còn cam kết cho thuê lại căn hộ với mức lợi nhuận 8-10%/năm trong 2 năm đầu, tạo điều kiện cho nhà đầu tư có nguồn thu ổn định ngay từ đầu.',
                    ],
                },
                {
                    title: 'Tiềm Năng Phát Triển',
                    content: [
                        'Khu vực phía Đông Hà Nội đang được hưởng lợi từ nhiều dự án hạ tầng lớn như tuyến Metro số 7, đường vành đai 4, và hàng loạt trường học, bệnh viện quốc tế. Điều này khiến khu vực này trở thành điểm đến hấp dẫn cho cả người mua ở thực và nhà đầu tư.',
                        'Các chuyên gia dự báo, giá bất động sản tại đây sẽ tiếp tục tăng 15-20% trong 3-5 năm tới khi các hạ tầng hoàn thiện và khu vực phát triển đồng bộ hơn.',
                    ],
                },
            ],
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
            tags: ['Hà Nội', 'Nguồn cung', 'Dự án mới'],
        },
    };

    // State để lưu ID bài viết hiện tại
    const [currentPostId, setCurrentPostId] = useState(1);

    // Lấy thông tin bài viết hiện tại
    const currentPost = allBlogPosts[currentPostId];

    // Danh sách bài viết sidebar
    const relatedPosts = [
        {
            id: 1,
            title: 'Trọn Bộ Lãi Suất Vay Mua Nhà Mới Nhất',
            date: 'Tháng 12/2025',
        },
        {
            id: 2,
            title: 'Nhà Ở Xã Hội Tiếp Tục Tăng Giá Mạnh',
            date: 'Tháng 11/2025',
        },
        {
            id: 3,
            title: 'A&T Group Chính Thức Khởi Công Chính Trang Tuyến Đường Ven Sông Sài Gòn',
            date: 'Tháng 11/2025',
        },
        {
            id: 4,
            title: 'Giá Chung Cư Đi Ngang, Lãi Suất Tăng: Nhà Đầu Tư Lướt Sóng Đứng Ngồi Không Yên',
            date: 'Tháng 11/2025',
        },
        {
            id: 5,
            title: 'Phía Đông Hà Nội Rầm Rộ Đón Nguồn Cung Mới Thời Điểm Cuối Năm',
            date: 'Tháng 11/2025',
        },
    ];

    // Hàm xử lý khi click vào bài viết
    const handlePostClick = (postId) => {
        setCurrentPostId(postId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="blog-detail-wrapper">
            <Navbar />

            <div className="blog-detail-container">
                {/* Main Content */}
                <div className="blog-detail-main">
                    {/* Header */}
                    <h1 className="blog-detail-title">{currentPost.title}</h1>

                    {/* Author Info */}
                    <div className="blog-detail-meta">
                        <div className="author-info">
                            <img
                                src={`https://ui-avatars.com/api/?name=${currentPost.author}&background=2563eb&color=fff`}
                                alt="Author"
                                className="author-avatar"
                            />
                            <div className="author-details">
                                <p className="author-name">
                                    Được đăng bởi{' '}
                                    <strong>{currentPost.author}</strong>
                                </p>
                                <p className="post-date">
                                    Cập nhật lần cuối vào {currentPost.date} •
                                    Đọc trong khoảng {currentPost.readTime}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Introduction */}
                    <div className="blog-intro">
                        <p>{currentPost.intro}</p>
                    </div>

                    {/* Sections */}
                    {currentPost.sections.map((section, index) => (
                        <div key={index} className="blog-section">
                            <h2>{section.title}</h2>
                            {section.content.map((paragraph, pIndex) => (
                                <p key={pIndex}>{paragraph}</p>
                            ))}

                            {/* Hiển thị hình ảnh sau section đầu tiên */}
                            {index === 0 && (
                                <div className="blog-featured-image">
                                    <img
                                        src={currentPost.image}
                                        alt={currentPost.title}
                                    />
                                    <p className="image-caption">
                                        Hình ảnh minh họa
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Tags */}
                    <div className="blog-tags">
                        <span className="tag-label">Khám phá thêm:</span>
                        {currentPost.tags.map((tag, index) => (
                            <Link href="#" key={index} className="blog-tag">
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="blog-sidebar">
                    <h3 className="sidebar-title">
                        Bài viết được xem nhiều nhất
                    </h3>
                    <div className="related-posts">
                        {relatedPosts.map((post, index) => (
                            <a
                                href="#"
                                key={post.id}
                                className={`related-post-item ${currentPostId === post.id ? 'active-post' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePostClick(post.id);
                                }}
                            >
                                <span className="post-number">{index + 1}</span>
                                <div className="post-info">
                                    <h4>{post.title}</h4>
                                    <p className="post-date-small">
                                        {post.date}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </aside>
            </div>

            <Footer/>
        </div>
    );
};

export default Blog;

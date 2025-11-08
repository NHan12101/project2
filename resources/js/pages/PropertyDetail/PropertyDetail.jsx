import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import location_related from '../../../../public/images/Rectangle.png';
import Chat from '../Chat.jsx';
import Footer from '../components/Footer/Footer.jsx';
import Navbar from '../components/Headers/Navbar/Navbar.jsx';
import Card from '../components/Main-content/cards/Card.jsx';
import classes from './PropertyDetail.module.css';

export default function PropertyDetail({ post, relatedPosts, auth }) {
    const currentUserId = auth?.user?.id;

    const handleStartChat = async () => {
        try {
            const res = await axios.post('/conversations/start', {
                receiver_id: post.user.id,
            });
            const conversationId = res.data.conversation_id;
            router.visit(`/chatbox?open=${conversationId}`);
        } catch (err) {
            console.error('Error starting conversation:', err);
            alert('Không thể bắt đầu cuộc trò chuyện.');
        }
    };
    return (
        <>
            <Head title={`StayHub | ${post.title}`} />
            <Navbar />
            <Chat />
            <div className="main-contain">
                <div className={classes['header__location--image']}>
                    <img src={location_related} alt="loaction_related" />
                </div>
                <h1 className={classes['title']}>{post.title}</h1>

                <div className={classes['images__detail']}>
                    <div className={classes['image__gallery--left']}>
                        <img src={`/${post.images[1].image_path}`} alt="" />
                    </div>
                    <div className={classes['image__gallery--right']}>
                        {post.images && post.images.length > 0 && (
                            <div className={classes['image-gallery']}>
                                {post.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={`/${img.image_path}`}
                                        alt={`property-image-${index}`}
                                    />
                                ))}
                                <img
                                    src={`/${post.images[1].image_path}`}
                                    alt=""
                                />
                            </div>
                        )}
                    </div>
                </div>

                <h2 className={classes['heading__title']}>
                    Đặc điểm nổi bật của dự án
                </h2>
                <ul className={classes['list__desc']}>
                    <li>
                        Hồ bơi, phòng tập thể dục, phòng cộng đồng, sân chơi,
                        nhà hàng, quán cà phê, phòng chờ, phòng đọc sách và
                        vườn.
                    </li>
                    <li>
                        150 căn hộ chung cư cao cấp do Tập đoàn Phenikaa phát
                        triển
                    </li>
                    <li>
                        Dịch vụ cao cấp: An ninh tòa nhà 24/7, dịch vụ đỗ xe,
                        giặt là, spa và lễ tân.
                    </li>
                    <li>
                        Khách sạn và căn hộ dịch vụ được quản lý bởi Marriott.
                    </li>
                </ul>

                <div className={classes['list__price--level']}>
                    <div className={classes['price-level']}>
                        <h3>Mức giá</h3>
                        <span>{post.price}</span>
                    </div>
                    <div className={classes['price-level']}>
                        <h3>Diện tích</h3>
                        <span>{post.area} m²</span>
                    </div>
                    <div className={classes['price-level']}>
                        <h3>Phòng ngủ</h3>
                        <span>{post.bedrooms}</span>
                    </div>
                </div>

                <div className={classes['real-estate-container']}>
                    <div className={classes['real-estate-info']}>
                        <h3>Thông tin mô tả</h3>
                        <h4>
                            Cơ hội vàng mua căn hộ Glory Heights Vinhomes Grand
                            Park giá tốt nhất.
                        </h4>

                        <p>
                            Nắm giữ hàng phát mãi, cắt lỗ, thanh lý giảm sâu giá
                            tốt hơn thị trường. Giỏ hàng chuẩn minh bạch cam kết
                            không làm mất thời gian khách hàng. Hỗ trợ pháp lý &
                            thủ tục nhanh gọn uy tín lâu năm.
                        </p>

                        <h4>(*) Lý do nên chọn ngay:</h4>
                        <ul>
                            <li>
                                Vị trí trung tâm khu đô thị, đông dân cư, tiềm
                                năng khai thác mạnh.
                            </li>
                            <li>
                                Thanh khoản cao, dễ mua, dễ bán, sinh lời bền
                                vững.
                            </li>
                            <li>
                                Giá ưu đãi, thấp hơn mặt bằng thị trường hiện
                                tại.
                            </li>
                            <li>
                                Pháp lý minh bạch, thủ tục sang nhượng nhanh
                                gọn.
                            </li>
                        </ul>

                        <h4>(*) Phù hợp cho:</h4>
                        <ul>
                            <li>Nhà đầu tư muốn tối đa lợi nhuận.</li>
                            <li>Gia đình trẻ cần an cư lâu dài.</li>
                            <li>
                                Khách hàng tìm kênh đầu tư an toàn và sinh lời
                                bền vững.
                            </li>
                        </ul>

                        <p className={classes['contact']}>
                            Liên hệ ngay: <b>0908 770 ***</b> để nhận bảng giá
                            chi tiết và giữ chỗ sớm nhất. <br />
                            Inbox trực tiếp để được tư vấn nhanh chóng, tận
                            tình, hoàn toàn miễn phí.
                        </p>

                        <p className={classes['note']}>
                            Số lượng có hạn ai nhanh tay người đó thắng.
                        </p>
                    </div>

                    <div className={classes['real-estate-seller']}>
                        <div className={classes['real-estate-seller__avatar']}>
                            <img
                                src={post.user?.avatar_url || avatar}
                                alt="Người đăng bán"
                            />
                        </div>
                        <div>
                            <h4>{post.user?.name || 'Ẩn danh'}</h4>
                            <p>Người đăng bán</p>
                            <p className={classes['phone']}>
                                +84 {post.user?.phone || 'Không có'}
                            </p>
                            {currentUserId !== post.user?.id && (
                                <button
                                    onClick={handleStartChat}
                                    className={classes['contact-btn']}
                                >
                                    LIÊN HỆ NGAY ▶
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <h1 className="header_title card__heading--title">
                    Bất động sản dành cho bạn
                </h1>
            </div>
            <Card post={relatedPosts} />
            <Footer />
        </>
    );
}

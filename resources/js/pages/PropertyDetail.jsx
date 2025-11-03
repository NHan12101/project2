import { Head } from '@inertiajs/react';
import location_related from '../../../public/images/Rectangle.png';
import Chat from './Chat.jsx';
import Footer from './components/Footer/Footer.jsx';
import Navbar from './components/Headers/Navbar/Navbar.jsx';
import Card from './components/Main-content/cards/Card.jsx';
import classes from './PropertyDetail.module.css';

export default function PropertyDetail({ post, relatedPosts }) {
    console.log(post);
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

                <h2 className={classes['title']}>Đặc điểm nổi bật của dự án</h2>
                <ul className={''}>
                    <li>Hồ bơi, phòng tập thể dục, phòng cộng đồng, sân chơi, nhà hàng, quán cà phê, phòng chờ, phòng đọc sách và vườn.</li>
                    <li>150 căn hộ chung cư cao cấp do Tập đoàn Phenikaa phát triển</li>
                    <li>Dịch vụ cao cấp: An ninh tòa nhà 24/7, dịch vụ đỗ xe, giặt là, spa và lễ tân.</li>
                    <li>Khách sạn và căn hộ dịch vụ được quản lý bởi Marriott.</li>
                </ul>
            </div>
        
            <Card post={relatedPosts} />
            <Footer />
        </>
    );
}

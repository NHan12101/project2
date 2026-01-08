import blog1 from '../../../../../../public/images/blog1.png';
import blog2 from '../../../../../../public/images/blog2.png';
import blog3 from '../../../../../../public/images/blog3.png';
import blog4 from '../../../../../../public/images/blog4.png';
import Navbar from '../../Headers/Navbar/Navbar';
import './BlogList.css';
import { Link } from '@inertiajs/react';

const newsData = [
    {
        date: 'Wed, 27/01/2025',
        title: 'NHỮNG BIẾN ĐỘNG THỊ TRƯỜNG BẤT ĐỘNG SẢN ĐÀ NẴNG 2025',
        desc: 'Thị trường bất động sản Lâm Đồng đang trải qua những biến động đáng chú ý gần đây.',
        image: blog1,
    },
    {
        date: 'Wed, 23/04/2025',
        title: 'NHỮNG BIẾN ĐỘNG THỊ TRƯỜNG BẤT ĐỘNG SẢN ĐÀ NẴNG 2025',
        desc: 'Thị trường bắt động sản Đà Nẵng đang trải qua những biến động đáng chủ ý trong thời gian gần đây, với sự thay đổi về giá cả, loại hình',
        image: blog2,
    },
    {
        date: 'Wed, 23/04/2025',
        title: 'CÓ NÊN ĐẦU TƯ ĐẤT NỀN LÂM ĐỒNG TẠI THỜI ĐIỂM NÀY?',
        desc: 'Thị trường đất nền tại Lâm Đồng đang thu hút sự quan tâm của nhiều nhà đầu tư nhờ vào tiềm năng phát triển và mức giá hợp lý. Dưới',
        image: blog3,
    },
    {
        date: 'Wed, 23/04/2025',
        title: 'NHỮNG BIẾN ĐỘNG THỊ TRƯỜNG BẤT ĐỘNG SẢN ĐÀ NẴNG 2025',
        desc: 'Thị trường bắt động sản Đà Nẵng đang trải qua những biến động đáng chủ ý trong thời gian gần đây, với sự thay đổi về giá cả, loại hình.',
        image: blog4,
    },
];

const BlogList = () => {
    return (
        
        <div className="news-section">
                      
            <div className="main-contain">
                <h1 className='header_title'>Tin tức bất động sản</h1>
                <div className="news-grid">
                    <div className="news-main">
                        <img src={newsData[0].image} alt={newsData[0].title} />
                        <div className="news-main-content">
                            <p>{newsData[0].date}</p>
                            <h2>{newsData[0].title}</h2>
                            <p>{newsData[0].desc}</p>
                        </div>
                    </div>

                    <div className="news-list">
                        {newsData.slice(1).map((item, index) => (
                            <div className="news-item" key={index}>
                                <img src={item.image} alt={item.title} />
                                <div>
                                    <p className='news-item__date'>{item.date}</p>
                                    <h1>{item.title}</h1>
                                    <p className='news-item__desc'>{item.desc}</p>
                                    <Link href="/blogs">ĐỌC BÀI VIẾT →</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogList;

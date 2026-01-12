import { Link } from '@inertiajs/react';
import blog1 from '../../../../../../public/images/blog1.png';
import blog2 from '../../../../../../public/images/blog2.png';
import blog3 from '../../../../../../public/images/blog3.png';
import blog4 from '../../../../../../public/images/blog4.png';
import './BlogList.css';

const newsData = [
    {
        date: 'Thứ 4, 27/01/2025',
        title: 'Những biến động thị trường bất động sản Đà Nẵng 2025',
        desc: 'Thị trường bất động sản Lâm Đồng đang trải qua những biến động đáng chú ý gần đây.',
        image: blog1,
    },
    {
        date: 'Thứ 2, 12/01/2025',
        title: 'Những biến động thị trường bất động sản Đà Nẵng 2025',
        desc: 'Thị trường bắt động sản Đà Nẵng đang trải qua những biến động đáng chủ ý trong thời gian gần đây, với sự thay đổi về giá cả, loại hình',
        image: blog2,
    },
    {
        date: 'Thứ 2, 12/01/2025',
        title: 'Có nên đầu tư đất nền Lâm Đồng tại thời điểm này ?',
        desc: 'Thị trường đất nền tại Lâm Đồng đang thu hút sự quan tâm của nhiều nhà đầu tư nhờ vào tiềm năng phát triển và mức giá hợp lý.',
        image: blog3,
    },
    {
        date: 'Thứ 2, 12/01/2025',
        title: 'Những biến động thị trường bất động sản Đà Nẵng 2025',
        desc: 'Thị trường bắt động sản Đà Nẵng đang trải qua những biến động đáng chủ ý trong thời gian gần đây, với sự thay đổi về giá cả, loại hình.',
        image: blog4,
    },
    {
        date: 'Thứ 2, 12/01/2025',
        title: 'Những biến động thị trường bất động sản Đà Nẵng 2025',
        desc: 'Thị trường bắt động sản Đà Nẵng đang trải qua những biến động đáng chủ ý trong thời gian gần đây, với sự thay đổi về giá cả, loại hình.',
        image: blog2,
    },
];

const BlogList = () => {
    return (
        <div className="news-section">
            <div className="main-contain">
                <h1 className="header_title">Tin tức bất động sản</h1>

                <div className="news-list">
                    {newsData.map((item, index) => (
                        <Link href={'/blogs'} className="news-item" key={index}>
                            <img src={item.image} alt={item.title} />

                            <h1>{item.title}</h1>

                            <p className="news-item__date">{item.date}</p>

                            <p className="news-item__desc">{item.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogList;

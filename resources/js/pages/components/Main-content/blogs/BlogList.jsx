import { Link } from '@inertiajs/react';
import './BlogList.css';

const newsData = [
    {
        date: 'Thứ hai, 15/12/2025',
        title: 'Trọn Bộ Lãi Suất Vay Mua Nhà Mới Nhất',
        desc: 'Tổng hợp đầy đủ các gói lãi suất vay mua nhà từ các ngân hàng lớn tại Việt Nam, giúp bạn có cái nhìn toàn diện...',
        image:  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop',
    },
    {
        date: 'Thứ hai, 12/01/2026',
        title: 'Nhà Ở Xã Hội Tiếp Tục Tăng Giá Mạnh',
        desc: 'Đã tăng giá không ngừng nghỉ của căn hộ thương mại trong suốt những năm gần đây cũng kéo theo đà tăng giá ...',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=600&fit=crop',
    },
    {
        date: 'Thứ hai, 02/02/2026',
        title: 'A&T Group Khởi Công Tuyến Đường Ven Sông Sài Gòn',
        desc: 'Dự án quy mô lớn của A&T Group hứa hẹn tạo nên một diện mạo mới cho khu vực ven sông Sài Gòn, mang đến...',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=600&fit=crop',
    },
    {
        date: 'Thứ ba, 18/11/2025',
        title: 'Giá Chung Cư Đi Ngang, Nhà Đầu Tư Đứng Ngồi Không Yên',
        desc: 'Thị trường bất động sản đang trải qua giai đoạn khó khăn khi giá chung cư không tăng trong khi lãi suất...',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop',
    },
    {
        date: 'Thứ 2, 12/01/2025',
        title: 'Hà Nội Đón Nguồn Cung Mới Thời Điểm Cuối Năm',
        desc: 'Khu vực phía Đông Hà Nội đang chứng kiến làn sóng nguồn cung mới từ nhiều dự án lớn, hứa hẹn mang đến...',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
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

import './Card.css';
import home1 from '../../../../../../public/images/home1.png'
import home2 from '../../../../../../public/images/home2.png'
import home3 from '../../../../../../public/images/home3.png'
import home4 from '../../../../../../public/images/home4.png'
import home5 from '../../../../../../public/images/home5.png'
import home6 from '../../../../../../public/images/home6.png'

export default function Card() {
    const properties = [
        {
            id: 1,
            image: home1,
            title: 'CỰC HIẾM DUY NHẤT *01 SUẤT NGOẠI GIAO CĂN NHÀ 70m2 SA...',
            price: '18,7 tỷ',
            bedrooms: 4,
            area: 70,
            location: 'Buôn Ma Thuột, Đắk Lắk',
            postedAt: 'Đăng hôm nay',
            isVip: true,
        },
        {
            id: 2,
            image: home2,
            title: 'NHÀ MẶT PHỐ 2 MẶT TIỀN SỔ ĐỎ ĐƯỜNG LỚN NHẤT VIN2,BĐS.....',
            price: '6,5 tỷ',
            bedrooms: 3,
            area: 90,
            location: 'Văn Giang, Hưng Yên',
            postedAt: '1 ngày trước',
            isVip: false,
        },
        {
            id: 3,
            image: home3,
            title: 'QUÀ TẶNG LÊN ĐẾN  2 TỶ TRỪ VÀO GIÁ BÁN, TẶNG XE VF3.....',
            price: '3,8 tỷ',
            bedrooms: 2,
            area: 80,
            location: 'Đà lạt, Lâm Đồng',
            postedAt: '3 ngày trước',
            isVip: true,
        },
        {
            id: 4,
            image: home4,
            title: 'QUỶ CĂN CHIẾC KHẤU 18-25% SỔ ĐỎ LÂU DÀI -GIÁ TỐT...',
            price: '15 tỷ',
            bedrooms: 5,
            area: 200,
            location: 'Đà lạt, Lâm Đồng',
            postedAt: '5 ngày trước',
            isVip: true,
        },
        {
            id: 5,
            image: home5,
            title: 'QUỸ CĂN CHÍNH SACH THÁNG NGÂU: CHIẾT KHẤU THÊM 400....',
            price: '8,2 tỷ',
            bedrooms: 4,
            area: 120,
            location: 'Hạ Long, Quảng Ninh',
            postedAt: 'Hôm qua',
            isVip: false,
        },
        {
            id: 6,
            image: home6,
            title: 'PHƯƠNG ÁN MUA NHÀ DÀNH CHO KHÁCH ĐẦU TƯ GIÁ RẺ....',
            price: '20 tỷ',
            bedrooms: 6,
            area: 250,
            location: 'Thủ Đức, Tp.HCM',
            postedAt: '2 giờ trước',
            isVip: true,
        },
    ];

    return (
        <div className="main-content">
            <div className="property-grid">
                {properties.map((item) => (
                    <div key={item.id} className="property-card">
                        {item.isVip && <span className="vip-badge">VIP</span>}
                        <img
                            src={item.image}
                            alt={item.title}
                            className="property-img"
                        />
                        <div className="property-info">
                            <h3 className="property-title">{item.title}</h3>
                            <p className="property-meta">
                                Phòng ngủ: <b>{item.bedrooms}</b> &nbsp;|&nbsp;
                                Diện tích: <b>{item.area}m²</b>
                            </p>
                            <p className="property-price">{item.price}</p>
                            <p className="property-location">{item.location}</p>
                            <p className="property-posted">{item.postedAt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

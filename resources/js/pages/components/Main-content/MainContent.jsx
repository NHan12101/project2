import { Building2, Home, House, LayoutGrid } from 'lucide-react';
import momo from '../../../../../public/images/momo.svg';
import './MainContent.css';
import Card from './cards/Card';
import HomeListing from './home-listing/HomeListing';
import BlogList from './blogs/BlogList';

function MainContent() {
    const items = [
        { icon: <Home color="#e53935" size={70} />, name: 'Nhà phố' },
        { icon: <Building2 color="#e53935" size={70} />, name: 'Căn hộ' },
        { icon: <House color="#e53935" size={70} />, name: 'Villa' },
        { icon: <LayoutGrid color="#e53935" size={70} />, name: 'Mặt bằng' },
    ];

    return (
        <>
            <section className="category">
                <div className="main-contain">
                    <h2 className="category__title--head">Danh mục nổi bật</h2>
                    <div className="category-list">
                        {items.map((item, i) => (
                            <div key={i} className="category-item">
                                {item.icon}
                                <p className="category__title">{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Card />

            <section className="partner">
                <div className="main-contain">
                    <div className="partner__content">
                        <div className="partner__content--left">
                            <h2 className="partner___content--title">
                                ĐỐI TÁC & KHÁCH HÀNG BẤT ĐỘNG SẢN
                            </h2>
                            <p className="partner__content--desc">
                                Hàng trăm khách hàng cùng nhiều đối tác chiến
                                lược đã lựa chọn và tin tưởng chúng tôi trong
                                hành trình tìm kiếm ngôi nhà mơ ước.
                            </p>
                            <img
                                src={momo}
                                alt="Momo"
                                className="partner__content--icon"
                            />
                        </div>

                        <div className="partner__content--right">
                            <div>
                                <div className="partner-span">
                                    <span className="partner__content--span">
                                        100+
                                    </span>
                                </div>
                                <p>Tin đăng mới mỗi tháng</p>
                            </div>

                            <div>
                                <div className="partner-span">
                                    <span className="partner__content--span">
                                        50+
                                    </span>
                                </div>
                                <p>Đối tác dự kiến hợp tác trong năm tới</p>
                            </div>

                            <div>
                                <div className="partner-span">
                                    <span className="partner__content--span">
                                        200+
                                    </span>
                                </div>
                                <p>
                                    Khách hàng sẽ được phục vụ trong giai đoạn
                                    đầu
                                </p>
                            </div>

                            <div>
                                <div className="partner-span">
                                    <span className="partner__content--span">
                                        95%
                                    </span>
                                </div>
                                <p>Khách hàng hài lòng</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <HomeListing/>

            <BlogList/>
        </>
    );
}

export default MainContent;

import momo from '../../../../../public/images/Momo.svg';
import BlogList from './blogs/BlogList.jsx';
import CardList from './cards/CardList.jsx';
import HotNews from './HotNews.jsx';
import LocationList from './LocationLists/LocationList.jsx';
import './MainContent.css';

export default function MainContent() {
    return (
        <>
            <HotNews />

            <div className="main-contain">
                <h1 className="header_title card__heading--title">
                    Bất động sản dành cho bạn
                </h1>
            </div>

            <div className="main-contain">
                <CardList limit={8} showMore={true} />
            </div>

            <section className="partner">
                <div className="main-contain">
                    <div className="partner__content">
                        <div className="partner__content--left">
                            <h1 className="header_title partner___content--title">
                                ĐỐI TÁC & KHÁCH HÀNG BẤT ĐỘNG SẢN
                            </h1>
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
                            <div className="partner-span">
                                <span className="partner__content--span">
                                    100+
                                </span>
                                <p>Tin đăng mới mỗi tháng</p>
                            </div>

                            <div className="partner-span">
                                <span className="partner__content--span">
                                    <strong>50+</strong>
                                </span>
                                <p>Đối tác dự kiến hợp tác trong năm tới</p>
                            </div>

                            <div className="partner-span">
                                <span className="partner__content--span">
                                    <strong>200+</strong>
                                </span>
                                <p>
                                    Khách hàng sẽ được phục vụ trong giai đoạn
                                    đầu
                                </p>
                            </div>

                            <div className="partner-span">
                                <span className="partner__content--span">
                                    <strong>95%</strong>
                                </span>
                                <p>Khách hàng hài lòng</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <LocationList />

            <BlogList />
        </>
    );
}

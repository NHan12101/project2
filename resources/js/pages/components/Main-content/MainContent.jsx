    import { usePage } from '@inertiajs/react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import momo from '../../../../../public/images/Momo.svg';
import BlogList from './blogs/BlogList.jsx';
import CardList from './cards/CardList.jsx';
import HotNews from './HotNews.jsx';
import LocationList from './LocationLists/LocationList.jsx';
import './MainContent.css';

export default function MainContent() {
    const { props } = usePage();

    const statsConfig = [
        { key: 'views', label: 'Lượt xem tin đăng' },
        { key: 'customers', label: 'Khách hàng đã đăng ký' },
        { key: 'posts_per_month', label: 'Tin đăng mới mỗi tháng' },
        { key: 'success_transactions', label: 'Giao dịch thành công' },
    ];

    const { ref, inView } = useInView({ triggerOnce: true });

    const formatStat = (value) => {
        if (value <= 10) return value;

        return Math.floor(value / 10) * 10;
    };

    const formatDisplay = (value) => {
        if (value === 0) return 0;
        if (value < 10) return `0${value}`;

        return value.toString();
    };

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

                        <div ref={ref} className="partner__content--right">
                            {statsConfig.map((item) => {
                                const rawValue = props[item.key] ?? 0;
                                const countValue = formatStat(rawValue);
                                const showPlus = rawValue > countValue;

                                return (
                                    <div
                                        key={item.key}
                                        className="partner-span"
                                    >
                                        <span className="partner__content--span">
                                            <strong>
                                                {inView && (
                                                    <>
                                                        <CountUp
                                                            start={0}
                                                            end={countValue}
                                                            duration={2}
                                                            formattingFn={
                                                                formatDisplay
                                                            }
                                                        />
                                                        {showPlus && '+'}
                                                    </>
                                                )}
                                            </strong>
                                        </span>
                                        <p>{item.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <LocationList />

            <BlogList />
        </>
    );
}

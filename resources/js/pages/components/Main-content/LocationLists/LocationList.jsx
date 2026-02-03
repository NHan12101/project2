import { router, usePage } from '@inertiajs/react';
import dalat from '../../../../../../public/images/dalat.png';
import danang from '../../../../../../public/images/danang.png';
import { default as hanoi1 } from '../../../../../../public/images/hanoi.png';
import hcm from '../../../../../../public/images/hcm.png';
import hcm1 from '../../../../../../public/images/hcm1.png';
import './LocationList.css';

const cities = [
    {
        name: 'TP.Hồ Chí Minh',
        type: 2,
        image: hcm1,
    },
    {
        name: 'Hà Nội',
        type: 1,
        image: hcm,
    },
    {
        name: 'Lâm Đồng',
        type: 27,
        image: dalat,
    },
    {
        name: 'Đà Nẵng',
        type: 5,
        image: danang,
    },
    {
        name: 'Hải Phòng',
        type: 3,
        image: hcm1,
    },
    {
        name: 'Đồng Nai',
        type: 29,
        image: hanoi1,
    },
];

export default function LocationList() {
    const { cityPostCounts } = usePage().props;

    return (
        <div className="city-section">
            <div className="main-contain">
                <div className="city-section__home">
                    <h1 className="header_title city-section__title">
                        Bất động sản theo địa điểm
                    </h1>
                    <div className="city-grid">
                        {cities.map((city, index) => (
                            <div
                                className={`city-grid__item city-grid__item${index + 1}`}
                                key={index}
                                onClick={() =>
                                    router.get('/home-finder', {
                                        city_id: `${city.type}`,
                                    })
                                }
                            >
                                <img src={city.image} alt={city.name} />
                                <div className="city-info">
                                    <h1 className="city-info__title">
                                        {city.name}
                                    </h1>
                                    <p className="city-info__desc">
                                        {(
                                            cityPostCounts?.[city.type] ?? 0
                                        ).toLocaleString('vi-VN')}{' '}
                                        tin đăng
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

import dalat from '../../../../../../public/images/dalat.png';
import danang from '../../../../../../public/images/danang.png';
import { default as hanoi1 } from '../../../../../../public/images/hanoi.png';
import hcm from '../../../../../../public/images/hcm.png';
import hcm1 from '../../../../../../public/images/hcm1.png';
import './LocationList.css';

const cities = [
    {
        name: 'TP.Hồ Chí Minh',
        image: hcm1,
    },
    {
        name: 'Hà Nội',
        image: hcm,
    },
    {
        name: 'Đà Lạt',
        image: dalat,
    },
    {
        name: 'Đà Nẵng',
        image: danang,
    },
    {
        name: 'Hải Phòng',
        image: hcm1,
    },
    {
        name: 'Đồng Nai',
        image: hanoi1,
    },
];

export default function LocationList() {
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
                            >
                                <img src={city.image} alt={city.name} />
                                <div className="city-info">
                                    <h1 className="city-info__title">
                                        {city.name}
                                    </h1>
                                    <p className="city-info__desc">
                                        80.000 tin đăng
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

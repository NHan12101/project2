import dalat from '../../../../../../public/images/dalat.png';
import danang from '../../../../../../public/images/danang.png';
import {
    default as hanoi,
    default as hanoi1,
} from '../../../../../../public/images/hanoi.png';
import hcm from '../../../../../../public/images/hcm.png';
import hcm1 from '../../../../../../public/images/hcm1.png';
import './HomeListing.css';

const cities = [
    {
        name: 'Hà Nội',
        image: hanoi,
    },
    {
        name: 'Tp.HCM',
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
        name: 'Tp. khác',
        image: hanoi1,
    },
];

export default function HomeListing() {
    return (
        <div className="city-section">
            <div className="main-contain">
                <h2>Ngôi nhà bất động sản của Việt Nam</h2>
                <div className="city-grid">
                    {cities.map((city, index) => (
                        <div className="city-card" key={index}>
                            <img src={city.image} alt={city.name} />
                            <h3 className="city-info">{city.name}</h3>
                            <p className="city-info-more">XEM THÊM DỰ ÁN    ▶</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

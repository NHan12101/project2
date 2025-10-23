import { Building2, Home, House, LayoutGrid } from 'lucide-react';
import './MainContent.css';
import Card from './cards/Card';

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
                <div className="main-content">
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
        </>
    );
}

export default MainContent;

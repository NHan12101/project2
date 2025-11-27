import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Footer from '../components/Footer/Footer.jsx';
import Navbar from '../components/Headers/Navbar/Navbar.jsx';
import Card from '../components/Main-content/cards/Card.jsx';
import './List.css';

export default function List({list, cities, categories, filters: initialFilters}) {
    console.log(cities);

    // State lưu bộ lọc và danh sách hiển thị
    const [filters, setFilters] = useState(initialFilters || {});
    // console.log(list);   
    const [posts, setPosts] = useState(list || []);
    // console.log(posts);

    // Khi người dùng thay đổi filter hoặc sort
    
    function handleFilterChange(e)  {
        const { name, value, type } = e.target;

        // Chuyển input number sang number hoặc null nếu rỗng
        const val =
            type === 'number' ? (value === '' ? null : Number(value)) : value;
        const newFilters = { ...filters, [name]: val };
        setFilters(newFilters);

        // Gọi backend để lọc dữ liệu
        router.get('/list', newFilters, {
            preserveState: true,
            onSuccess: (page) => {
                setPosts(page.props.list || []);
            },
        });
    };

    return (
        <>
            <Navbar />
            <div className="list-page">
                {/* Bộ lọc */}
                <div className="filter-panel">
                    <select
                        name="city_id"
                        value={
                            filters.city_id != null
                                ? String(filters.city_id)
                                : ''
                        }
                        onChange={handleFilterChange}
                    >
                        <option value="">-- Chọn thành phố --</option>
                        {cities.map((city) => (
                            <option key={city.id} value={String(city.id)}>
                                {city.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Giá min"
                        value={filters.minPrice != null ? filters.minPrice : ''}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Giá max"
                        value={filters.maxPrice != null ? filters.maxPrice : ''}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="number"
                        name="minArea"
                        placeholder="Diện tích min"
                        value={filters.minArea != null ? filters.minArea : ''}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="number"
                        name="maxArea"
                        placeholder="Diện tích max"
                        value={filters.maxArea != null ? filters.maxArea : ''}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="number"
                        name="bedrooms"
                        placeholder="Số phòng ngủ"
                        value={filters.bedrooms != null ? filters.bedrooms : ''}
                        onChange={handleFilterChange}
                    />
                </div>

                {/* Danh sách Card */}
                <Card post={posts} limit={18} />
            </div>
            <Footer />
        </>
    );
}

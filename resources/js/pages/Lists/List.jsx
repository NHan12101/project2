import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import Footer from '../components/Footer/Footer.jsx';
import Navbar from '../components/Headers/Navbar/Navbar.jsx';
import Card from '../components/Main-content/cards/Card.jsx';
import './List.css';

export default function List({
    list,
    cities,
    categories,
    filters: initialFilters,
}) {
    const [filters, setFilters] = useState(initialFilters || {});
    const [posts, setPosts] = useState(list || []);
    const [showFilters, setShowFilters] = useState(false);

    const debounceRef = useRef(null);

    // Khi người dùng thay đổi filter hoặc sort
    
    function handleFilterChange(e)  {
        const { name, value, type } = e.target;
        const val =
            type === 'number' ? (value === '' ? null : Number(value)) : value;
        const newFilters = { ...filters, [name]: val };
        setFilters(newFilters);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            router.get('/list', newFilters, {
                preserveState: true,
                onSuccess: (page) => {
                    setPosts(page.props.list || []);
                },
            });
        }, 300);
    };

    const handleResetFilters = () => {
        setFilters({});
        router.get('/list', {}, {
            preserveState: true,
            onSuccess: (page) => {
                setPosts(page.props.list || []);
            },
        });
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== null && v !== '').length;

    return (
        <>
            <Navbar />
            <div className="list-page">
                <div className="list-container">
                    {/* Header Section */}
                    <div className="list-header">
                        <div className="list-header-content">
                            <h1 className="list-title">Danh sách bất động sản</h1>
                            <p className="list-subtitle">
                                Tìm thấy <span className="highlight">{posts.length}</span> kết quả
                            </p>
                        </div>
                        <button 
                            className="filter-toggle-btn"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M2.5 5.83333H17.5M5 10H15M7.5 14.1667H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Bộ lọc
                            {activeFilterCount > 0 && (
                                <span className="filter-badge">{activeFilterCount}</span>
                            )}
                        </button>
                    </div>

                    {/* Filter Panel */}
                    <div className={`filter-panel ${showFilters ? 'show' : ''}`}>
                        <div className="filter-header">
                            <h3>Lọc kết quả</h3>
                            <button 
                                className="reset-btn"
                                onClick={handleResetFilters}
                            >
                                Đặt lại
                            </button>
                        </div>

                        <div className="filter-grid">
                            {/* Location Filter */}
                            <div className="filter-group">
                                <label>Khu vực</label>
                                <select
                                    name="city_id"
                                    value={filters.city_id != null ? String(filters.city_id) : ''}
                                    onChange={handleFilterChange}
                                    className="filter-input"
                                >
                                    <option value="">Tất cả thành phố</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={String(city.id)}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div className="filter-group">
                                <label>Loại hình</label>
                                <select
                                    name="category_id"
                                    value={filters.category_id != null ? String(filters.category_id) : ''}
                                    onChange={handleFilterChange}
                                    className="filter-input"
                                >
                                    <option value="">Tất cả loại hình</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="filter-group">
                                <label>Khoảng giá (VNĐ)</label>
                                <div className="range-inputs">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        placeholder="Từ"
                                        value={filters.minPrice != null ? filters.minPrice : ''}
                                        onChange={handleFilterChange}
                                        className="filter-input"
                                    />
                                    <span className="range-separator">-</span>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        placeholder="Đến"
                                        value={filters.maxPrice != null ? filters.maxPrice : ''}
                                        onChange={handleFilterChange}
                                        className="filter-input"
                                    />
                                </div>
                            </div>

                            {/* Area Range */}
                            <div className="filter-group">
                                <label>Diện tích (m²)</label>
                                <div className="range-inputs">
                                    <input
                                        type="number"
                                        name="minArea"
                                        placeholder="Từ"
                                        value={filters.minArea != null ? filters.minArea : ''}
                                        onChange={handleFilterChange}
                                        className="filter-input"
                                    />
                                    <span className="range-separator">-</span>
                                    <input
                                        type="number"
                                        name="maxArea"
                                        placeholder="Đến"
                                        value={filters.maxArea != null ? filters.maxArea : ''}
                                        onChange={handleFilterChange}
                                        className="filter-input"
                                    />
                                </div>
                            </div>

                            {/* Bedrooms */}
                            <div className="filter-group">
                                <label>Số phòng ngủ</label>
                                <input
                                    type="number"
                                    name="bedrooms"
                                    placeholder="Nhập số phòng"
                                    value={filters.bedrooms != null ? filters.bedrooms : ''}
                                    onChange={handleFilterChange}
                                    className="filter-input"
                                    min="0"
                                />
                            </div>

                            {/* Sort */}
                            <div className="filter-group">
                                <label>Sắp xếp</label>
                                <select
                                    name="sort"
                                    value={filters.sort || ''}
                                    onChange={handleFilterChange}
                                    className="filter-input"
                                >
                                    <option value="">Mặc định</option>
                                    <option value="price_asc">Giá tăng dần</option>
                                    <option value="price_desc">Giá giảm dần</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="results-section">
                        {posts.length > 0 ? (
                            <Card post={posts} limit={18} />
                        ) : (
                            <div className="no-results">
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                    <circle cx="32" cy="32" r="32" fill="#F3F4F6"/>
                                    <path d="M32 20V32L38 38" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <h3>Không tìm thấy kết quả</h3>
                                <p>Vui lòng thử điều chỉnh bộ lọc của bạn</p>
                                <button onClick={handleResetFilters} className="reset-filters-btn">
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
import { formatPrice } from '@/utils/formatPrice';
import { router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import Footer from '../components/Footer/Footer.jsx';
import Navbar from '../components/Headers/Navbar/Navbar.jsx';
import CardList from '../components/Main-content/cards/CardList.jsx';
import './HomeFinder.css';
import Pagination from './Pagination.jsx';

export default function HomeFinder() {
    const {
        list,
        cities,
        categories,
        filters: initialFilters,
    } = usePage().props;

    const [filters, setFilters] = useState(initialFilters || {});
    const [showFilters, setShowFilters] = useState(false);
    const debounceRef = useRef(null);

    // Các mốc giá (tính bằng VNĐ)
    const priceOptions = [
        { value: '', label: 'Chọn giá' },
        { value: 500000000, label: formatPrice(500000000) },
        { value: 800000000, label: formatPrice(800000000) },
        { value: 1000000000, label: formatPrice(1000000000) },
        { value: 2000000000, label: formatPrice(2000000000) },
        { value: 3000000000, label: formatPrice(3000000000) },
        { value: 5000000000, label: formatPrice(5000000000) },
        { value: 7000000000, label: formatPrice(7000000000) },
        { value: 10000000000, label: formatPrice(10000000000) },
        { value: 15000000000, label: formatPrice(15000000000) },
        { value: 20000000000, label: formatPrice(20000000000) },
        { value: 30000000000, label: formatPrice(30000000000) },
        { value: 50000000000, label: formatPrice(50000000000) },
        { value: 100000000000, label: formatPrice(100000000000) },
    ];

    const activeFilterCount = Object.values(filters).filter(
        (v) => v !== null && v !== undefined && v !== '',
    ).length;

    function handleFilterChange(e) {
        const { name, value, type } = e.target;

        const val =
            value === '' || value === null
                ? undefined
                : type === 'number'
                  ? Number(value)
                  : value;

        // clone filters
        const newFilters = { ...filters };

        // cập nhật filter hiện tại
        if (val === undefined) delete newFilters[name];
        else newFilters[name] = val;

        setFilters(newFilters);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            // loại bỏ các filter rỗng/undefined/null trước khi gửi
            const query = Object.fromEntries(
                Object.entries({ ...newFilters, page: 1 }).filter(
                    ([_, v]) => v !== undefined && v !== null && v !== '',
                ),
            );

            router.get('/home-finder', query, {
                preserveState: false,
                replace: false,
                scroll: 'top',
            });
        }, 300);
    }

    function handleResetFilters() {
        setFilters({});

        router.get(
            '/home-finder',
            {},
            {
                preserveState: false,
                replace: false,
                scroll: 'top',
            },
        );
    }

    return (
        <>
            <Navbar />
            <div className="list-page">
                <div className="list-container">
                    {/* Header */}
                    <div className="list-header">
                        <div className="list-header-content">
                            <h1 className="list-title">
                                Danh sách bất động sản
                            </h1>
                            <p className="list-subtitle">
                                Tìm thấy
                                <span className="highlight">
                                    {list.total ?? 0}
                                </span>
                                kết quả
                            </p>
                        </div>
                        <button
                            className="filter-toggle-btn"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Bộ lọc
                            {activeFilterCount > 0 && (
                                <span className="filter-badge">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filter Panel */}
                    <div
                        className={`filter-panel ${showFilters ? 'show' : ''}`}
                    >
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
                            {/* City */}
                            <div className="filter-group">
                                <label>Khu vực</label>
                                <select
                                    name="city_id"
                                    value={filters.city_id?.toString() ?? ''}
                                    onChange={handleFilterChange}
                                    className="filter-input"
                                >
                                    <option value="">Tất cả thành phố</option>
                                    {cities.map((city) => (
                                        <option
                                            key={city.id}
                                            value={city.id.toString()}
                                        >
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Category */}
                            <div className="filter-group">
                                <label>Loại hình</label>
                                <select
                                    name="category_id"
                                    value={
                                        filters.category_id?.toString() ?? ''
                                    }
                                    onChange={handleFilterChange}
                                    className="filter-input"
                                >
                                    <option value="">Tất cả loại hình</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price */}
                            <div className="filter-group">
                                <label>Khoảng giá</label>
                                <div className="range-inputs">
                                    <span className="range-separator">-</span>
                                    <select
                                        name="maxPrice"
                                        value={
                                            filters.maxPrice?.toString() ?? ''
                                        }
                                        onChange={handleFilterChange}
                                        className="filter-input"
                                    >
                                        {priceOptions.map((option) => (
                                            <option
                                                key={`max-${option.value}`}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Area */}
                            <div className="filter-group">
                                <label>Diện tích (m²)</label>
                                <div className="range-inputs">
                                    <input
                                        type="number"
                                        name="minArea"
                                        placeholder="Từ"
                                        value={filters.minArea ?? ''}
                                        onChange={handleFilterChange}
                                        className="filter-input"
                                    />
                                    <span className="range-separator">-</span>
                                    <input
                                        type="number"
                                        name="maxArea"
                                        placeholder="Đến"
                                        value={filters.maxArea ?? ''}
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
                                    value={filters.bedrooms ?? ''}
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
                                    value={filters.sort?.toString() ?? ''}
                                    onChange={handleFilterChange}
                                    className="filter-input"
                                >
                                    <option value="">Mặc định</option>
                                    <option value="price_asc">
                                        Giá tăng dần
                                    </option>
                                    <option value="price_desc">
                                        Giá giảm dần
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="results-section" key={list.current_page}>
                        {list.data.length > 0 ? (
                            <>
                                <CardList
                                    post={list.data}
                                    limit={20}
                                    showMore={false}
                                />
                                <Pagination meta={list} filters={filters} />
                            </>
                        ) : (
                            <div className="no-results">
                                <h3>Không tìm thấy kết quả</h3>
                                <p>Vui lòng thử điều chỉnh bộ lọc của bạn</p>
                                <button
                                    onClick={handleResetFilters}
                                    className="reset-filters-btn"
                                >
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

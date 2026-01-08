import { router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import Footer from '../components/Footer/Footer.jsx';
import Navbar from '../components/Headers/Navbar/Navbar.jsx';
import CardList from '../components/Main-content/cards/CardList.jsx';
import Pagination from './Pagination.jsx';
import './HomeFinder.css';

export default function HomeFinder() {
    const {
        list,
        cities,
        categories,
        filters: initialFilters,
    } = usePage().props;

    const [filters, setFilters] = useState(initialFilters || {});
    const [searchInput, setSearchInput] = useState(initialFilters?.q || '');
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [tempAreaRange, setTempAreaRange] = useState({
        min: filters.minArea || '',
        max: filters.maxArea || ''
    });
    const [tempPriceRange, setTempPriceRange] = useState({
        min: filters.minPrice || '',
        max: filters.maxPrice || ''
    });
    const debounceRef = useRef(null);

    // Hàm format giá
    function formatPrice(price) {
        if (price >= 1_000_000_000) {
            return (price / 1_000_000_000).toFixed(1).replace('.0', '').replace('.', ',') + ' tỷ';
        } else if (price >= 1_000_000) {
            return (price / 1_000_000).toFixed(1).replace('.0', '').replace('.', ',') + ' triệu';
        } else {
            return price.toLocaleString('vi-VN');
        }
    }

    // Các mốc diện tích
    const areaOptions = [
        { min: '', max: 30, label: 'Dưới 30 m²' },
        { min: 30, max: 50, label: '30 - 50 m²' },
        { min: 50, max: 80, label: '50 - 80 m²' },
        { min: 80, max: 100, label: '80 - 100 m²' },
        { min: 100, max: 150, label: '100 - 150 m²' },
        { min: 150, max: 200, label: '150 - 200 m²' },
        { min: 200, max: 250, label: '200 - 250 m²' },
        
    ];

    // Các mốc giá
    const priceRanges = [
        { label: 'Thỏa thuận', min: '', max: '' },
        { label: 'Dưới 500 triệu', min: '', max: 500000000 },
        { label: '500 - 800 triệu', min: 500000000, max: 800000000 },
        { label: '800 triệu - 1 tỷ', min: 800000000, max: 1000000000 },
        { label: '1 - 2 tỷ', min: 1000000000, max: 2000000000 },
        { label: '2 - 3 tỷ', min: 2000000000, max: 3000000000 },
        { label: '3 - 5 tỷ', min: 3000000000, max: 5000000000 },
        { label: '5 - 7 tỷ', min: 5000000000, max: 7000000000 },
        { label: '7 - 10 tỷ', min: 7000000000, max: 10000000000 },
        { label: '10 - 20 tỷ', min: 10000000000, max: 20000000000 },
        { label: '20 - 30 tỷ', min: 20000000000, max: 30000000000 },
        
    ];

    const activeFilterCount = Object.values(filters).filter(
        (v) => v !== null && v !== undefined && v !== '',
    ).length;

    function handleFilterChange(name, value) {
        const newFilters = { ...filters };

        if (value === undefined || value === '' || value === null) {
            delete newFilters[name];
        } else {
            newFilters[name] = value;
        }

        setFilters(newFilters);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            const query = Object.fromEntries(
                Object.entries({ ...newFilters, page: 1 }).filter(
                    ([_, v]) => v !== undefined && v !== null && v !== '',
                ),
            );

            router.get('/home-finder', query, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 300);
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        
        const newFilters = { ...filters };
        
        if (searchInput.trim() === '') {
            delete newFilters.q;
        } else {
            newFilters.q = searchInput.trim();
        }

        setFilters(newFilters);

        const query = Object.fromEntries(
            Object.entries({ ...newFilters, page: 1 }).filter(
                ([_, v]) => v !== undefined && v !== null && v !== '',
            ),
        );

        console.log('Search params:', query); // Debug

        router.get('/home-finder', query, {
            preserveState: false,
            replace: false,
            preserveScroll: false,
        });
    }

    function handleResetFilters() {
        setFilters({});
        setSearchInput('');
        router.get('/home-finder', {}, {
            preserveState: false,
            replace: false,
        });
    }

    function handleAreaSelect(min, max) {
        setTempAreaRange({ min: min || '', max: max || '' });
    }

    function handleApplyArea() {
        if (tempAreaRange.min) handleFilterChange('minArea', Number(tempAreaRange.min));
        else handleFilterChange('minArea', undefined);
        
        if (tempAreaRange.max) handleFilterChange('maxArea', Number(tempAreaRange.max));
        else handleFilterChange('maxArea', undefined);
        
        setShowAreaModal(false);
    }

    function handlePriceSelect(min, max) {
        handleFilterChange('minPrice', min || undefined);
        handleFilterChange('maxPrice', max || undefined);
        setShowPriceModal(false);
    }

    function getAreaLabel() {
        if (filters.minArea && filters.maxArea) {
            return `${filters.minArea} - ${filters.maxArea} m²`;
        } else if (filters.minArea) {
            return `Từ ${filters.minArea} m²`;
        } else if (filters.maxArea) {
            return `Đến ${filters.maxArea} m²`;
        }
        return 'Diện tích';
    }

    function getPriceLabel() {
        if (filters.minPrice && filters.maxPrice) {
            return `${formatPrice(filters.minPrice)} - ${formatPrice(filters.maxPrice)}`;
        } else if (filters.minPrice) {
            return `Từ ${formatPrice(filters.minPrice)}`;
        } else if (filters.maxPrice) {
            return `Đến ${formatPrice(filters.maxPrice)}`;
        }
        return 'Khoảng giá';
    }

    return (
        <>
            <Navbar />
            <div className="list-page">
                <div className="list-container">
                    {/* Search Bar */}
                    <div className="search-section">
                        {/* Quick Stats */}
                        <div className="quick-stats">
                            <div className="stat-item">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 2L3 7v11h5v-6h4v6h5V7l-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <div className="stat-info">
                                    <span className="stat-number">{list.total?.toLocaleString('vi-VN') ?? 0}</span>
                                    <span className="stat-label">Bất động sản</span>
                                </div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                <div className="stat-info">
                                    <span className="stat-number">Hôm nay</span>
                                    <span className="stat-label">Cập nhật mới</span>
                                </div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M2.5 10h15M10 2.5v15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                <div className="stat-info">
                                    <span className="stat-number">{activeFilterCount}</span>
                                    <span className="stat-label">Bộ lọc đang dùng</span>
                                </div>
                            </div>
                        </div>

                        {/* Filter Pills */}
                        <div className="filter-pills">
                            <button 
                                className={`filter-pill ${activeFilterCount > 0 ? 'active' : ''}`}
                                onClick={handleResetFilters}
                                type="button"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M2 4h12M5 4V2.5M11 4V2.5M5 8h6M7 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                {activeFilterCount > 0 ? 'Xóa lọc' : 'Bộ lọc'}
                                {activeFilterCount > 0 && (
                                    <span className="filter-count">{activeFilterCount}</span>
                                )}
                            </button>

                            <select 
                                className={`filter-pill ${filters.city_id ? 'active' : ''}`}
                                value={filters.city_id?.toString() || ''}
                                onChange={(e) => handleFilterChange('city_id', e.target.value ? Number(e.target.value) : undefined)}
                            >
                                <option value="">Tất cả khu vực</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id.toString()}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>

                            <button className="filter-pill" type="button">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                Tin xác thực
                                <label className="toggle-switch">
                                    <input type="checkbox" />
                                    <span className="toggle-slider"></span>
                                </label>
                            </button>

                            <div className="filter-pill-group">
                                <select 
                                    className={`filter-pill ${filters.category_id ? 'active' : ''}`}
                                    value={filters.category_id?.toString() || ''}
                                    onChange={(e) => handleFilterChange('category_id', e.target.value ? Number(e.target.value) : undefined)}
                                >
                                    <option value="">Loại nhà đất</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                <button 
                                    type="button"
                                    className={`filter-pill ${filters.minPrice || filters.maxPrice ? 'active' : ''}`}
                                    onClick={() => setShowPriceModal(true)}
                                >
                                    {getPriceLabel()}
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>

                                <button 
                                    type="button"
                                    className={`filter-pill ${filters.minArea || filters.maxArea ? 'active' : ''}`}
                                    onClick={() => setShowAreaModal(true)}
                                >
                                    {getAreaLabel()}
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>

                                <select 
                                    className={`filter-pill ${filters.bedrooms ? 'active' : ''}`}
                                    value={filters.bedrooms?.toString() || ''}
                                    onChange={(e) => handleFilterChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                                >
                                    <option value="">Số phòng ngủ</option>
                                    <option value="1">1 phòng</option>
                                    <option value="2">2 phòng</option>
                                    <option value="3">3 phòng</option>
                                    <option value="4">4 phòng</option>
                                    <option value="5">5+ phòng</option>
                                </select>

                                <select 
                                    className={`filter-pill ${filters.sort ? 'active' : ''}`}
                                    value={filters.sort?.toString() || ''}
                                    onChange={(e) => handleFilterChange('sort', e.target.value || undefined)}
                                >
                                    <option value="">Sắp xếp</option>
                                    <option value="price_asc">Giá tăng dần</option>
                                    <option value="price_desc">Giá giảm dần</option>
                                    <option value="area_asc">Diện tích tăng dần</option>
                                    <option value="area_desc">Diện tích giảm dần</option>
                                    <option value="newest">Mới nhất</option>
                                </select>
                            </div>

                            {/* <button className="filter-pill" type="button">
                                Môi giới chuyên nghiệp
                                <label className="toggle-switch">
                                    <input type="checkbox" />
                                    <span className="toggle-slider"></span>
                                </label>
                            </button> */}
                        </div>
                    </div>

                    {/* Results Header */}
                    <div className="results-header">
                        {/* <div className="breadcrumb">
                            Bán / Hồ Chí Minh / Tất cả BĐS tại Hồ Chí Minh
                        </div> */}
                        <div className="results-info">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M8 8V5M8 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            Có <strong>{list.total?.toLocaleString('vi-VN') ?? 0}</strong> lượt xem khu vực này trong 7 ngày vừa qua.
                        </div>
                    </div>

                    {/* Page Title */}
                    <h1 className="page-title">Mua Bán Nhà Đất .... Giá Rẻ Mới</h1>
                    <p className="page-subtitle">Hiện có {list.total?.toLocaleString('vi-VN') ?? 0} bất động sản.</p>

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
                                <button onClick={handleResetFilters} className="reset-filters-btn">
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Area Modal */}
            {showAreaModal && (
                <div className="modal-overlay" onClick={() => setShowAreaModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Diện tích</h3>
                            <button className="modal-close" onClick={() => setShowAreaModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="range-section">
                                <h4>Diện tích nhỏ nhất</h4>
                                <div className="range-inputs-modal">
                                    <input
                                        type="number"
                                        placeholder="Từ"
                                        value={tempAreaRange.min}
                                        onChange={(e) => setTempAreaRange({...tempAreaRange, min: e.target.value})}
                                        className="modal-input"
                                    />
                                    <span>→</span>
                                    <input
                                        type="number"
                                        placeholder="Đến"
                                        value={tempAreaRange.max}
                                        onChange={(e) => setTempAreaRange({...tempAreaRange, max: e.target.value})}
                                        className="modal-input"
                                    />
                                </div>
                            </div>
                            <h4>Tất cả diện tích</h4>
                            <div className="options-grid">
                                <button
                                    type="button"
                                    className={`option-btn ${!filters.minArea && !filters.maxArea ? 'active' : ''}`}
                                    onClick={() => handleAreaSelect('', '')}
                                >
                                    Tất cả
                                </button>
                                {areaOptions.map((option, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className={`option-btn ${filters.minArea == option.min && filters.maxArea == option.max ? 'active' : ''}`}
                                        onClick={() => handleAreaSelect(option.min, option.max)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-apply" onClick={handleApplyArea}>
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Price Modal */}
            {showPriceModal && (
                <div className="modal-overlay" onClick={() => setShowPriceModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Khoảng giá</h3>
                            <button className="modal-close" onClick={() => setShowPriceModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <h4>Lọc theo khoảng giá</h4>
                            <div className="options-list">
                                {priceRanges.map((range, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className={`option-item ${filters.minPrice == range.min && filters.maxPrice == range.max ? 'active' : ''}`}
                                        onClick={() => handlePriceSelect(range.min, range.max)}
                                    >
                                        <span className="radio-circle"></span>
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                            <h4>Lọc theo diện tích</h4>
                            <div className="options-list">
                                {areaOptions.map((option, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className={`option-item ${filters.minArea == option.min && filters.maxArea == option.max ? 'active' : ''}`}
                                        onClick={() => {
                                            handleFilterChange('minArea', option.min || undefined);
                                            handleFilterChange('maxArea', option.max || undefined);
                                        }}
                                    >
                                        <span className="radio-circle"></span>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
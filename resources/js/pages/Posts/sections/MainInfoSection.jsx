import useDropdown from '@/hooks/useDropdown.js';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import CategoryDropdown from '../modals/CategoryDropdown';

export default function MainInfoSection({ form, categories }) {
    const { data, setData, errors } = form;

    const [open, setOpen] = useState(true);
    const {
        menuRef: refUnit,
        open: openUnit,
        setOpen: setOpenUnit,
    } = useDropdown();
    const {
        menuRef: refCategory,
        open: openCategory,
        setOpen: setOpenCategory,
    } = useDropdown();

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [displayPrice, setDisplayPrice] = useState('');
    const [priceUnit, setPriceUnit] = useState('million');

    const MAX_AREA = 10_000; // m²
    const MAX_PRICE_VND = 1_000 * 1_000_000_000; // 1000 tỷ

    const UNITS = [
        { id: 'million', name: 'Triệu VNĐ' },
        { id: 'billion', name: 'Tỷ VNĐ' },
    ];

    function toVND(value, unit) {
        if (value === '' || value === null) return null;

        const n = Number(value);
        if (isNaN(n) || n <= 0) return null;

        return unit === 'billion' ? n * 1_000_000_000 : n * 1_000_000;
    }

    function handleSelectUnit(unitId) {
        setPriceUnit(unitId);
        setData('price', toVND(displayPrice, unitId));
        setOpenUnit(false);
    }

    function formatPrice(vnd) {
        const n = Number(vnd);
        if (!n || n <= 0) return '';

        if (n >= 1_000_000_000) {
            const v = n / 1_000_000_000;
            return `${Number.isInteger(v) ? v : v.toFixed(1)} tỷ`;
        }

        if (n >= 1_000_000) {
            const v = n / 1_000_000;
            return `${Number.isInteger(v) ? v : v.toFixed(1)} triệu`;
        }

        return `${n.toLocaleString('vi-VN')} ₫`;
    }

    function buildSummary() {
        const parts = [];

        if (selectedCategory?.name) {
            parts.push(selectedCategory.name);
        }

        if (data.price > 0) {
            parts.push(formatPrice(data.price));
        }

        if (data.area > 0) {
            parts.push(`${data.area} m²`);
        }

        return parts.join(' • ');
    }

    const sectionRef = useRef(null);
    const hasScrolledRef = useRef(false);

    useEffect(() => {
        if (!open || !sectionRef.current || hasScrolledRef.current) return;

        hasScrolledRef.current = true;

        requestAnimationFrame(() => {
            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const isFullyVisible =
                rect.top >= 0 && rect.bottom <= viewportHeight;

            if (!isFullyVisible) {
                sectionRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: rect.top < 0 ? 'start' : 'center',
                });
            }
        });
    }, [open]);

    useEffect(() => {
        if (!open) {
            hasScrolledRef.current = false;
        }
    }, [open]);

    const hasError = Boolean(
        errors?.category_id || errors?.area || errors?.price,
    );

    useEffect(() => {
        if (hasError) setOpen(true);
    }, [hasError]);

    useEffect(() => {
        if (
            data.legal ||
            data.furniture ||
            data.direction ||
            data.bedrooms ||
            data.bathrooms ||
            data.livingrooms ||
            data.kitchens ||
            data.floors ||
            data.title ||
            data.description
        ) {
            setOpen(false);
        }
    }, [
        data.legal,
        data.furniture,
        data.direction,
        data.bedrooms,
        data.bathrooms,
        data.livingrooms,
        data.kitchens,
        data.floors,
        data.title,
        data.description,
    ]);

    useEffect(() => {
        if (data.category_id && categories?.length) {
            const cate = categories.find((c) => c.id === data.category_id);
            setSelectedCategory(cate || null);
        }
    }, [data.category_id, categories]);

    useEffect(() => {
        if (!data.price) return;

        // nếu UI đã có giá rồi thì không hydrate lại
        if (displayPrice !== '') return;

        // detect unit
        if (data.price >= 1_000_000_000) {
            setPriceUnit('billion');
            setDisplayPrice(
                (data.price / 1_000_000_000).toString().replace(/\.0$/, ''),
            );
        } else {
            setPriceUnit('million');
            setDisplayPrice(
                (data.price / 1_000_000).toString().replace(/\.0$/, ''),
            );
        }
    }, [data.price]);

    return (
        <div
            ref={sectionRef}
            className="post-form__field"
            onClick={() => setOpen(true)}
            style={{ cursor: open ? 'default' : 'pointer' }}
        >
            <div
                className="post-form__field--type"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((pre) => !pre);
                }}
            >
                <span className="post-form__label">Thông tin chính</span>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    {hasError && (
                        <img src="/icons/icon-error.svg" alt="error" />
                    )}
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`dropdown-icon arrow ${open ? 'rotate' : ''}`}
                    />
                </div>
            </div>

            {open ? (
                <div
                    style={{ cursor: 'default' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Loại bất động sản */}
                    <div className="address-panel__field">
                        <span className="post-form__label address-panel__label">
                            Loại bất động sản
                        </span>
                        <div
                            className="address-panel__control"
                            style={{ position: 'relative' }}
                            onClick={() => setOpenCategory((pre) => !pre)}
                        >
                            <input
                                readOnly
                                value={selectedCategory?.name || ''}
                                placeholder="Chọn loại BĐS"
                                className="post-form__input--address"
                            />

                            {openCategory && (
                                <CategoryDropdown
                                    form={form}
                                    refCategory={refCategory}
                                    categories={categories}
                                    onSelect={(cate) => {
                                        setSelectedCategory(cate);
                                        setOpenCategory(false);
                                        form.clearErrors('category_id');
                                    }}
                                />
                            )}
                        </div>

                        {errors?.category_id && (
                            <span className="post-form__field--error-text">
                                {errors?.category_id}
                            </span>
                        )}
                    </div>

                    {/* Diện tích */}
                    <div className="address-panel__field">
                        <span className="post-form__label address-panel__label">
                            Diện tích
                        </span>
                        <div className="address-panel__control area-control">
                            <input
                                type="text"
                                placeholder="Nhập diện tích"
                                value={data.area}
                                className="post-form__input--address"
                                style={{ cursor: 'text' }}
                                onChange={(e) => {
                                    let val = e.target.value.replace(',', '.');

                                    if (!/^[0-9]*\.?[0-9]*$/.test(val)) return;

                                    if (val === '') {
                                        setData('area', '');
                                        return;
                                    }

                                    const num = Number(val);

                                    // vượt quá giới hạn
                                    if (num > MAX_AREA) return;

                                    // quá nhiều chữ số thập phân
                                    const [, decimals] = val.split('.');
                                    if (decimals?.length > 2) return;

                                    setData('area', val);

                                    if (errors?.area) {
                                        form.clearErrors('area');
                                    }
                                }}
                            />

                            <span className="area-control__unit">m²</span>
                        </div>

                        {errors?.area && (
                            <span className="post-form__field--error-text">
                                {errors?.area}
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        {/* Mức giá */}
                        <div style={{ flex: 2 }}>
                            <div className="address-panel__field">
                                <span className="post-form__label address-panel__label">
                                    Mức giá
                                </span>
                            </div>
                            <div className="address-panel__control">
                                <input
                                    type="text"
                                    placeholder="Nhập giá"
                                    value={displayPrice}
                                    className="post-form__input--address"
                                    style={{ cursor: 'text' }}
                                    onChange={(e) => {
                                        let val = e.target.value.replace(
                                            ',',
                                            '.',
                                        );

                                        if (!/^[0-9]*\.?[0-9]*$/.test(val))
                                            return;

                                        if (val === '') {
                                            setDisplayPrice('');
                                            setData('price', null);
                                            return;
                                        }

                                        const num = Number(val);

                                        // giá nhập vượt mức (theo đơn vị đang chọn)
                                        const vnd = toVND(num, priceUnit);
                                        if (vnd > MAX_PRICE_VND) return;

                                        // giới hạn 2 chữ số thập phân
                                        const [, decimals] = val.split('.');
                                        if (decimals?.length > 2) return;

                                        setDisplayPrice(val);
                                        setData('price', vnd);

                                        if (errors?.price) {
                                            form.clearErrors('price');
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Đơn vị */}
                        <div style={{ flex: 1 }}>
                            <div className="address-panel__field">
                                <span className="address-panel__label">
                                    Đơn vị
                                </span>
                            </div>
                            <div
                                className="address-panel__control"
                                onClick={() => setOpenUnit((pre) => !pre)}
                            >
                                <input
                                    readOnly
                                    className="post-form__input--address"
                                    value={
                                        UNITS.find((u) => u.id === priceUnit)
                                            ?.name || ''
                                    }
                                    disabled={Number(displayPrice) >= 1000}
                                />

                                {openUnit && (
                                    <div
                                        ref={refUnit}
                                        className="address-panel__control--popup unit-panel__control--popup"
                                    >
                                        {UNITS.map((unit) => (
                                            <div
                                                key={unit.id}
                                                className="chose-type__box--section"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectUnit(unit.id);
                                                }}
                                            >
                                                <div className="box-section">
                                                    <div className="box-section__title">
                                                        {unit.name}
                                                    </div>

                                                    <div className="box-section__checkbox">
                                                        <label className="box-section__lable">
                                                            <input
                                                                hidden
                                                                readOnly
                                                                type="radio"
                                                                name="city"
                                                                className="box-section__input"
                                                                checked={
                                                                    priceUnit ===
                                                                    unit.id
                                                                }
                                                            />
                                                            <span className="radio__span">
                                                                <svg
                                                                    data-type="monochrome"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    width="1em"
                                                                    height="1em"
                                                                    className="radio__span--svg"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M18.395 6.57598C18.9539 7.23778 18.8406 8.20346 18.142 8.7329C16.9767 9.61594 15.7539 11.1412 14.6582 12.8103C13.5825 14.4492 12.7128 16.0964 12.2249 17.1048C11.9744 17.6224 11.442 17.9662 10.8418 17.9976C10.2416 18.0291 9.67235 17.7432 9.36308 17.255C9.03962 16.7443 8.42067 16.0312 7.70905 15.3255C7.00122 14.6236 6.31449 14.0401 5.91727 13.7664C5.1937 13.2679 5.03373 12.3082 5.55996 11.6228C6.08619 10.9374 7.09935 10.7858 7.82292 11.2843C8.44244 11.7111 9.28082 12.4409 10.0519 13.2056C10.1818 13.3345 10.3131 13.4675 10.444 13.6035C10.8692 12.8459 11.3626 12.0187 11.9068 11.1897C13.0526 9.44411 14.5103 7.55465 16.118 6.33633C16.8166 5.80689 17.836 5.91419 18.395 6.57598Z"
                                                                        fill="currentColor"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {errors?.price && (
                        <span className="post-form__field--error-text">
                            {errors?.price}
                        </span>
                    )}

                    {data.price > 0 && (
                        <div
                            style={{
                                margin: '14px 12px 0',
                                fontSize: '1.3rem',
                                fontWeight: 700,
                            }}
                        >
                            Tổng trị giá: {formatPrice(data.price)}
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ marginTop: 16 }}>
                    <span style={{ fontSize: '1.5rem' }}>
                        {buildSummary() || 'Thêm thông tin'}
                    </span>
                </div>
            )}
        </div>
    );
}

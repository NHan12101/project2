import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import CounterField from './CounterField';

export default function AdditionalInfoSection({ form }) {
    const { data, setData } = form;

    const [open, setOpen] = useState(true);

    const [openLegal, setOpenLegal] = useState(false);
    const legalOptions = [
        { id: 1, label: 'Sổ hồng / Sổ đỏ' },
        { id: 2, label: 'Hợp đồng mua bán' },
        { id: 3, label: 'Giấy tay' },
        { id: 4, label: 'Đang chờ sổ' },
    ];

    const [openFurniture, setOpenFurniture] = useState(false);
    const furnitureOptions = [
        { id: 1, label: 'Đầy đủ' },
        { id: 2, label: 'Cơ bản' },
        { id: 3, label: 'Không nội thất' },
    ];

    const [openDirection, setOpenDirection] = useState(false);
    const directionOptions = [
        { id: 1, label: 'Đông' },
        { id: 2, label: 'Tây' },
        { id: 3, label: 'Nam' },
        { id: 4, label: 'Bắc' },
        { id: 5, label: 'Đông Bắc' },
        { id: 6, label: 'Tây Bắc' },
        { id: 7, label: 'Tây Nam' },
        { id: 8, label: 'Đông Nam' },
    ];

    const buildAdditionalSummary = () => {
        const parts = [];

        if (data.legal) parts.push(data.legal);
        if (data.furniture) parts.push(data.furniture);
        if (data.bedrooms > 0) parts.push(`${data.bedrooms} PN`);
        if (data.bathrooms > 0) parts.push(`${data.bathrooms} WC`);
        if (data.direction) parts.push(data.direction);

        return parts.join(' • ');
    };

    // Khi mở thì không đủ không trống phía dưới thì cuộn về giữa trang
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
                    block: rect.top < 0 ? 'start' : 'end',
                });
            }
        });
    }, [open]);

    useEffect(() => {
        if (!open) {
            hasScrolledRef.current = false;
        }
    }, [open]);

    // Mở popup linh động
    const controlRef = useRef(null);
    const popupRef = useRef(null);
    const [popupUp, setPopupUp] = useState(false);
    const [activePopup, setActivePopup] = useState(null);
    // 'legal' | 'furniture' | 'direction' | null

    const OFFSET = 100; // buffer UI

    function decideDirection() {
        if (!controlRef.current || !popupRef.current) return;

        const controlRect = controlRef.current.getBoundingClientRect();
        const popupHeight = popupRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;

        const spaceBottom = viewportHeight - controlRect.bottom;
        const spaceTop = controlRect.top;

        // Ưu tiên bên nào đủ chỗ
        if (spaceBottom >= popupHeight + OFFSET) {
            setPopupUp(false);
        } else if (spaceTop >= popupHeight + OFFSET) {
            setPopupUp(true);
        } else {
            // Cả hai bên đều không đủ -> chọn bên nhiều chỗ hơn
            setPopupUp(spaceTop > spaceBottom);
        }
    }

    useEffect(() => {
        if (!activePopup) return;

        requestAnimationFrame(decideDirection);

        window.addEventListener('resize', decideDirection);
        window.addEventListener('scroll', decideDirection, true);

        return () => {
            window.removeEventListener('resize', decideDirection);
            window.removeEventListener('scroll', decideDirection, true);
        };
    }, [activePopup]);

    useEffect(() => {
        if (data.title || data.description) {
            setOpen(false);
        }
    }, [data.title, data.description]);

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
                <span className="post-form__label--other">Thông tin khác</span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`dropdown-icon arrow ${open ? 'rotate' : ''}`}
                />
            </div>

            {open ? (
                <div>
                    {/* Giấy tờ pháp lý */}
                    <div className="address-panel__field">
                        <span className="address-panel__label">
                            Giấy tờ pháp lý
                        </span>
                        <div
                            ref={activePopup === 'legal' ? controlRef : null}
                            className="address-panel__control"
                            onClick={() => {
                                setOpenLegal((pre) => !pre);
                                setOpenFurniture(false);
                                setOpenDirection(false);
                                setActivePopup(
                                    activePopup === 'legal' ? null : 'legal',
                                );
                            }}
                            style={{ position: 'relative' }}
                        >
                            <input
                                readOnly
                                placeholder="Chọn giấy tờ pháp lý"
                                className="post-form__input--address"
                                value={data.legal}
                            />

                            {openLegal && (
                                <div
                                    ref={popupRef}
                                    className={`address-panel__control--popup ${
                                        popupUp ? 'popup--up' : ''
                                    }`}
                                    style={{ height: 186 }}
                                >
                                    {legalOptions.map((lg) => {
                                        return (
                                            <div
                                                key={lg.id}
                                                className="chose-type__box--section"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setData('legal', lg.label);
                                                    setOpenLegal(false);
                                                }}
                                            >
                                                <div className="box-section">
                                                    <div className="box-section__title">
                                                        {lg.label}
                                                    </div>

                                                    <div className="box-section__checkbox">
                                                        <label className="box-section__lable">
                                                            <input
                                                                hidden
                                                                readOnly
                                                                type="radio"
                                                                name="legal"
                                                                checked={
                                                                    data.legal ===
                                                                    lg.label
                                                                }
                                                            />

                                                            <span className="radio__span">
                                                                <svg
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
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nội thất */}
                    <div className="address-panel__field">
                        <span className="address-panel__label">Nội thất</span>
                        <div
                            ref={
                                activePopup === 'furniture' ? controlRef : null
                            }
                            className="address-panel__control"
                            onClick={() => {
                                setOpenFurniture((pre) => !pre);
                                setOpenLegal(false);
                                setOpenDirection(false);
                                setActivePopup(
                                    activePopup === 'furniture'
                                        ? null
                                        : 'furniture',
                                );
                            }}
                            style={{ position: 'relative' }}
                        >
                            <input
                                readOnly
                                placeholder="Chọn nội thất"
                                className="post-form__input--address"
                                value={data.furniture}
                            />

                            {openFurniture && (
                                <div
                                    ref={popupRef}
                                    className={`address-panel__control--popup ${
                                        popupUp ? 'popup--up' : ''
                                    }`}
                                    style={{ height: 146 }}
                                >
                                    {furnitureOptions.map((fu) => {
                                        return (
                                            <div
                                                key={fu.id}
                                                className="chose-type__box--section"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setData(
                                                        'furniture',
                                                        fu.label,
                                                    );
                                                    setOpenFurniture(false);
                                                }}
                                            >
                                                <div className="box-section">
                                                    <div className="box-section__title">
                                                        {fu.label}
                                                    </div>

                                                    <div className="box-section__checkbox">
                                                        <label className="box-section__lable">
                                                            <input
                                                                hidden
                                                                readOnly
                                                                type="radio"
                                                                name="furniture"
                                                                checked={
                                                                    data.furniture ===
                                                                    fu.label
                                                                }
                                                            />

                                                            <span className="radio__span">
                                                                <svg
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
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Số phòng ngủ */}
                    <CounterField
                        label="Số phòng ngủ"
                        value={data.bedrooms}
                        onChange={(v) => setData('bedrooms', v)}
                    />

                    {/* Số phòng tắm, vệ sinh */}
                    <CounterField
                        label="Số phòng tắm, vệ sinh"
                        value={data.bathrooms}
                        onChange={(v) => setData('bathrooms', v)}
                    />

                    {/* Số phòng khách */}
                    <CounterField
                        label="Số phòng khách"
                        value={data.livingrooms}
                        onChange={(v) => setData('livingrooms', v)}
                    />

                    {/* Số phòng bếp */}
                    <CounterField
                        label="Số phòng bếp"
                        value={data.kitchens}
                        onChange={(v) => setData('kitchens', v)}
                    />

                    {/* Số tầng */}
                    <CounterField
                        label="Số tầng"
                        value={data.floors}
                        onChange={(v) => setData('floors', v)}
                    />

                    {/* Hướng nhà */}
                    <div
                        className="address-panel__field"
                        style={{ marginTop: 26 }}
                    >
                        <span className="address-panel__label">Hướng nhà</span>
                        <div
                            ref={
                                activePopup === 'direction' ? controlRef : null
                            }
                            className="address-panel__control"
                            onClick={() => {
                                setOpenDirection((pre) => !pre);
                                setOpenLegal(false);
                                setOpenFurniture(false);
                                setActivePopup(
                                    activePopup === 'direction'
                                        ? null
                                        : 'direction',
                                );
                            }}
                            style={{ position: 'relative' }}
                        >
                            <input
                                readOnly
                                placeholder="Chọn hướng nhà"
                                className="post-form__input--address"
                                value={data.direction}
                            />

                            {openDirection && (
                                <div
                                    ref={popupRef}
                                    className={`address-panel__control--popup category-panel__control--popup ${
                                        popupUp ? 'popup--up' : ''
                                    }`}
                                    style={{ height: 256 }}
                                >
                                    {directionOptions.map((dir) => {
                                        return (
                                            <div
                                                key={dir.id}
                                                className="chose-type__box--section"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setData(
                                                        'direction',
                                                        dir.label,
                                                    );
                                                    setOpenDirection(false);
                                                }}
                                            >
                                                <div className="box-section">
                                                    <div className="box-section__title">
                                                        {dir.label}
                                                    </div>

                                                    <div className="box-section__checkbox">
                                                        <label className="box-section__lable">
                                                            <input
                                                                hidden
                                                                readOnly
                                                                type="radio"
                                                                name="direction"
                                                                checked={
                                                                    data.direction ===
                                                                    dir.label
                                                                }
                                                            />

                                                            <span className="radio__span">
                                                                <svg
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
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: 16 }}>
                    <span style={{ fontSize: '1.5rem' }}>
                        {buildAdditionalSummary() || 'Thêm thông tin'}
                    </span>
                </div>
            )}
        </div>
    );
}

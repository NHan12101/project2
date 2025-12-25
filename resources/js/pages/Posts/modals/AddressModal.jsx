import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import MapView from '../../MapView';

export default function AddressModal({
    form,
    cities,
    onClose,
    onClear,
    menuRef,
}) {
    const { data, setData } = form;

    const [errors, setErrors] = useState({
        city_id: null,
        ward_id: null,
        street: null,
    });

    const validateAddress = () => {
        const newErrors = {};

        if (!selectedCity) {
            newErrors.city_id = 'Vui lòng chọn tỉnh/thành';
        }

        if (!selectedWard) {
            newErrors.ward_id = 'Vui lòng chọn phường/xã';
        }

        if (!street.trim()) {
            newErrors.street = 'Vui lòng nhập địa chỉ chi tiết';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const [openCity, setOpenCity] = useState(false);
    const [openWard, setOpenWard] = useState(false);

    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [wards, setWards] = useState([]);
    const [street, setStreet] = useState('');

    const [citySearch, setCitySearch] = useState('');
    const [wardSearch, setWardSearch] = useState('');

    const displayAddress = [street, selectedWard?.ward_name, selectedCity?.name]
        .filter(Boolean)
        .join(', ');

    const [lat, setLat] = useState(21.0278);
    const [lng, setLng] = useState(105.8342);

    const handleMapChange = ({ lat, lng }) => {
        setLat(lat);
        setLng(lng);
    };

    const handleSelectCity = (city) => {
        setSelectedCity(city);
        setSelectedWard(null);
        setStreet('');

        setErrors((prev) => ({
            ...prev,
            city_id: null,
        }));

        setOpenCity(false);
        setOpenWard(true);
    };

    const handleSelectWard = (ward) => {
        setSelectedWard(ward);
        setStreet('');

        setErrors((prev) => ({
            ...prev,
            ward_id: null,
        }));

        setOpenWard(false);
    };

    useEffect(() => {
        if (selectedWard?.latitude && selectedWard?.longitude) {
            setLat(Number(selectedWard.latitude));
            setLng(Number(selectedWard.longitude));
        }
    }, [selectedWard]);

    useEffect(() => {
        if (!selectedCity) {
            setWards([]);
            return;
        }

        setLat(Number(selectedCity.latitude));
        setLng(Number(selectedCity.longitude));

        axios
            .get(`/api/regions/wards/${selectedCity.id}`)
            .then((res) => setWards(res.data))
            .catch(() => setWards([]));
    }, [selectedCity]);

    useEffect(() => {
        if (!data.city_id) return;

        const city = cities.find((c) => c.id === data.city_id);
        setSelectedCity(city ?? null);

        if (city) {
            axios.get(`/api/regions/wards/${city.id}`).then((res) => {
                setWards(res.data);

                const ward = res.data.find((w) => w.id === data.ward_id);
                setSelectedWard(ward ?? null);
            });
        }

        setStreet(data.address_detail ?? '');

        setLat(data.latitude ?? 21.0278);
        setLng(data.longitude ?? 105.8342);
    }, []);

    const handleConfirmAddress = () => {
        if (!validateAddress()) return;

        setData('city_id', selectedCity.id);
        setData('ward_id', selectedWard.id);
        setData('address_detail', street);
        setData('address', displayAddress);
        setData('latitude', lat);
        setData('longitude', lng);

        onClose();
        onClear();
    };

    // ========== NORMALIZE =================
    function normalizeText(text) {
        if (!text) return '';

        return text
            ?.normalize('NFD') // 1. Tách ký tự có dấu thành ký tự + dấu
            .replace(/[\u0300-\u036f]/g, '') // 2. Loại bỏ toàn bộ dấu
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D') // 3. Cho phép giữ đ và Đ
            .replace(/\s+/g, '') // 4. Xoá mọi khoảng trắng
            .toLowerCase();
    }

    // =========== FILTER =================
    const filteredCities = useMemo(() => {
        const s = normalizeText(citySearch);
        return cities.filter((c) => normalizeText(c.name).includes(s));
    }, [citySearch, cities]);

    const filteredWards = useMemo(() => {
        const s = normalizeText(wardSearch);
        return wards.filter((w) => normalizeText(w.ward_name).includes(s));
    }, [wardSearch, wards]);

    return (
        <div className="address-panel" ref={menuRef}>
            {/* Header */}
            <div className="address-panel__header">
                <h1 className="address-panel__title">
                    {data.address ? 'Xác nhận địa chỉ' : 'Chọn địa chỉ'}
                </h1>
                <button
                    className="address-panel__close"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    ✕
                </button>
            </div>

            {/* Body */}
            <div
                className="address-panel__body"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleConfirmAddress();
                    }
                }}
            >
                {/* Tỉnh / Thành phố */}
                <div className="address-panel__field address-panel__field--city">
                    <span className="post-form__label address-panel__label">
                        Tỉnh / Thành phố
                    </span>
                    <div
                        className="address-panel__control"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenCity((prev) => !prev);
                            setOpenWard(false);
                            setCitySearch('');
                        }}
                    >
                        <input
                            readOnly
                            value={selectedCity?.name || ''}
                            placeholder="Chọn tỉnh/thành"
                            className={`post-form__input--address ${errors?.city_id ? 'post-form__field--error' : ''}`}
                        />

                        {openCity && (
                            <div
                                className="address-panel__control--popup"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Tìm kiếm */}
                                <div
                                    className="select-region__content--search"
                                    style={{
                                        marginBottom: 10,
                                    }}
                                >
                                    <svg
                                        data-type="monochrome"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="20"
                                        height="20"
                                        fill="none"
                                    >
                                        <path
                                            d="M18.2798 11.4399C18.2797 7.66239 15.2175 4.6001 11.4399 4.6001C7.66244 4.60018 4.60018 7.66244 4.6001 11.4399C4.6001 15.2175 7.66239 18.2797 11.4399 18.2798C15.2176 18.2798 18.2798 15.2176 18.2798 11.4399ZM20.2798 11.4399C20.2798 13.5439 19.5432 15.4748 18.3159 16.9927L21.0952 19.6812L21.1655 19.7563C21.4922 20.1438 21.4786 20.7232 21.1187 21.0952C20.7586 21.4674 20.1798 21.5 19.7817 21.186L19.7046 21.1187L16.8901 18.396C15.3881 19.5745 13.4972 20.2798 11.4399 20.2798C6.55782 20.2797 2.6001 16.3221 2.6001 11.4399C2.60018 6.55787 6.55787 2.60018 11.4399 2.6001C16.3221 2.6001 20.2797 6.55782 20.2798 11.4399Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <input
                                        autoFocus
                                        value={citySearch}
                                        onChange={(e) =>
                                            setCitySearch(e.target.value)
                                        }
                                        placeholder="Tìm tỉnh thành"
                                    />
                                </div>

                                <div className="chose-type__box select-region__box">
                                    {filteredCities.map((city) => (
                                        <div
                                            key={city.id}
                                            className="chose-type__box--section"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectCity(city);
                                            }}
                                        >
                                            <div className="box-section">
                                                <div className="box-section__title">
                                                    {city.name}
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
                                                                selectedCity?.id ===
                                                                city.id
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
                            </div>
                        )}
                    </div>

                    {errors?.city_id && (
                        <span
                            className="post-form__field--error-text"
                            style={{ margin: '10px 12px 0' }}
                        >
                            {errors.city_id}
                        </span>
                    )}
                </div>

                {/* Phường / Xã */}
                <div className="address-panel__field address-panel__field--ward">
                    <span className="post-form__label address-panel__label">
                        Phường / Xã
                    </span>
                    <div
                        className="address-panel__control"
                        onClick={() => {
                            if (!selectedCity) return;
                            setOpenWard((pre) => !pre);
                            setWardSearch('');
                            setOpenCity(false);
                        }}
                    >
                        <input
                            readOnly
                            value={selectedWard?.ward_name || ''}
                            placeholder={'Chọn phường/xã'}
                            disabled={!selectedCity}
                            className={`post-form__input--address ${errors?.ward_id ? 'post-form__field--error' : ''}`}
                        />

                        {openWard && (
                            <div
                                className="address-panel__control--popup"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Tìm kiếm */}
                                <div
                                    className="select-region__content--search"
                                    style={{
                                        marginBottom: 10,
                                    }}
                                >
                                    <svg
                                        data-type="monochrome"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="20"
                                        height="20"
                                        fill="none"
                                    >
                                        <path
                                            d="M18.2798 11.4399C18.2797 7.66239 15.2175 4.6001 11.4399 4.6001C7.66244 4.60018 4.60018 7.66244 4.6001 11.4399C4.6001 15.2175 7.66239 18.2797 11.4399 18.2798C15.2176 18.2798 18.2798 15.2176 18.2798 11.4399ZM20.2798 11.4399C20.2798 13.5439 19.5432 15.4748 18.3159 16.9927L21.0952 19.6812L21.1655 19.7563C21.4922 20.1438 21.4786 20.7232 21.1187 21.0952C20.7586 21.4674 20.1798 21.5 19.7817 21.186L19.7046 21.1187L16.8901 18.396C15.3881 19.5745 13.4972 20.2798 11.4399 20.2798C6.55782 20.2797 2.6001 16.3221 2.6001 11.4399C2.60018 6.55787 6.55787 2.60018 11.4399 2.6001C16.3221 2.6001 20.2797 6.55782 20.2798 11.4399Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <input
                                        autoFocus
                                        value={wardSearch}
                                        onChange={(e) =>
                                            setWardSearch(e.target.value)
                                        }
                                        placeholder="Tìm phường xã"
                                    />
                                </div>

                                <div className="chose-type__box select-region__box">
                                    {filteredWards.map((ward) => (
                                        <div
                                            key={ward.id}
                                            className="chose-type__box--section"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectWard(ward);
                                            }}
                                        >
                                            <div className="box-section">
                                                <div className="box-section__title">
                                                    {ward.ward_name}
                                                </div>

                                                <div className="box-section__checkbox">
                                                    <label className="box-section__lable">
                                                        <input
                                                            hidden
                                                            readOnly
                                                            type="radio"
                                                            name="ward"
                                                            className="box-section__input"
                                                            checked={
                                                                selectedWard?.id ===
                                                                ward.id
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
                            </div>
                        )}
                    </div>

                    {errors?.ward_id && (
                        <span
                            className="post-form__field--error-text"
                            style={{ margin: '10px 12px 0' }}
                        >
                            {errors.ward_id}
                        </span>
                    )}
                </div>

                {/* Số nhà / Tên đường */}
                <div className="address-panel__field address-panel__field--street">
                    <span className="post-form__label address-panel__label">
                        Số nhà / Tên đường
                    </span>
                    <div className="address-panel__control">
                        <input
                            type="text"
                            placeholder="Nhập số nhà/ tên đường"
                            value={street}
                            onChange={(e) => {
                                setStreet(e.target.value);

                                if (errors.street) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        street: null,
                                    }));
                                }
                            }}
                            disabled={!selectedCity || !selectedWard}
                            style={{
                                cursor:
                                    !selectedCity || !selectedWard
                                        ? 'default'
                                        : 'text',
                            }}
                            className={`post-form__input--address ${errors?.street ? 'post-form__field--error' : ''}`}
                        />
                    </div>

                    {errors?.street && (
                        <span
                            className="post-form__field--error-text"
                            style={{ margin: '10px 12px 0' }}
                        >
                            {errors.street}
                        </span>
                    )}
                </div>

                {/* Địa chỉ hiển thị trên tin đăng */}
                <div className="address-panel__field address-panel__field--display">
                    <span className="address-panel__label">
                        Địa chỉ hiển thị trên tin đăng
                    </span>
                    <div className="address-panel__control">
                        <input
                            readOnly
                            value={displayAddress}
                            type="text"
                            placeholder="Địa chỉ hiển thị"
                            className="post-form__input--address"
                            disabled={true}
                        />
                    </div>
                </div>

                {/* Chọn vị trí trên bản đồ */}
                <div className="address-panel__field address-panel__field--map">
                    <span className="address-panel__label">
                        Chọn vị trí trên bản đồ
                    </span>
                    <div className="address-panel__map">
                        <MapView
                            lat={lat}
                            lng={lng}
                            draggable={true}
                            onChange={handleMapChange}
                            zoom={12}
                        />
                    </div>
                </div>
            </div>

            {/* Phần submit */}
            <div className="address-panel__button--submit">
                <button
                    className="address-panel__button--submit-return"
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    Quay lại
                </button>

                <button
                    className="address-panel__button--submit-primary"
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmAddress();
                    }}
                >
                    Xác nhận
                </button>
            </div>
        </div>
    );
}

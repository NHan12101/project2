import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

export default function SelectRegion({ selectRef, setOpenSelect, setSelectedRegionTitle }) {
    const [cities, setCities] = useState([]);
    const [wards, setWards] = useState([]);

    const [search, setSearch] = useState('');

    const [selectedCity, setSelectedCity] = useState({ id: 'all', name: 'Toàn quốc' });
    const [selectedWard, setSelectedWard] = useState({ id: null, name: 'Tất cả' });

    const [mode, setMode] = useState('none'); // none | city | ward

    // ========== NORMALIZE =================
    const normalizeText = (text) =>
        text
            ?.normalize('NFD')                       // 1. Tách ký tự có dấu thành ký tự + dấu
            .replace(/[\u0300-\u036f]/g, '')         // 2. Loại bỏ toàn bộ dấu
            .replace(/\s+/g, '')                     // 3. Xoá mọi khoảng trắng
            .toLowerCase()                           // 4. Chuyển thành chữ thường
        || '';


    // ========== LOAD CITY =============
    useEffect(() => {
        axios
            .get('/api/regions/cities')
            .then((res) => setCities(res.data))
            .catch(console.error);
    }, []);

    // ========= LOAD WARD KHI CITY ĐỔI ==============
    useEffect(() => {
        if (selectedCity.id === 'all') {
            setWards([]);
            return;
        }
        axios
            .get(`/api/regions/wards/${selectedCity.id}`)
            .then((res) => setWards(res.data))
            .catch(console.error);
    }, [selectedCity]);

    // =========== FILTER =================
    const filteredCities = useMemo(() => {
        const s = normalizeText(search);
        return cities.filter((c) => normalizeText(c.name).includes(s));
    }, [search, cities]);

    const filteredWards = useMemo(() => {
        const s = normalizeText(search);
        return wards.filter((w) => normalizeText(w.ward_name).includes(s));
    }, [search, wards]);

    // =========== HANDLERS =================
    function handleSelectCity(city) {
        setSelectedCity(city);
        setSelectedWard({ id: null, name: 'Tất cả' });
        setMode('none');
    };

    function handleSelectAll() {
        setSelectedCity({ id: 'all', name: 'Toàn quốc' });
        setSelectedWard({ id: null, name: 'Tất cả' });
        setMode('none');
    };

    function handleSelectWardAll() {
        setSelectedWard({ id: null, name: 'Tất cả' });
        setMode('none');
    };

    function handleSelectWard(w) {
        setSelectedWard({
            id: w.id,
            name: w.ward_name,
        });
        setMode('none');
    };

    // ========== RESET SEARCH MỖI LẦN ĐỔI TAB ================
    useEffect(() => {
        setSearch('');
    }, [mode]);

    function handleApply() {
        // Lưu region vào localStorage
        localStorage.setItem(
            'selected-region',
            JSON.stringify({
                city: selectedCity,
                ward: selectedWard,
            })
        );

        if (selectedCity && selectedCity.id !== 'all' && !selectedWard.id) {
            setSelectedRegionTitle(selectedCity.name);
        } else if (selectedWard && selectedWard.id) {
            setSelectedRegionTitle(selectedWard.name);
        } else {
            setSelectedRegionTitle('Chọn khu vực');
        }

        setOpenSelect(false);
    }

    useEffect(() => {
        const saved = localStorage.getItem('selected-region');
        if (saved) {
            const { city, ward } = JSON.parse(saved);

            if (city) setSelectedCity(city);
            if (ward) setSelectedWard(ward);
        }
    }, []);


    const Radio = () => (
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
    );

    return (
        <div ref={selectRef} className="select-region__container">
            {/* ================= HEADER =============== */}
            <div className="select-region__heading">
                {mode !== 'none' &&
                    <svg
                        onClick={() => setMode('none')}
                        data-type="monochrome" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M10.5167 7.24032C10.9015 6.91029 11.4816 6.91847 11.8566 7.27547C12.2565 7.65636 12.2716 8.28961 11.8908 8.68954L9.33315 11.3751H17.0001L17.1027 11.38C17.6068 11.4313 18.0001 11.8574 18.0001 12.3751C18.0001 12.8928 17.6068 13.3189 17.1027 13.3702L17.0001 13.3751H9.33315L11.8908 16.0606L11.9582 16.1378C12.2688 16.5382 12.2315 17.1176 11.8566 17.4747C11.4816 17.8317 10.9015 17.8399 10.5167 17.5098L10.4425 17.4395L6.27554 13.0645C5.90815 12.6784 5.90815 12.0717 6.27554 11.6856L10.4425 7.31063L10.5167 7.24032Z" fill="currentColor">
                        </path>
                    </svg>
                }
                <span>
                    {mode === 'city' ? 'Tỉnh thành' : mode === 'ward' ? 'Phường xã' : 'Khu vực'}
                </span>
            </div>

            <div className="select-region__content">
                {mode !== 'none' && (
                    <div className="select-region__content--search">
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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={mode === 'city' ? 'Tìm tỉnh thành' : 'Tìm phường xã'}
                        />
                    </div>
                )}

                {/* ================= LIST CITY ================= */}
                {mode === 'city' && (
                    <div className="chose-type__box select-region__box">
                        {filteredCities.map((city) => (
                            <div key={city.id} className="chose-type__box--section" onClick={() => handleSelectCity(city)}>
                                <div className="box-section">
                                    <div className="box-section__title">{city.name}</div>

                                    <div className="box-section__checkbox">
                                        <label className="box-section__lable">
                                            <input
                                                hidden
                                                readOnly
                                                type="radio"
                                                name="city"
                                                className="box-section__input"
                                                checked={selectedCity.id === city.id}
                                            />
                                            <Radio />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Toàn quốc */}
                        <div
                            className="chose-type__box--section"
                            onClick={handleSelectAll}
                        >
                            <div className="box-section">
                                <div className="box-section__title">Toàn quốc</div>
                                <div className="box-section__checkbox">
                                    <label className="box-section__lable">
                                        <input
                                            hidden
                                            readOnly
                                            type="radio"
                                            name="city"
                                            className="box-section__input"
                                            checked={selectedCity.id === 'all'}
                                        />
                                        <Radio />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= LIST WARD ================= */}
                {mode === 'ward' && (
                    <div className="chose-type__box select-region__box">
                        {/* Tất cả */}
                        <div className="chose-type__box--section" onClick={handleSelectWardAll}>
                            <div className="box-section">
                                <div className="box-section__title">Tất cả</div>
                                <div className="box-section__checkbox">
                                    <label className="box-section__lable">
                                        <input
                                            hidden
                                            readOnly
                                            type="radio"
                                            name="ward"
                                            className="box-section__input"
                                            checked={selectedWard.id === null}
                                        />
                                        <Radio />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {filteredWards.map((w) => (
                            <div key={w.id} className="chose-type__box--section" onClick={() => handleSelectWard(w)}>
                                <div className="box-section">
                                    <div className="box-section__title">{w.ward_name}</div>

                                    <div className="box-section__checkbox">
                                        <label className="box-section__lable">
                                            <input
                                                hidden
                                                readOnly
                                                type="radio"
                                                name="ward"
                                                className="box-section__input"
                                                checked={selectedWard.id === w.id}
                                            />
                                            <Radio />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ================= SELECT BOXES ================= */}
                {mode === 'none' && (
                    <>
                        <div className="select-region__content--city" onClick={() => setMode('city')}>
                            <div className="select-region__content--city1">
                                <div>{selectedCity.name}</div>
                                <label>Chọn tỉnh thành</label>
                                <span>
                                    <svg data-type="monochrome" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em"
                                        fill="none"><g fill="currentColor">
                                            <path d="M12.4495 14.8316C12.2013 15.0561 11.7987 15.0561 11.5505 14.8316L6.18623 9.98133C6.0044 9.81692 5.95001 9.56967 6.04841 9.35486C6.14682 9.14006 6.37864 9 6.63578 9L17.3642 9C17.6214 9 17.8532 9.14006 17.9516 9.35487C18.05 9.56967 17.9956 9.81693 17.8138 9.98133L12.4495 14.8316Z"></path></g>
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div className={`select-region__content--city ${selectedCity.id === 'all' ? 'disabled' : ''}`}
                            onClick={() => selectedCity.id !== 'all' && setMode('ward')}
                        >
                            <div className="select-region__content--city1">
                                <div>{selectedWard.name}</div>
                                <label>Chọn phường xã</label>
                                <span>
                                    <svg data-type="monochrome" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em"
                                        fill="none"><g fill="currentColor">
                                            <path d="M12.4495 14.8316C12.2013 15.0561 11.7987 15.0561 11.5505 14.8316L6.18623 9.98133C6.0044 9.81692 5.95001 9.56967 6.04841 9.35486C6.14682 9.14006 6.37864 9 6.63578 9L17.3642 9C17.6214 9 17.8532 9.14006 17.9516 9.35487C18.05 9.56967 17.9956 9.81693 17.8138 9.98133L12.4495 14.8316Z"></path></g>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {mode === 'none' && (
                <div className="select-region__button" onClick={handleApply}>
                    <button className="select-region__button--submit">
                        Áp dụng
                    </button>
                </div>
            )}
        </div>
    );
}

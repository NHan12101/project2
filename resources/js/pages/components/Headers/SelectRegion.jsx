import React, { useState } from "react";

const locations = {
  "Hà Nội": {
    "Quận Ba Đình": ["Phường Phúc Xá", "Phường Trúc Bạch"],
    "Quận Hoàn Kiếm": ["Phường Hàng Bạc", "Phường Lý Thái Tổ"],
  },
  "TP Hồ Chí Minh": {
    "Quận 1": ["Phường Bến Nghé", "Phường Đa Kao"],
    "Quận 3": ["Phường Võ Thị Sáu", "Phường 7"],
  },
};

export default function SelectRegion({ selectRef }) {
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');

    const handleApply = () => {
        // alert(`Bạn đã chọn: ${province} - ${district} - ${ward}`);
    };

    const provinces = Object.keys(locations);
    const districts = province ? Object.keys(locations[province]) : [];
    const wards = district ? locations[province][district] : [];

    return (
        <div ref={selectRef} className="select-region__container">
            <div className="select-region__heading">
                <span>Khu vực</span>
            </div>

            <div className="select-region__content">
                <div className="select-region__content--selceted">

                    <select
                        value={province}
                        onChange={(e) => {
                            setProvince(e.target.value);
                            setDistrict('');
                            setWard('');
                        }}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                        }}
                    >
                        <option value="">Chọn tỉnh thành</option>
                        <option value="Toàn quốc">Toàn quốc</option>
                        {provinces.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>

                    <select
                        value={district}
                        onChange={(e) => {
                            setDistrict(e.target.value);
                            setWard('');
                        }}
                        disabled={!province || province === 'Toàn quốc'}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            background:
                                !province || province === 'Toàn quốc'
                                    ? '#f1f1f1'
                                    : 'white',
                        }}
                    >
                        <option value="">Chọn quận huyện</option>
                        {districts.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>

                    <select
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        disabled={!district}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '14px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            background: !district ? '#f1f1f1' : 'white',
                        }}
                    >
                        <option value="">Chọn phường xã</option>
                        {wards.map((w) => (
                            <option key={w} value={w}>
                                {w}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleApply}
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
}

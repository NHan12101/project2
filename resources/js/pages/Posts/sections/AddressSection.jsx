import useDropdown from '@/hooks/useDropdown.js';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import MapView from '../../MapView';
import AddressModal from '../modals/AddressModal';

export default function AddressSection({ form, cities }) {
    const { data, errors, clearErrors } = form;

    const [openAddress, setOpenAddress] = useState(true);
    const { menuRef, open, setOpen } = useDropdown();

    useEffect(() => {
        if (
            data.category_id ||
            data.area ||
            data.price ||
            data.title ||
            data.description
        ) {
            setOpenAddress(false);
        }
    }, [data.category_id, data.area, data.price, data.title, data.description]);

    useEffect(() => {
        if (errors?.address) {
            setOpenAddress(true);
        }
    }, [errors?.address]);

    return (
        <>
            <div
                className="post-form__field"
                onClick={() => setOpenAddress(true)}
                style={{ cursor: openAddress ? 'default' : 'pointer' }}
            >
                <div
                    className="post-form__field--type"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenAddress((pre) => !pre);
                    }}
                >
                    <span className="post-form__label">Địa chỉ</span>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        {errors?.address && (
                            <img src="/icons/icon-error.svg" alt="error" />
                        )}
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`dropdown-icon arrow ${openAddress ? 'rotate' : ''}`}
                        />
                    </div>
                </div>

                {openAddress ? (
                    <>
                        <div
                            className="post-form__control"
                            style={{
                                display: data.address ? 'none' : 'flex',
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(true);
                            }}
                        >
                            <img
                                src="/icons/icon-search.svg"
                                alt="search"
                                className="post-form__control-icon"
                            />
                            <input
                                readOnly
                                type="text"
                                placeholder="Nhập địa chỉ"
                                className="post-form__input"
                            />
                        </div>

                        {errors?.address && (
                            <span className="post-form__field--error-text">
                                {errors?.address}
                            </span>
                        )}

                        {data.address && (
                            <>
                                <div
                                    className="post-form__field--type"
                                    style={{ marginTop: 16, cursor: 'default' }}
                                >
                                    <span
                                        className="post-form__options--address"
                                        style={{
                                            fontSize: '1.5rem',
                                            margin: 0,
                                        }}
                                    >
                                        {data.address}
                                    </span>

                                    <div
                                        className="address-panel__edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpen(true);
                                        }}
                                    >
                                        <img
                                            src="/icons/edit-pen.svg"
                                            alt="edit"
                                        />
                                    </div>
                                </div>

                                <div
                                    className="address-panel__map"
                                    style={{ height: 360 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MapView
                                        lat={data.latitude}
                                        lng={data.longitude}
                                        zoom={16}
                                    />
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div style={{ marginTop: 16 }}>
                        <span style={{ fontSize: '1.5rem' }}>
                            {data.address ? data.address : 'Thêm thông tin'}
                        </span>
                    </div>
                )}
            </div>
            {open && (
                <div className="auth-form">
                    <AddressModal
                        form={form}
                        cities={cities}
                        onClear={() => clearErrors()}
                        onClose={() => setOpen(false)}
                        menuRef={menuRef}
                    />
                </div>
            )}
        </>
    );
}

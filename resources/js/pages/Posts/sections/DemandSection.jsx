import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

export default function DemandSection({ form }) {
    const { data, setData, errors, clearErrors } = form;

    const [openDemand, setOpenDemand] = useState(true);

    useEffect(() => {
        if (data.address_detail || data.title || data.description) {
            setOpenDemand(false);
        }
    }, [data.address_detail, data.title, data.description]);

    useEffect(() => {
        if (errors?.type) {
            setOpenDemand(true);
        }
    }, [errors?.type]);

    return (
        <div
            className="post-form__field"
            onClick={() => setOpenDemand(true)}
            style={{ cursor: openDemand ? 'default' : 'pointer' }}
        >
            <div
                className="post-form__field--type"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenDemand((pre) => !pre);
                }}
            >
                <span className="post-form__label">Nhu cầu</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {errors?.type && (
                        <img src="/icons/icon-error.svg" alt="error" />
                    )}
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`dropdown-icon arrow ${openDemand ? 'rotate' : ''}`}
                    />
                </div>
            </div>

            {openDemand ? (
                <div
                    className="post-form__options"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Bán */}
                    <div
                        className={`post-form__option ${
                            data.type === 'sale'
                                ? 'post-form__option--active'
                                : ''
                        }`}
                        onClick={() => {
                            setData('type', 'sale');
                            clearErrors();
                        }}
                        role="button"
                    >
                        <img
                            src={
                                data.type === 'sale'
                                    ? '/icons/icon-sale__active.svg'
                                    : '/icons/icon-sale.svg'
                            }
                            alt="sale"
                        />
                        <span className="post-form__option-text">Bán</span>
                    </div>

                    {/* Cho thuê */}
                    <div
                        className={`post-form__option ${
                            data.type === 'rent'
                                ? 'post-form__option--active'
                                : ''
                        }`}
                        onClick={() => {
                            setData('type', 'rent');
                            clearErrors();
                        }}
                        role="button"
                    >
                        <img
                            src={
                                data.type === 'rent'
                                    ? '/icons/icon-rent__active.svg'
                                    : '/icons/icon-rent.svg'
                            }
                            alt="rent"
                        />
                        <span className="post-form__option-text">Cho thuê</span>
                    </div>

                    {errors?.type && (
                        <span className="post-form__field--error-text">
                            {errors?.type}
                        </span>
                    )}
                </div>
            ) : (
                <div className="post-form__options">
                    <span style={{ fontSize: '1.5rem' }}>
                        {data.type === 'sale'
                            ? 'Bán'
                            : data.type === 'rent'
                              ? 'Cho thuê'
                              : 'Thêm thông tin'}
                    </span>
                </div>
            )}
        </div>
    );
}

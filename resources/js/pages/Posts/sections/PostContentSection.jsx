import useDropdown from '@/hooks/useDropdown';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import AIModal from '../modals/AIModal';

export default function PostContentSection({ form }) {
    const { data, setData, errors, clearErrors } = form;

    const [open, setOpen] = useState(true);
    const [userTriggeredOpen, setUserTriggeredOpen] = useState(false);

    const {
        menuRef: selectRef,
        open: openAI,
        setOpen: setOpenAI,
    } = useDropdown();

    const [aiResult, setAiResult] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);

    const handleGenerateAI = async () => {
        setLoadingAI(true);

        // demo fake data – sau này gọi API thật
        setTimeout(() => {
            setAiResult({
                title: 'Cho thuê căn hộ 33m² full nội thất, giá tốt',
                description:
                    'Căn hộ thiết kế hiện đại, diện tích 33m², đầy đủ nội thất, vị trí thuận tiện di chuyển, phù hợp sinh viên và người đi làm.',
            });
            setLoadingAI(false);
        }, 1200);
    };

    const sectionRef = useRef(null);
    const hasScrolledRef = useRef(false);

    useEffect(() => {
        if (!open || !sectionRef.current || !userTriggeredOpen) return;

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

        // reset flag để lần sau mở tự động không scroll
        setUserTriggeredOpen(false);
    }, [open]);

    useEffect(() => {
        if (!open) {
            hasScrolledRef.current = false;
        }
    }, [open]);

    const hasError = errors?.title || errors?.description;
    useEffect(() => {
        if (hasError) {
            setOpen(true);
        }
    }, [errors]); // Chỉ phụ thuộc vào `errors` thay vì từng trường riêng

    // Bắt lỗi phần nhập quá ký tự
    // Tiêu đề
    const titleLength = data.title?.length || 0;
    const isTitleInvalid = titleLength > 0 && titleLength > 88;

    // Mô tả
    const descLength = data.description?.length || 0;
    const isDescInvalid = descLength > 0 && descLength > 2000;

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
                    setUserTriggeredOpen(true); // đánh dấu là do user click
                }}
            >
                <span className="post-form__label">
                    Nội dung tiêu đề & mô tả
                </span>
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
                    {/* Tạo nhanh với AI */}
                    <div className="create-with-AI">
                        <span className="address-panel__label">
                            Tạo nhanh với AI
                        </span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenAI((pre) => !pre);
                            }}
                        >
                            <img src="/icons/gemini.svg" alt="AI" />
                            <span>Tạo với AI</span>
                        </button>
                    </div>

                    {openAI && (
                        <AIModal
                            selectRef={selectRef}
                            onClose={() => setOpenAI(false)}
                            aiResult={aiResult}
                            loading={loadingAI}
                            onGenerate={handleGenerateAI}
                        />
                    )}

                    {/* Tiêu đề */}
                    <div className="address-panel__field">
                        <span className="post-form__label address-panel__label">
                            Tiêu đề
                        </span>
                        <div
                            className="address-panel__control--title"
                            style={{ position: 'relative' }}
                        >
                            <textarea
                                rows={3}
                                placeholder="Mô tả ngắn gọn về loại hình bất động sản, diện tích, địa chỉ, (VD: Cho thuê căn hộ 30m2 tại TP.Hồ Chí Minh"
                                className={`post-form__input--title ${
                                    errors?.title || isTitleInvalid
                                        ? 'post-form__field--error'
                                        : ''
                                }`}
                                value={data.title || ''}
                                onChange={(e) => {
                                    setData('title', e.target.value);
                                    clearErrors('title');
                                }}
                            />
                        </div>

                        {errors?.title ? (
                            <span className="post-form__field--error-text">
                                {errors?.title}
                            </span>
                        ) : (
                            <span
                                className="post-form__field--error-text"
                                style={{
                                    color:
                                        titleLength <= 88
                                            ? '#5a6067'
                                            : '#c80000',
                                }}
                            >
                                {titleLength === 0
                                    ? 'Tối thiểu 30 ký tự, tối đa 88 ký tự'
                                    : `${titleLength}/88`}
                            </span>
                        )}
                    </div>

                    {/* Mô tả */}
                    <div className="address-panel__field">
                        <span className="post-form__label address-panel__label">
                            Mô tả
                        </span>
                        <div
                            className="address-panel__control--desc"
                            style={{ position: 'relative' }}
                        >
                            <textarea
                                type="text"
                                placeholder={`Mô tả chi tiết về: 
    • Loại hình bất động sản
    • Vị trí
    • Diện tích, tiện ích
    • Tình trạng nội thất
    ...
(VD: Khu nhà có vị trí thuận lợi, gần công viên, trường học...)`}
                                className={`post-form__input--title ${
                                    errors?.description || isDescInvalid
                                        ? 'post-form__field--error'
                                        : ''
                                }`}
                                value={data.description || ''}
                                onChange={(e) => {
                                    setData('description', e.target.value);
                                    clearErrors('description');
                                }}
                            />
                        </div>

                        {errors?.description ? (
                            <span className="post-form__field--error-text">
                                {errors?.description}
                            </span>
                        ) : (
                            <span
                                className="post-form__field--error-text"
                                style={{
                                    color:
                                        descLength <= 2000
                                            ? '#5a6067'
                                            : '#c80000',
                                }}
                            >
                                {descLength === 0
                                    ? 'Tối thiểu 30 ký tự, tối đa 2000 ký tự'
                                    : `${descLength}/2000`}
                            </span>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: 16 }}>
                    {data.title || data.description ? (
                        <div className="post-content-preview__content">
                            <div className="post-content-preview__item">
                                <h3 className="post-content-preview__label">
                                    Tiêu đề
                                </h3>
                                <p className="post-content-preview__text">
                                    {data.title}
                                </p>
                            </div>

                            <div className="post-content-preview__item">
                                <h3 className="post-content-preview__label">
                                    Mô tả
                                </h3>
                                <p className="post-content-preview__text">
                                    {data.description}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <span style={{ fontSize: '1.5rem' }}>
                            Thêm thông tin
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

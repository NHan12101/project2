export default function AIModal({
    selectRef,
    onClose,
    aiResult,
    onGenerate,
    handleContent,
    loading,
}) {
    return (
        <div className="auth-form">
            <div
                ref={selectRef}
                className="address-panel"
                style={{ height: 'auto', width: 680 }}
            >
                {/* Header */}
                <div className="address-panel__header">
                    <h1 className="address-panel__title">Tạo với AI</h1>
                    <button
                        type="button"
                        className="address-panel__close"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div
                    style={{
                        padding: 20,
                    }}
                >
                    {/* Action */}
                    {aiResult?.title == null && (
                        <button
                            type="button"
                            className={`ai-generate ${loading ? 'loading' : ''}`}
                            onClick={onGenerate}
                            disabled={loading}
                        >
                            {loading ? 'Đang tạo nội dung...' : 'Tạo gợi ý'}
                        </button>
                    )}

                    {aiResult?.title && aiResult?.description && (
                        <div
                            style={{
                                border: '2px solid #000',
                                borderRadius: '18px',
                                padding: '26px 22px',
                                marginBottom: 16,
                            }}
                        >
                            {/* Title */}
                            <div className="ai-card">
                                <div className="ai-card-header">
                                    <span>Tiêu đề gợi ý</span>
                                </div>
                                <div className="ai-card-content">
                                    {aiResult.title}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="ai-card">
                                <div className="ai-card-header">
                                    <span>Mô tả gợi ý</span>
                                </div>
                                <pre className="ai-card-content">
                                    {aiResult.description}
                                </pre>
                            </div>

                            {/* Action */}
                            <button
                                type="button"
                                className={`rewrite ${loading ? 'loading' : ''}`}
                                onClick={onGenerate}
                                disabled={loading}
                            >
                                {loading ? (
                                    'AI đang viết ...'
                                ) : (
                                    <span>
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 25 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            data-automation-id="svg-icon"
                                            da-id="svg-icon"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M3.71094 12C3.71094 16.9706 7.74037 21 12.7109 21C15.2379 21 17.5666 19.9576 19.2228 18.2768V20.25C19.2228 20.6642 19.5586 21 19.9728 21C20.387 21 20.7228 20.6642 20.7228 20.25V17C20.7228 16.1716 20.0512 15.5 19.2228 15.5H15.9728C15.5586 15.5 15.2228 15.8358 15.2228 16.25C15.2228 16.6642 15.5586 17 15.9728 17H18.3661C16.9753 18.5332 14.9348 19.5 12.7109 19.5C8.5688 19.5 5.21094 16.1421 5.21094 12C5.21094 11.6819 5.2307 11.3687 5.269 11.0616C5.32026 10.6505 5.0286 10.2758 4.61757 10.2245C4.20654 10.1733 3.83178 10.4649 3.78053 10.8759C3.73457 11.2445 3.71094 11.6197 3.71094 12ZM20.8043 13.7755C21.2153 13.8267 21.5901 13.5351 21.6413 13.1241C21.6873 12.7555 21.7109 12.3803 21.7109 12C21.7109 7.02944 17.6815 3 12.7109 3C10.19 3 7.86634 4.03743 6.21094 5.71122V3.75C6.21094 3.33579 5.87515 3 5.46094 3C5.04672 3 4.71094 3.33579 4.71094 3.75V7C4.71094 7.82843 5.38251 8.5 6.21094 8.5H9.46094C9.87515 8.5 10.2109 8.16421 10.2109 7.75C10.2109 7.33579 9.87515 7 9.46094 7H7.05574C8.44655 5.46681 10.4871 4.5 12.7109 4.5C16.8531 4.5 20.2109 7.85786 20.2109 12C20.2109 12.3181 20.1912 12.6313 20.1529 12.9384C20.1016 13.3495 20.3933 13.7242 20.8043 13.7755Z"
                                                fill="url(#paint0_linear_18248_142926)"
                                            ></path>
                                            <defs>
                                                <linearGradient
                                                    id="paint0_linear_18248_142926"
                                                    x1="3.71094"
                                                    y1="21"
                                                    x2="21.9024"
                                                    y2="20.8044"
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop stopColor="#9C24FF"></stop>
                                                    <stop
                                                        offset="1"
                                                        stopColor="#5A00A3"
                                                    ></stop>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        Viết lại
                                    </span>
                                )}
                            </button>
                        </div>
                    )}

                    {aiResult && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <p className="ai-note">
                                Gợi ý từ AI. Bạn có thể chỉnh sửa lại trước khi
                                đăng bài.
                            </p>

                            <button
                                type="button"
                                className="apply-content"
                                onClick={() => handleContent(aiResult)}
                            >
                                Sử dụng
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

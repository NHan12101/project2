export default function AIModal({
    selectRef,
    onClose,
    aiResult, // { title, description }
    onGenerate, // function gọi AI
    loading,
}) {
    return (
        <div className="auth-form">
            <div className="address-panel" ref={selectRef}>
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

                {/* Body */}
                <div className="address-panel__body">
                    {/* Action */}
                    <button
                        type="button"
                        className="ai-generate-btn"
                        onClick={onGenerate}
                        disabled={loading}
                    >
                        {loading ? 'Đang tạo...' : 'Tạo gợi ý'}
                    </button>

                    {/* Gợi ý tiêu đề */}
                    {aiResult?.title && (
                        <div className="ai-suggest-block">
                            <span className="ai-suggest-label">
                                Gợi ý tiêu đề
                            </span>
                            <div className="ai-suggest-content">
                                {aiResult.title}
                            </div>
                        </div>
                    )}

                    {/* Gợi ý mô tả */}
                    {aiResult?.description && (
                        <div className="ai-suggest-block">
                            <span className="ai-suggest-label">
                                Gợi ý mô tả
                            </span>
                            <div className="ai-suggest-content">
                                {aiResult.description}
                            </div>
                        </div>
                    )}

                    <p className="ai-note">
                        💡 Gợi ý từ AI. Bạn có thể copy và chỉnh sửa lại cho phù
                        hợp.
                    </p>
                </div>
            </div>
        </div>
    );
}

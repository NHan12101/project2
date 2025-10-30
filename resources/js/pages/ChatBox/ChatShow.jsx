import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { FaImage } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import echo from '../../utils/echo.js';

export default function ChatShow({ conversationId, userId, conversations }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [previewImages, setPreviewImages] = useState([]); // Danh sách ảnh trong modal
    const [currentIndex, setCurrentIndex] = useState(0); // Ảnh đang xem
    const [isSending, setIsSending] = useState(false);

    const scrollRef = useRef(null);
    const fileRef = useRef(null);
    // Lấy ra conversation hiện tại
    const currentConversation = conversations?.find(
        (c) => c.id === conversationId,
    );

    // Xác định đối phương (người đang chat cùng)
    const partner =
        currentConversation?.user_one_id === userId
            ? currentConversation?.user_two
            : currentConversation?.user_one;

    useEffect(() => {
        if (!conversationId) return;
        setMessages([]);
        axios
            .get(`/conversations/${conversationId}/messages?user_id=${userId}`)
            .then((res) => setMessages(res.data))
            .catch((err) => console.error('Error loading messages:', err));
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId) return;

        const channelName = `chat.${conversationId}`;
        const channel = echo.channel(channelName);

        channel.listen('.message.sent', (data) => {
            setMessages((prev) => {
                if (prev.some((m) => m.id === data.id)) return prev;
                return [...prev, data];
            });
        });

        return () => {
            echo.leave(channelName);
        };
    }, [conversationId]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timeout);
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (isSending) return; // Nếu đang gửi thì không cho gửi tiếp
        if (!text.trim() && attachments.length === 0) return;

        setIsSending(true); // Bắt đầu gửi

        const formData = new FormData();
        formData.append('conversation_id', conversationId);
        formData.append('message', text);
        attachments.forEach((file) => formData.append('attachments[]', file));

        try {
            const res = await axios.post(
                `/messages/send?user_id=${userId}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );
            setMessages((prev) => [...prev, res.data]);
            setText('');
            setAttachments([]);
            if (fileRef.current) fileRef.current.value = '';
        } catch (err) {
            console.error('Send message failed:', err);
        } finally {
            setIsSending(false); // Cho phép gửi lại sau khi xong
        }
    };

    const handleKeyDown = (e) => {
        if (isSending) return; // Đang gửi thì không xử lý phím
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(e);
        }
    };

    return (
        <div className="chat-container__show">
            <div className="message-info-user">
                {partner ? (
                    <div className="chat-user-header">
                        <img
                            src={partner.avatar}
                            alt={partner.name}
                            className="conversation-list__avatart"
                            style={{
                                objectFit: 'cover',
                            }}
                        />
                        <div>
                            <h3
                                style={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                {partner.name}
                            </h3>
                        </div>
                    </div>
                ) : (
                    <div>Đang tải thông tin...</div>
                )}
            </div>

            <div className="message-list">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`message-item ${
                            msg.sender_id === userId ? 'own' : 'other'
                        }`}
                    >
                        <div className="message-info">
                            <span>
                                {new Date(msg.created_at).toLocaleString(
                                    'vi-VN',
                                )}
                            </span>
                        </div>
                        <div
                            className={`message-bubble ${
                                msg.sender_id === userId
                                    ? 'bubble-own'
                                    : 'bubble-other'
                            }`}
                        >
                            {msg.message && (
                                <div style={{ fontSize: '1.8rem', }}>
                                    <p style={{textAlign: 'left'}}>{msg.message}</p>
                                </div>
                            )}
                            {msg.attachments?.length > 0 && (
                                <div className="message-images">
                                    {msg.attachments.map((img, i) => (
                                        <img
                                            key={i}
                                            src={`/storage/${img}`}
                                            alt="attachment"
                                            onClick={() => {
                                                setPreviewImages(
                                                    msg.attachments.map(
                                                        (a) => `/storage/${a}`,
                                                    ),
                                                ); // danh sách ảnh của tin nhắn đó
                                                setCurrentIndex(i); // ảnh được click là ảnh đang xem
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                maxWidth: '150px',
                                                borderRadius: '8px',
                                                marginRight: '5px',
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef}></div>
            </div>

            <form onSubmit={sendMessage} className="chat-form">
                {/* ===== Phần xem trước hình ảnh trước khi gửi ===== */}
                {attachments.length > 0 && (
                    <div className="preview-container">
                        {attachments.map((file, index) => {
                            const imageUrl = URL.createObjectURL(file);
                            return (
                                <div key={index} className="preview-item">
                                    <img
                                        src={imageUrl}
                                        alt={`preview-${index}`}
                                    />
                                    <button
                                        type="button"
                                        className="remove-preview"
                                        onClick={() => {
                                            const newFiles = attachments.filter(
                                                (_, i) => i !== index,
                                            );
                                            setAttachments(newFiles);
                                            if (
                                                newFiles.length === 0 &&
                                                fileRef.current
                                            )
                                                fileRef.current.value = '';
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="chat-form-bottom">
                    <textarea
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn..."
                        style={{ color: 'var(--text-color)' }}
                    />

                    <button
                        type="submit"
                        disabled={!text.trim() && attachments.length === 0}
                        className="send-button"
                    >
                        <span>
                            <IoSend size={36} style={{ marginRight: '5px' }} />
                        </span>
                    </button>
                </div>

                <div className="file-upload-wrapper">
                    <input
                        ref={fileRef}
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={(e) =>
                            setAttachments(Array.from(e.target.files))
                        }
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload" className="file-upload-button">
                        <FaImage style={{ marginRight: '8px' }} /> Hình ảnh
                    </label>
                </div>
            </form>

            {/* ============== Phần xem hình ảnh đã được gửi =================== */}
            {previewImages.length > 0 && (
                <div
                    className="image-preview-overlay"
                    onClick={() => setPreviewImages([])}
                >
                    <div
                        className="image-preview-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="arrow-button left"
                            onClick={() =>
                                setCurrentIndex((prev) =>
                                    prev === 0
                                        ? previewImages.length - 1
                                        : prev - 1,
                                )
                            }
                        >
                            ❮
                        </button>

                        <img
                            src={previewImages[currentIndex]}
                            alt="Preview"
                            className="preview-image"
                        />

                        <button
                            className="arrow-button right"
                            onClick={() =>
                                setCurrentIndex((prev) =>
                                    prev === previewImages.length - 1
                                        ? 0
                                        : prev + 1,
                                )
                            }
                        >
                            ❯
                        </button>

                        <button
                            className="close-button-img"
                            onClick={() => setPreviewImages([])}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

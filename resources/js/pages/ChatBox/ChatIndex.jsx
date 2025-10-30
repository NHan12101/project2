import axios from 'axios';
import { useEffect, useState } from 'react';
import echo from '../../utils/echo.js';
import Navbar from '../components/Headers/Navbar/Navbar.jsx';
import './ChatIndex.css';
import ChatShow from './ChatShow.jsx';

export default function ChatIndex({ userId }) {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);

    useEffect(() => {
        axios.get(`/conversations?user_id=${userId}`).then((res) => {
            setConversations(res.data);

            // 🔹 Kiểm tra query ?open=
            const params = new URLSearchParams(window.location.search);
            const openId = params.get('open');
            if (openId) {
                const conv = res.data.find((c) => c.id === parseInt(openId));
                if (conv) setSelectedConversation(conv);
            }
        });
    }, [userId]);

    useEffect(() => {
        const channel = echo.channel('chat.global');

        channel.listen('.message.sent', (data) => {
            setConversations((prev) => {
                const exists = prev.find((c) => c.id === data.conversation_id);
                if (exists) {
                    // Nếu cuộc trò chuyện đã có → cập nhật + đưa lên đầu
                    const updated = prev.map((c) =>
                        c.id === data.conversation_id
                            ? { ...c, messages_count: c.messages_count + 1 }
                            : c,
                    );
                    return [
                        updated.find((c) => c.id === data.conversation_id),
                        ...updated.filter((c) => c.id !== data.conversation_id),
                    ];
                } else {
                    // Nếu là cuộc trò chuyện mới (người lạ gửi)
                    axios
                        .get(
                            `/conversations/${data.conversation_id}?user_id=${userId}`,
                        )
                        .then((res) => {
                            setConversations((prev) => [res.data, ...prev]);
                        });
                    return prev;
                }
            });
        });

        return () => {
            echo.leave('chat.global');
        };
    }, [userId]);

    return (
        <>
            <Navbar />
            <div className="chat-container">
                <div className="conversation-list">
                    <div className="conversation-list__title">
                        <h1>Chats</h1>
                        <span className="dropdown-menu__equally"></span>
                    </div>
                    <div className="conversation-list__content">
                        {conversations.length === 0 ? (
                            <></>
                        ) : (
                            conversations.map((conv) => {
                                const partner =
                                    conv.user_one_id === userId
                                        ? conv.user_two
                                        : conv.user_one;
                                return (
                                    <div
                                        key={conv.id}
                                        onClick={() =>
                                            setSelectedConversation(conv)
                                        }
                                        className={`conversation-list__card ${
                                            selectedConversation?.id === conv.id
                                                ? 'selected-mess'
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="conversation-list__avatart">
                                            <img
                                                src={partner.avatar}
                                                alt={partner.name}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="conversation-list__card--user">
                                                {partner?.name ?? 'Người dùng'}
                                            </h4>
                                            <p className="conversation-list__card--count">
                                                {conv.messages_count} tin nhắn
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {selectedConversation ? (
                    <ChatShow
                        key={selectedConversation.id}
                        conversationId={selectedConversation.id}
                        userId={userId}
                        conversations={conversations}
                    />
                ) : (
                    <div className="conversation-content">
                        <p style={{ fontSize: '2.2rem', fontWeight: '600' }}>
                            👉 Chọn một cuộc trò chuyện để bắt đầu
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

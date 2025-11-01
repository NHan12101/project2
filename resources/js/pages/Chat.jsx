import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import chatbot from '../../../public/images/chatbot.png';
import './Chat.css';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const scrollRef = useRef(null);
    const [isOpenChat, setIsOpenChat] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        setIsOpenChat(true);
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('/chat', {
                messages: newMessages,
            });
            const reply = res.data.content;
            setMessages([
                ...newMessages,
                { role: 'assistant', content: reply },
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timeout);
    }, [messages]);

    return (
        <>
            {open ? (
                <div className="chat-box">
                    <div className="chat-header">
                        <span>🫡 LandMate Assistant</span>
                        <button
                            onClick={() => setOpen(false)}
                            className="chat-close"
                        >
                            ✖
                        </button>
                    </div>

                    <div className="chat-body">
                        {isOpenChat ? (
                            <>
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`chat-msg ${msg.role === 'user' ? 'user' : 'assistant'}`}
                                    >
                                        <strong style={{ fontWeight: 'bold' }}>
                                            {msg.role === 'user' ? '' : 'AI:'}
                                        </strong>{' '}
                                        {msg.content}
                                    </div>
                                ))}
                                {loading && (
                                    <div className="chat-thinking">
                                        Đang suy nghĩ...
                                    </div>
                                )}
                                <div ref={scrollRef}></div>
                            </>
                        ) : (
                            <div
                                style={{
                                    display: 'grid',
                                    placeItems: 'center',
                                    height: '100%',
                                }}
                            >
                                ✋ Bạn muốn mình hỗ trợ gì này 🫡🫡
                            </div>
                        )}
                    </div>

                    <form onSubmit={sendMessage} className="chat-form-ai">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                        />
                        <button type="submit">
                            <span>
                                <IoSend
                                    size={28}
                                    style={{ marginRight: '5px' }}
                                />
                            </span>
                        </button>
                    </form>
                </div>
            ) : (
                <img
                    src={chatbot}
                    alt="chat-ai"
                    className="chat-toggle"
                    onClick={() => {
                        setOpen(!open);
                    }}
                />
            )}
        </>
    );
}

import axios from 'axios';
import { router } from '@inertiajs/react';

export default function ProfileShow({ user, currentUserId }) {
    const handleStartChat = async () => {
        try {
            const res = await axios.post('/conversations/start', {
                receiver_id: user.id,
            });
            const conversationId = res.data.conversation_id;

            // ddoir sang trang ChatIndex và truyền id conversation
            router.visit(`/chatbox?open=${conversationId}`);
        } catch (err) {
            console.error('Error starting conversation:', err);
            alert('Không thể bắt đầu cuộc trò chuyện.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-lg bg-white shadow">
            <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
            <p>Email: {user.email}</p>
            <p>Số điện thoại: {user.phone ?? 'Chưa cập nhật'}</p>
            <p>Địa chỉ: {user.address ?? 'Chưa cập nhật'}</p>

            {currentUserId !== user.id && (
                <div className="mt-6">
                    <button
                        onClick={handleStartChat}
                        className="bg-blue-600 text-white hover:bg-blue-700 rounded-2xl px-4 py-2"
                    >
                        💬 Nhắn tin
                    </button>
                </div>
            )}
        </div>
    );
}

<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;

class MessageSent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        // ✅ Nạp thêm thông tin người gửi để client hiển thị luôn tên, avatar,...
        $this->message = $message->load('sender');
    }

    /**
     * 🔹 Kênh phát sóng (public hoặc private)
     * -> Nếu dùng private channel (bảo mật hơn), thì dùng "PrivateChannel"
     */
    public function broadcastOn()
    {
        return [
            new Channel('chat.' . $this->message->conversation_id),
            new Channel('chat.global'), // 👈 thêm kênh toàn cục
        ];
        // ❗ Nếu bạn dùng private channel: return new PrivateChannel('chat.' . $this->message->conversation_id);
    }

    /**
     * 🔹 Tên sự kiện mà frontend lắng nghe
     */
    public function broadcastAs()
    {
        return 'message.sent';
    }

    /**
     * 🔹 Dữ liệu gửi sang client
     */
    public function broadcastWith()
    {
        return [
            'id' => $this->message->id,
            'conversation_id' => $this->message->conversation_id,
            'sender_id' => $this->message->sender_id,
            'sender' => [
                'id' => $this->message->sender->id,
                'name' => $this->message->sender->name,
                'email' => $this->message->sender->email,
            ],
            'message' => $this->message->message,
            'attachments' => $this->message->attachments ?? [],
            'is_read' => $this->message->is_read,
            'created_at' => $this->message->created_at->timezone('Asia/Ho_Chi_Minh')->format('Y-m-d H:i:s'),
        ];
    }
}

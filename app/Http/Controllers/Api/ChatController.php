<?php

namespace App\Http\Controllers\Api;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\MessageSent;
use App\Http\Controllers\Controller;

class ChatController extends Controller
{
    /**
     * 🔹 Danh sách các cuộc trò chuyện
     */
    public function index(Request $request)
    {
        $userId = Auth::id() ?? $request->query('user_id', 1);

        $conversations = Conversation::where('user_one_id', $userId)
            ->orWhere('user_two_id', $userId)
            ->with(['userOne', 'userTwo'])
            ->withCount('messages')
            ->latest()
            ->get();

        return response()->json($conversations);
    }

    /**
     * 🔹 Lấy toàn bộ tin nhắn trong cuộc trò chuyện
     */
    public function messages(Request $request, $conversationId)
    {
        $userId = Auth::id() ?? $request->query('user_id', 1);

        // Kiểm tra user có thuộc hội thoại không
        $conversation = Conversation::where(function ($q) use ($userId) {
            $q->where('user_one_id', $userId)
                ->orWhere('user_two_id', $userId);
        })
            ->where('id', $conversationId)
            ->first();

        if (!$conversation) {
            return response()->json(['error' => 'Unauthorized access to this conversation'], 403);
        }

        // Lấy tin nhắn
        $messages = Message::where('conversation_id', $conversationId)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        // Đánh dấu tin nhắn từ người kia là đã đọc
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($messages);
    }

    /**
     * 🔹 Gửi tin nhắn (văn bản + ảnh)
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'message' => 'nullable|string',
            'attachments.*' => 'nullable|image|max:2048',
        ]);

        $senderId = Auth::id() ?? $request->query('user_id', 1);

        // Kiểm tra quyền
        $conversation = Conversation::where(function ($q) use ($senderId) {
            $q->where('user_one_id', $senderId)
                ->orWhere('user_two_id', $senderId);
        })
            ->where('id', $request->conversation_id)
            ->first();

        if (!$conversation) {
            return response()->json(['error' => 'Unauthorized access to this conversation'], 403);
        }

        // Lưu ảnh đính kèm (nếu có)
        $attachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $attachments[] = $file->store('chat_images', 'public');
            }
        }

        // Lưu tin nhắn mới
        $message = Message::create([
            'conversation_id' => $request->conversation_id,
            'sender_id' => $senderId,
            'message' => $request->message,
            'attachments' => $attachments,
            'is_read' => false,
        ]);

        $message->load('sender');

        /**
         * ✅ Gửi realtime event
         * - Dùng event() thay vì broadcast()->toOthers()
         * - Vì khi test local, socket ID không đồng bộ giữa 2 tab/user
         */
        event(new MessageSent($message));

        return response()->json($message);
    }

    /**
     * 🔹 Đánh dấu đã đọc
     */
    public function markAsRead(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
        ]);

        $userId = Auth::id() ?? $request->query('user_id', 1);

        Message::where('conversation_id', $request->conversation_id)
            ->where('sender_id', '!=', $userId)
            ->update(['is_read' => true]);

        return response()->json(['status' => 'ok']);
    }

    /**
     * 🔹 Tạo hoặc lấy cuộc trò chuyện giữa 2 người
     */
    public function startConversation(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
        ]);

        $senderId = Auth::id() ?? $request->query('user_id', 1);
        $receiverId = $request->receiver_id;

        $conversation = Conversation::where(function ($q) use ($senderId, $receiverId) {
            $q->where('user_one_id', $senderId)
                ->where('user_two_id', $receiverId);
        })
            ->orWhere(function ($q) use ($senderId, $receiverId) {
                $q->where('user_one_id', $receiverId)
                    ->where('user_two_id', $senderId);
            })
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_one_id' => $senderId,
                'user_two_id' => $receiverId,
            ]);
        }

        return response()->json([
            'conversation_id' => $conversation->id,
        ]);
    }

    /**
     * 🔹 Lấy thông tin 1 cuộc trò chuyện (dành cho realtime)
     */
    public function show(Request $request, $id)
    {
        $userId = Auth::id() ?? $request->query('user_id', 1);

        $conversation = Conversation::where(function ($q) use ($userId) {
            $q->where('user_one_id', $userId)
                ->orWhere('user_two_id', $userId);
        })
            ->where('id', $id)
            ->with(['userOne', 'userTwo'])
            ->withCount('messages')
            ->first();

        if (!$conversation) {
            return response()->json(['error' => 'Unauthorized access to this conversation'], 403);
        }

        return response()->json($conversation);
    }
}

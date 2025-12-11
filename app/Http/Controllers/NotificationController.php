<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Đánh dấu 1 thông báo đã đọc
     */
    public function markAsRead($id)
    {
        $notification = Notification::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        return response()->json(['status' => 'ok']);
    }

    /**
     * Đánh dấu tất cả là đã đọc
     */
    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['status' => 'ok']);
    }

    /**
     * Xóa 1 thông báo
     */
    public function delete($id)
    {
        $notification = Notification::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $notification->delete();

        return response()->json(['status' => 'deleted']);
    }

    /**
     * Xóa tất cả thông báo
     */
    public function clearAll()
    {
        Notification::where('user_id', Auth::id())->delete();

        return response()->json(['status' => 'cleared']);
    }
}

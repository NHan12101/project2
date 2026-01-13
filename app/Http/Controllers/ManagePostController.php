<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ManagePostController extends Controller
{
    /**
     * Trang quản lý tin đăng
     */
    public function index(Request $request)
    {
        // Mapping tab id sang status trong DB
        $statusMap = [
            1 => 'visible', // Đang hiển thị
            2 => 'expired', // Hết hạn
            3 => 'draft',   // Tin nháp
            4 => 'hidden',  // Đã ẩn
        ];

        $tabId = (int) $request->query('tab', 1);
        $status = $statusMap[$tabId] ?? 'visible';

        $posts = Post::with('images', 'city', 'ward', 'user')
            ->where('user_id', Auth::id())
            ->where('status', $status)
            ->orderByDesc('created_at')
            ->get();

        // Tính tổng số bài đăng từng trạng thái
        $counts = Post::where('user_id', Auth::id())
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $counts = [
            'visible' => $counts['visible'] ?? 0,
            'expired' => $counts['expired'] ?? 0,
            'draft'   => $counts['draft'] ?? 0,
            'hidden'  => $counts['hidden'] ?? 0,
        ];

        return Inertia::render('Posts/PostManagement', [
            'posts' => $posts,
            'activeTab' => $tabId,
            'counts' => $counts,
            'subscriptions' => Subscription::where('active', true)->orderByDesc('priority')->get(),
        ]);
    }

    /**
     * Ẩn hoặc hiển thị tin
     */
    public function toggleStatus(Post $post)
    {
        abort_if($post->user_id !== Auth::id(), 403);

        if (!in_array($post->status, ['visible', 'hidden'])) {
            abort(400, 'Trạng thái không hợp lệ');
        }

        $post->update([
            'status' => $post->status === 'visible' ? 'hidden' : 'visible',
        ]);

        return back()->with('success', 'Cập nhật trạng thái thành công');
    }

    /**
     * Xóa tin
     */
    public function destroy(Post $post)
    {
        abort_if($post->user_id !== Auth::id(), 403);

        $post->delete();

        return back()->with('success', 'Đã xóa tin');
    }
}

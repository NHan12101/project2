<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Hiển thị trang hồ sơ người dùng
     */
    public function show()
    {
        $user =User::with('posts.images', 'posts.city', 'posts.ward')->find(Auth::id());

        $properties = $user->posts()->with('images', 'city', 'ward')->get();

        return Inertia::render('Profile', [
            'user' => $user,
            'properties' => $properties,
        ]);
    }

    /**
     * Cập nhật hoặc lưu thông tin người dùng
     */
    public function storeOrUpdate(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        // Nếu người dùng upload ảnh mới
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            // Chỉ xóa ảnh cũ nếu KHÔNG phải ảnh mặc định và ảnh cũ thực sự tồn tại
            if (
                $user->avatar_image_url &&
                file_exists(public_path($user->avatar_image_url)) &&
                !str_contains($user->avatar_image_url, 'images/ava2.jpg') // không xóa ảnh mặc định
            ) {
                unlink(public_path($user->avatar_image_url));
            }

            // Lưu ảnh mới
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar_image_url'] = 'storage/' . $path;
        } else {
            // Không upload ảnh mới → giữ nguyên ảnh cũ
            unset($validated['avatar_image_url']);
        }

        // Không ghi đè cột avatar (ảnh Google)
        unset($validated['avatar']);

        /** @var \App\Models\User $user */
        $user->update($validated);

        return redirect()->back()->with('success', 'Cập nhật hồ sơ thành công!');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function show()
    {
        $user = Auth::user();

        return Inertia::render('Profile', [
            'user' => $user,
        ]);
    }

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

        // Chỉ xử lý khi thực sự có file upload mới
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            // Xóa ảnh cũ (nếu có)
            if ($user->avatar_image_url && file_exists(public_path($user->avatar_image_url))) {
                unlink(public_path($user->avatar_image_url));
            }
            // Lưu ảnh mới
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar_image_url'] = 'storage/' . $path;
        } else {
            // Giữ nguyên ảnh cũ nếu người dùng không upload mới
            unset($validated['avatar_image_url']);
        }

        unset($validated['avatar']); // không ghi đè cột avatar Google

        /** @var \App\Models\User $user */
        $user->update($validated);

        return redirect()->back()->with('success', 'Cập nhật hồ sơ thành công!');
    }
}

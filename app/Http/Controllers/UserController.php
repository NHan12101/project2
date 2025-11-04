<?php

namespace App\Http\Controllers;

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
        $user = Auth::user();

        $properties = $user->posts()->with('images', 'location')->get();

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
            // Xóa ảnh cũ (nếu có)
            // if ($user->avatar_image_url && file_exists(public_path($user->avatar_image_url))) {
            //     unlink(public_path($user->avatar_image_url));
            // }

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

import React from "react";
import { router } from "@inertiajs/react";

export default function Home({ auth }) {
  const handleLogout = () => {
    router.post("/logout");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96 text-center">
        <img
          src={auth.user.avatar_image_url}
          alt="Avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">
          Xin chào, {auth.user.name} 👋
        </h1>
        <p className="text-gray-600 mb-4">{auth.user.email}</p>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

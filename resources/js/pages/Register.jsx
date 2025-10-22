import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post("/register", form);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Đăng ký tài khoản</h1>

        <input
          type="text"
          placeholder="Họ và tên"
          className="w-full mb-3 p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full mb-4 p-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Đăng ký
        </button>

        <p className="mt-4 text-center text-sm">
          Đã có tài khoản?{" "}
          <a href="/" className="text-blue-500 hover:underline">
            Đăng nhập
          </a>
        </p>
      </form>
    </div>
  );
}

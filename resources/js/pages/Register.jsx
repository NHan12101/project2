import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError("");
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      setLocalError("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    router.post("/register", formData, {
      onError: (err) => setErrors(err),
    });
  };

  return (
    <div>
      <h2>Đăng ký tài khoản</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Xác nhận mật khẩu:</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>

        {localError && <p style={{ color: "red" }}>{localError}</p>}
        <button type="submit">Đăng ký</button>
      </form>

      {/* 🔥 Đăng ký bằng Google */}
      <button
        onClick={() => window.location.href = '/auth/google'}
        style={{
          marginTop: "1rem",
          backgroundColor: "#db4437",
          color: "white",
          padding: "8px 16px",
          border: "none",
          cursor: "pointer"
        }}
      >
        Đăng ký bằng Google
      </button>
    </div>
  );
}

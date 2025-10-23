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

    // 🔒 Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.password_confirmation) {
      setLocalError("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    // 🔒 Validate mật khẩu cơ bản ở frontend
    const passwordRegex = /^(?=.*[!@#$%^&*_\-])[^\s]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setLocalError(
        "Mật khẩu phải có ít nhất 8 ký tự, gồm 1 ký tự đặc biệt và không chứa khoảng trắng!"
      );
      return;
    }

    // 🔒 Gửi dữ liệu lên server
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
          <br />
          <input
            type="email"
            name="email"
            placeholder="Nhập email của bạn"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div>
          <label>Mật khẩu:</label>
          <br />
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        <div>
          <label>Xác nhận mật khẩu:</label>
          <br />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Nhập lại mật khẩu"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
          {localError && <p style={{ color: "red" }}>{localError}</p>}
        </div>

        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
}

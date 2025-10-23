import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function CompleteRegister() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    router.post("/complete-register", { password }, {
      onError: (err) => setError(Object.values(err).join(", ")),
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h2>Hoàn tất đăng ký</h2>
      <p>Chào mừng! Vui lòng đặt mật khẩu cho tài khoản của bạn.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="confirm"
            placeholder="Xác nhận mật khẩu"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Hoàn tất</button>
      </form>
    </div>
  );
}

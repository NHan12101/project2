import { useEffect } from "react";

export default function ForceLogout() {
  useEffect(() => {
    // ✅ Xóa mọi dữ liệu phía client
    localStorage.clear();
    sessionStorage.clear();

    // ✅ Chuyển về trang home
    window.location.href = "/home";
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Đang đăng xuất...</h2>
    </div>
  );
}

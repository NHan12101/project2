import { useEffect } from "react";

export default function ForceLogout() {
  useEffect(() => {
    // localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/home";
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: 'var(--text-color)'}}>
      <h2 style={{fontSize: '4.8rem', fontWeight: '700'}}>Đang đăng xuất...</h2>
    </div>
  );
}
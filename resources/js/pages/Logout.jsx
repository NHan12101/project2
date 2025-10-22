import { useEffect } from "react";
import { router } from "@inertiajs/react";

export default function Logout() {
  useEffect(() => {
    router.post("/logout");
  }, []);

  return <div>Đang đăng xuất...</div>;
}

import { create } from "zustand";
import { usePage, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";

// =============================
// 1) Tạo Zustand store NGAY TRONG FILE
// =============================
const useFavoriteStore = create((set) => ({
    favoritePostIds: [],

    setFavorites: (list) => set({ favoritePostIds: list }),

    toggleLocal: (id) =>
        set((state) => {
            const exists = state.favoritePostIds.includes(id);

            return {
                favoritePostIds: exists
                    ? state.favoritePostIds.filter((i) => i !== id)
                    : [...state.favoritePostIds, id],
            };
        }),
}));

// ========== Hàm INIT (gọi 1 lần khi page load) ==========
export function initFavorites(ids) {
    useFavoriteStore.setState({ favoritePostIds: ids });
}

// =============================
// 2) Custom hook tổng hợp
// =============================
export function useFavorite(postId) {
    const { auth } = usePage().props;

    const { favoritePostIds, setFavorites, toggleLocal } =
        useFavoriteStore((s) => s);

    const isLiked = favoritePostIds.includes(postId);

    const toggle = () => {
        if (!auth?.user) {
            toast.error("Bạn cần đăng nhập để lưu tin!");
            return;
        }

        const prev = favoritePostIds;

        // Optimistic UI
        toggleLocal(postId);
        toast(isLiked ? "Đã hủy lưu tin" : "Đã lưu tin");

        // Gửi request
        router.post(
            "/favorite/toggle",
            { post_id: postId },
            {
                preserveScroll: true,
                preserveState: true,

                // rollback nếu lỗi
                onError: () => setFavorites(prev),
            }
        );
    };

    return { isLiked, toggle, favoritePostIds };
}

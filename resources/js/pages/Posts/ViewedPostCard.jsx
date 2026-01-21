import { useFavorite } from '@/hooks/useFavorite';
import { formatPrice } from '@/utils/formatPrice';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ViewedPostCard({
    post,
    showActions = true,
    onRenewClick,
}) {
    const R2_PUBLIC_BASE_URL = import.meta.env.VITE_R2_PUBLIC_BASE_URL;

    const { isLiked, toggle } = useFavorite(post?.id);

    const handleStartChat = async () => {
        try {
            const res = await axios.post('/conversations/start', {
                receiver_id: post.user.id,
            });
            const conversationId = res.data.conversation_id;
            router.visit(`/chatbox?open=${conversationId}`);
        } catch (err) {
            console.error('Error starting conversation:', err);
            toast.error('Không thể bắt đầu cuộc trò chuyện.');
        }
    };

    const ACTIONS_BY_STATUS = {
        visible: [
            { key: 'hide', label: 'Ẩn tin', icon: '/icons/eye-off.svg' },
            // { key: 'edit', label: 'Chỉnh sửa', icon: '/icons/edit-pen.svg' },
            { key: 'delete', label: 'Xóa', icon: '/icons/thungrac.png' },
        ],
        expired: [
            { key: 'renew', label: 'Gia hạn', icon: '/icons/giahan.png' },
            { key: 'edit', label: 'Chỉnh sửa', icon: '/icons/edit-pen.svg' },
            { key: 'delete', label: 'Xóa', icon: '/icons/thungrac.png' },
        ],
        draft: [
            {
                key: 'edit',
                label: 'Tiếp tục chỉnh sửa',
                icon: '/icons/edit-pen.svg',
            },
            { key: 'delete', label: 'Xóa', icon: '/icons/thungrac.png' },
        ],
        hidden: [
            { key: 'show', label: 'Hiển thị lại', icon: '/icons/eye.svg' },
            { key: 'edit', label: 'Chỉnh sửa', icon: '/icons/edit-pen.svg' },
            { key: 'delete', label: 'Xóa', icon: '/icons/thungrac.png' },
        ],
    };

    const [confirmState, setConfirmState] = useState({
        open: false,
        action: null,
        post: null,
    });

    const openConfirm = (action, post) => {
        setConfirmState({
            open: true,
            action,
            post,
        });
    };

    const handleAction = (action, post) => {
        switch (action) {
            case 'hide':
            case 'show':
            case 'delete':
                openConfirm(action, post);
                break;

            case 'renew':
                if (onRenewClick) onRenewClick(post);
                break;

            case 'edit':
                router.get(`/posts/${post.id}/edit`);
                break;

            default:
                break;
        }
    };

    const handleConfirm = () => {
        const { action, post } = confirmState;
        if (!action || !post) return;

        switch (action) {
            case 'hide':
            case 'show':
                router.patch(`/posts/${post.id}/toggle-status`, null, {
                    onSuccess: () => {
                        toast.success('Cập nhật trạng thái thành công');
                    },
                });
                break;

            case 'delete':
                router.delete(`/posts/${post.id}`, {
                    onSuccess: () => toast.success('Đã xóa tin đăng thành công'),
                });
                break;

            default:
                break;
        }

        setConfirmState({ open: false, action: null, post: null });
    };

    // Kiểm tra trạng thái disabled
    const isDisabled = ['expired', 'draft', 'hidden'].includes(post.status);

    // Nội dung thông báo khi disabled
    const disabledText = [];
    if (post.status === 'expired') disabledText.push('Tin hết hạn');
    if (post.status === 'draft') disabledText.push('Tin nháp');
    if (post.status === 'hidden') disabledText.push('Tin đã ẩn');

    return (
        <div className="viewed-card__01">
            <div className="viewed-image">
                <img
                    src={`${R2_PUBLIC_BASE_URL}/${post.images?.[0].thumb_path}`}
                    alt={post.title}
                />
                {isDisabled && (
                    <div className="viewed-image__disable">{disabledText}</div>
                )}
            </div>

            <div className="viewed-content">
                <div className="viewed-content__01">
                    <p className="viewed-card__title">{post.title}</p>

                    <p className="viewed-content__price">
                        {formatPrice(post.price)}
                    </p>

                    <div className="viewed-card__location">
                        <svg
                            data-type="monochrome"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="1em"
                            height="1em"
                            fill="none"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M20.0005 10.0439C20.0004 11.4492 19.4826 12.8887 18.7915 14.2021C18.0937 15.5284 17.1749 16.8075 16.2759 17.9131C15.3742 19.0219 14.4755 19.9768 13.8032 20.6533C13.4666 20.992 13.1851 21.2623 12.9868 21.4492C12.8876 21.5427 12.8088 21.6161 12.7544 21.666L12.7198 21.6979L12.6919 21.7236L12.6743 21.7393L12.0005 22.3418L11.3267 21.7393L11.3091 21.7236L11.2811 21.6979L11.2466 21.666C11.1921 21.6161 11.1134 21.5427 11.0142 21.4492C10.8158 21.2623 10.5344 20.992 10.1978 20.6533C9.52545 19.9768 8.62674 19.0219 7.7251 17.9131C6.82612 16.8075 5.90731 15.5284 5.20947 14.2021C4.51839 12.8887 4.0006 11.4492 4.00049 10.0439C4.00049 5.6075 7.57638 2 12.0005 2C16.4246 2 20.0005 5.6075 20.0005 10.0439ZM12.0005 13C13.7936 13 15.2368 11.5391 15.2368 9.75C15.2367 7.96099 13.7935 6.5 12.0005 6.5C10.2076 6.50015 8.76521 7.96108 8.76514 9.75C8.76514 11.539 10.2075 12.9998 12.0005 13Z"
                                fill="currentColor"
                            ></path>
                        </svg>

                        <span className="viewed-card__location-text">
                            {post.ward.ward_name}
                        </span>
                    </div>
                </div>

                <div className="viewed-card__user">
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <div className="viewed-card__user-avatar">
                            <img
                                src={`/${post?.user.avatar_image_url}`}
                                alt={`${post.user.name}'s avatar`}
                                className="viewed-card__user-avatar-img"
                            />
                        </div>

                        <p className="viewed-card__user-name">
                            {post.user.name}
                        </p>
                    </div>

                    {/* Button action */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        {showActions ? (
                            <>
                                {ACTIONS_BY_STATUS[post.status]?.map(
                                    (action) => (
                                        <button
                                            className="post-actions"
                                            key={action.key}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAction(action.key, post);
                                            }}
                                        >
                                            <img
                                                style={{ height: 20 }}
                                                src={action.icon}
                                                alt="{action.label}"
                                            />
                                            {action.label}
                                        </button>
                                    ),
                                )}
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleStartChat();
                                    }}
                                >
                                    <img
                                        style={{ height: 20 }}
                                        src="/icons/chat.svg"
                                        alt="icon chat"
                                    />
                                    Chat
                                </button>

                                <button
                                    className="viewed-card__heart--button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggle();
                                    }}
                                >
                                    <img
                                        src={
                                            isLiked
                                                ? '/icons/heart-filled.svg'
                                                : '/icons/heart.svg'
                                        }
                                        alt="heart"
                                    />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {confirmState.open && (
                <div
                    className="auth-form"
                    onClick={(e) => e.preventDefault()}
                    style={{ cursor: 'default' }}
                >
                    <div className="confirm-modal__content">
                        <h1 className="confirm-modal__title">
                            {confirmState.action === 'delete' &&
                                'Bạn có chắc chắn muốn xóa tin này?'}

                            {confirmState.action === 'hide' &&
                                'Bạn muốn ẩn tin đăng này?'}

                            {confirmState.action === 'show' &&
                                'Bạn muốn hiển thị lại bài đăng này?'}
                        </h1>

                        <div className="confirm-modal__actions">
                            <button
                                className="confirm-modal__button confirm-modal__button--danger"
                                onClick={handleConfirm}
                            >
                                Xác nhận
                            </button>

                            <button
                                className="confirm-modal__button confirm-modal__button--cancel"
                                onClick={() =>
                                    setConfirmState({
                                        open: false,
                                        action: null,
                                        post: null,
                                    })
                                }
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

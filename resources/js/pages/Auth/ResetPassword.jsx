import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import './ResetPassword.css';

export default function ResetPassword({ email, onClose, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email || '',
        password: '',
        password_confirmation: '',
    });
    console.log(email)

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        // cập nhật email từ props vào form (khi email truyền xuống thay đổi)
        if (email) {
            setData('email', email);
        }
    }, [email]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/forgot-password/reset', {
            onSuccess: () => {
                reset();
                if (onClose) onClose(false);
            },
        });
    };

    return (
        <div className="modal-resetpassword-overlay">
            <div
                className="modal-resetpassword"
                onClick={(e) => e.stopPropagation()} // tránh click vào form bị đóng popup
            >
                <h2 className="modal-resetpassword__title">Đặt lại mật khẩu</h2>

                {/* Flash message */}
                {flash?.success && (
                    <div className="notification__success">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="notification__error">{flash.error}</div>
                )}

                {/* Lỗi validate trả về từ Laravel */}
                {(errors.password || errors.password_confirmation) && (
                    <div className="notification__error">
                        {errors.password || errors.password_confirmation}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modal-resetpassword__form">

                    {/* Email ẩn */}
                    <input type="hidden" value={data.email} />

                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <div className="input-password">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu mới"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? 'Ẩn' : 'Hiện'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Xác nhận mật khẩu</label>
                        <div className="input-password">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Nhập lại mật khẩu"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((prev) => !prev)}
                            >
                                {showConfirm ? 'Ẩn' : 'Hiện'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={
                            processing ||
                            !data.password ||
                            !data.password_confirmation
                        }
                        className="button-submit"
                    >
                        Đặt lại mật khẩu
                    </button>

                    <button
                        type="button"
                        className="button-cancel"
                        onClick={() => onClose(false)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
}

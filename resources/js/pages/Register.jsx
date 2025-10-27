import { router } from '@inertiajs/react';
import { useState } from 'react';
import './Register.css';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [localError, setLocalError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setLocalError('');
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.password_confirmation) {
            setLocalError('Mật khẩu và xác nhận mật khẩu không khớp!');
            return;
        }

        router.post('/register', formData, {
            onError: (err) => {
                setErrors(err);
                setLocalError('');
            },
        });
    };

    return (
        <div className="register-container">
            {/* Left Side - Illustration */}
            <div className="register-left">
                <div className="logo">
                    <img src="/logo-batdongsan.png" alt="Logo" />
                    <div>
                        <span>Batdongsan.com.vn</span>
                        <small>by PropertyGuru</small>
                    </div>
                </div>

                <div className="illustration">
                    <img src="/illustration-register.png" alt="Register" />
                </div>

                <div className="footer-text">
                    <h3>Tìm nhà đất</h3>
                    <p>Batdongsan.com.vn dẫn Lối</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="register-right">
                <div className="register-card">
                    <button className="close-btn" onClick={() => router.visit('/')}>
                        ×
                    </button>

                    <h2>Xin chào bạn</h2>
                    <h1>Đăng ký tài khoản mới</h1>

                    <form onSubmit={handleSubmit} className="register-form">
                        {/* Email */}
                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className={errors.email ? 'input-error' : ''}
                                required
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mật khẩu"
                                className={errors.password ? 'input-error' : ''}
                                required
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        {/* Confirm Password */}
                        <div className="input-group">
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                placeholder="Xác nhận mật khẩu"
                                className={localError || errors.password_confirmation ? 'input-error' : ''}
                                required
                            />
                            {(localError || errors.password_confirmation) && (
                                <span className="error-text">
                                    {localError || errors.password_confirmation}
                                </span>
                            )}
                        </div>

                        <button type="submit" className="btn-continue">
                            Đăng ký
                        </button>
                    </form>

                    <div className="or-divider">Hoặc</div>

                    {/* Google Login */}
                    <button
                        className="btn-social btn-google"
                        onClick={() => (window.location.href = '/auth/google')}
                    >
                        
                        Đăng ký bằng Google
                    </button>

                    <p className="terms">
                        Bằng việc tiếp tục, bạn đồng ý với{' '}
                        <a href="#">Điều khoản sử dụng</a>,{' '}
                        <a href="#">Chính sách bảo mật</a>, <br />
                        <a href="#">Quy chế, Chính sách của chúng tôi</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
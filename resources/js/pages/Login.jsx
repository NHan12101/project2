import { router } from '@inertiajs/react';
import { useState } from 'react';
import './login.css';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        router.post('/login', formData, {
            onError: (err) => setError(err),
        });
        // try {
        //   const response = await fetch('https://your-api.com/api/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //       email: formData.email,
        //       password: formData.password,
        //       rememberMe: rememberMe
        //     })
        //   });

        //   const data = await response.json();

        //   if (response.ok) {
        //     console.log('Đăng nhập thành công:', data);
        //     alert('Đăng nhập thành công!');
        //     // Xử lý redirect hoặc lưu token
        //   } else {
        //     setError(data.message || 'Email hoặc mật khẩu không đúng');
        //   }
        // } catch (err) {
        //   setError('Có lỗi xảy ra. Vui lòng thử lại.');
        //   console.error('Error:', err);
        // } finally {
        //   setLoading(false);
        // }
    };

    // const handleGoogleLogin = async () => {
    //     try {
    //         // Thêm logic Google OAuth
    //         console.log('Đăng nhập với Google');
    //         // window.location.href = 'https://your-api.com/api/auth/google';
    //     } catch (err) {
    //         setError('Đăng nhập Google thất bại');
    //     }
    // };

    // const handleAppleLogin = async () => {
    //     try {
    //         // Thêm logic Apple OAuth
    //         console.log('Đăng nhập với Apple');
    //         // window.location.href = 'https://your-api.com/api/auth/apple';
    //     } catch (err) {
    //         setError('Đăng nhập Apple thất bại');
    //     }
    // };

    return (
        <div className="batdongsan-login">
            {/* Left Side - Illustration */}
            <div className="left-section">
                <div className="logo-wrapper">
                    <svg
                        width="160"
                        height="40"
                        viewBox="0 0 160 40"
                        fill="none"
                    >
                        <rect width="40" height="40" rx="8" fill="#E53E3E" />
                        <path
                            d="M12 28L20 16L28 28"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path d="M16 24H24V28H16V24Z" fill="white" />
                    </svg>
                </div>

                <div className="illustration-area">
                    <div className="illustration-circle"></div>
                    <div className="illustration-content">
                        <svg
                            className="person-illustration"
                            viewBox="0 0 400 400"
                            fill="none"
                        >
                            {/* Sofa */}
                            <ellipse
                                cx="200"
                                cy="280"
                                rx="150"
                                ry="15"
                                fill="#B91C1C"
                                opacity="0.2"
                            />
                            <rect
                                x="80"
                                y="200"
                                width="240"
                                height="80"
                                rx="12"
                                fill="#DC2626"
                            />
                            <rect
                                x="60"
                                y="180"
                                width="280"
                                height="30"
                                rx="15"
                                fill="#EF4444"
                            />
                            <rect
                                x="80"
                                y="230"
                                width="80"
                                height="50"
                                rx="8"
                                fill="#B91C1C"
                            />
                            <rect
                                x="240"
                                y="230"
                                width="80"
                                height="50"
                                rx="8"
                                fill="#B91C1C"
                            />

                            {/* Person */}
                            <circle cx="200" cy="140" r="25" fill="#FCA5A5" />
                            <path
                                d="M200 165 Q180 180, 175 210 L225 210 Q220 180, 200 165"
                                fill="#FCA5A5"
                            />
                            <rect
                                x="190"
                                y="210"
                                width="20"
                                height="40"
                                rx="4"
                                fill="#DC2626"
                            />

                            {/* Laptop */}
                            <rect
                                x="150"
                                y="190"
                                width="100"
                                height="60"
                                rx="4"
                                fill="#1E293B"
                            />
                            <rect
                                x="155"
                                y="195"
                                width="90"
                                height="45"
                                rx="2"
                                fill="#3B82F6"
                            />

                            {/* Lamp */}
                            <line
                                x1="340"
                                y1="100"
                                x2="340"
                                y2="200"
                                stroke="#DC2626"
                                strokeWidth="4"
                            />
                            <circle cx="340" cy="95" r="8" fill="#DC2626" />
                            <path
                                d="M320 100 L340 130 L360 100 Z"
                                fill="#FCA5A5"
                            />

                            {/* Books */}
                            <rect
                                x="90"
                                y="265"
                                width="15"
                                height="25"
                                rx="2"
                                fill="#3B82F6"
                            />
                            <rect
                                x="108"
                                y="262"
                                width="15"
                                height="28"
                                rx="2"
                                fill="#DC2626"
                            />
                            <rect
                                x="126"
                                y="260"
                                width="15"
                                height="30"
                                rx="2"
                                fill="#10B981"
                            />
                        </svg>
                    </div>
                </div>

                <div className="left-text">
                    <h2>Tìm nhà đất</h2>
                    <p>Batdongsan.com.vn dẫn lối</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="right-section">
                <button
                    className="close-button"
                    onClick={() => console.log('Close')}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M18 6L6 18M6 6L18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>

                <div className="form-container">
                    <div className="form-header">
                        <p className="greeting">Xin chào bạn</p>
                        <h1>Đăng nhập để tiếp tục</h1>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <div className="input-icon">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                >
                                    <path
                                        d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
                                        fill="#9CA3AF"
                                    />
                                    <path
                                        d="M10 12C4.477 12 0 14.686 0 18V20H20V18C20 14.686 15.523 12 10 12Z"
                                        fill="#9CA3AF"
                                    />
                                </svg>
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="SĐT chính hoặc email"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <div className="input-icon">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                >
                                    <path
                                        d="M15 8V6C15 3.24 12.76 1 10 1C7.24 1 5 3.24 5 6V8C3.9 8 3 8.9 3 10V17C3 18.1 3.9 19 5 19H15C16.1 19 17 18.1 17 17V10C17 8.9 16.1 8 15 8ZM7 6C7 4.34 8.34 3 10 3C11.66 3 13 4.34 13 6V8H7V6Z"
                                        fill="#9CA3AF"
                                    />
                                </svg>
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Mật khẩu"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                    >
                                        <path
                                            d="M10 4C4.5 4 1 10 1 10C1 10 4.5 16 10 16C15.5 16 19 10 19 10C19 10 15.5 4 10 4Z"
                                            stroke="#9CA3AF"
                                            strokeWidth="2"
                                        />
                                        <circle
                                            cx="10"
                                            cy="10"
                                            r="3"
                                            stroke="#9CA3AF"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                    >
                                        <path
                                            d="M2 2L18 18M8 8C7.4 8.6 7 9.3 7 10C7 11.7 8.3 13 10 13C10.7 13 11.4 12.6 12 12M10 4C4.5 4 1 10 1 10C1 10 2.5 13 5 14.5M10 16C15.5 16 19 10 19 10C19 10 17.5 7 15 5.5"
                                            stroke="#9CA3AF"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                />
                                <span>Nhớ tài khoản</span>
                            </label>
                            <a href="#" className="forgot-link">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>
                    </form>

                    <div className="divider-text">Hoặc</div>

                    <a href="/auth/google" className="btn-google">
                        <svg viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Tiếp tục với Google
                    </a>

                    <p className="terms-text">
                        Bằng việc tiếp tục, bạn đồng ý với{' '}
                        <a href="#">Điều khoản sử dụng</a>,{' '}
                        <a href="#">Chính sách bảo mật</a>,{' '}
                        <a href="#">Quy chế</a>, <a href="#">Chính sách</a> của
                        chúng tôi.
                    </p>

                    <div className="toggle-form">
                        Chưa là thành viên? <a href="/register">Đăng ký</a> tại
                        đây
                    </div>
                </div>
            </div>
        </div>
    );
}

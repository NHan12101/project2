import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/login', form);
    };

    return (
        <div className="card">
            <h1>Đăng nhập</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />
                <button type="submit">Đăng nhập</button>
            </form>

            <p style={{ margin: '15px 0', color: '#666' }}>hoặc</p>

            <a href="/auth/google" className="google-btn">
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                />
                Đăng nhập với Google
            </a>

            <p style={{ marginTop: '20px' }}>
                Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
            </p>
        </div>
    );
}

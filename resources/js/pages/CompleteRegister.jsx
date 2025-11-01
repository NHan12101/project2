import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function CompleteRegister() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        router.post(
            '/complete-register',
            { password },
            {
                onError: (err) => setError(Object.values(err).join(', ')),
            },
        );
    };

    return (
        <div
            style={{
                height: '100vh',
                color: 'var(--text-color)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    // border: '1px solid var(--text-color)',
                    padding: '50px 22px',
                    // height: '520px',
                    background: 'var(--bg-chat)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    boxShadow: '1px 2px 12px pink',
                }}
            >
                <h2
                    style={{
                        fontSize: '3.6rem',
                        fontWeight: '700',
                        color: '#ff00df85',
                    }}
                >
                    Hoàn tất đăng ký
                </h2>
                <p style={{ marginTop: '24px', fontSize: '1.8rem', color: '#0fddca'}}>
                    Chào mừng! Vui lòng đặt mật khẩu cho tài khoản của bạn.
                </p>

                <form onSubmit={handleSubmit} style={{ marginTop: '36px' }}>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                height: '50px',
                                background: 'none',
                                border: 'none',
                                // outline: '1px solid var(--text-color)',
                                borderRadius: '26px',
                                padding: '8px',
                                marginBottom: '28px',
                                color: 'var(--text-color)',
                                boxShadow: '2px 2px 12px pink',
                            }}
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
                            style={{
                                height: '50px',
                                background: 'none',
                                border: 'none',
                                // outline: '1px solid var(--text-color)',
                                borderRadius: '26px',
                                padding: '8px',
                                marginBottom: '16px',
                                color: 'var(--text-color)',
                                boxShadow: '2px 2px 12px pink',
                            }}
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button
                        type="submit"
                        style={{
                            border: 'none',
                            outline: 'none',
                            background: 'none',
                            // height: '32px',
                            width: '120px',
                            background: '#8667e1',
                            padding: '12px',
                            borderRadius: '24px',
                            color: '#fff',
                            marginTop: '30px',
                        }}
                    >
                        Hoàn tất
                    </button>
                </form>
            </div>
        </div>
    );
}

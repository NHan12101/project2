import { router } from '@inertiajs/react';
import { useState } from 'react';

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
        setErrors({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.password_confirmation) {
            setLocalError('Mật khẩu và xác nhận mật khẩu không khớp!');
            return;
        }

        router.post('/register', formData, {
            onError: (err) => setErrors(err),
        });
    };

    return (
        <div className="card">
            <div>
                <h1 className='card__title--login'>Đăng ký tài khoản</h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            className="card__input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Email'
                            required
                        />
                    </div>

                    <div>
                        <input
                            className="card__input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='Mật khẩu'
                            required
                        />
                    </div>

                    <div>
                        <input
                            className="card__input"
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder='Xác nhận mật khẩu'
                            required
                        />
                    </div>

                    {localError && <p style={{ color: 'red' }}>{localError}</p>}
                    <button type="submit" className='card__btn'>Đăng ký</button>
                </form>

                {/* 🔥 Đăng ký bằng Google */}
                <button
                    className="card__btn"
                    onClick={() => (window.location.href = '/auth/google')}
                    style={{
                        marginTop: '1rem',
                        backgroundColor: '#db4437',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Đăng ký bằng Google
                </button>
            </div>
        </div>
    );
}

import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import './VerifyOtp.css';

export default function VerifyPhoneOtp({ phone, onClose }) {
    const { flash } = usePage().props;

    const OTP_LENGTH = 6;

    const { data, setData, post, processing, errors, reset } = useForm({
        phone,
        otp: '',
    });

    const [otpArray, setOtpArray] = useState(Array(OTP_LENGTH).fill(''));
    const inputsRef = useRef([]);

    const [shake, setShake] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const isCompleted = otpArray.every((v) => v !== '');

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    useEffect(() => {
        setData('otp', otpArray.join(''));
    }, [otpArray]);

    useEffect(() => {
        if (errors?.message || flash?.error) {
            setShake(true);
            setTimeout(() => setShake(false), 400);

            setOtpArray(Array(OTP_LENGTH).fill(''));
            setData('otp', '');

            setTimeout(() => {
                inputsRef.current[0]?.focus();
            }, 50);
        }
    }, [errors, flash]);

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    function handleSubmit(e) {
        e?.preventDefault();

        post('/phone/verify-otp', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    function handleResend(e) {
        e.preventDefault();
        if (countdown > 0) return;

        post('/phone/send-otp', {
            data: { phone: data.phone },
            onSuccess: () => setCountdown(60),
        });
    }

    function handleChange(e, index) {
        const val = e.target.value.replace(/\D/g, '').slice(-1);
        const newOtp = [...otpArray];
        newOtp[index] = val;
        setOtpArray(newOtp);

        if (val && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1].focus();
        }
    }

    function handleKeyDown(e, index) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isCompleted) handleSubmit();
            return;
        }

        if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    }

    function handlePaste(e) {
        e.preventDefault();
        const pasteData = e.clipboardData
            .getData('Text')
            .replace(/\D/g, '')
            .slice(0, OTP_LENGTH);

        const newOtp = Array(OTP_LENGTH).fill('');
        pasteData.split('').forEach((v, i) => (newOtp[i] = v));
        setOtpArray(newOtp);
    }

    function maskPhone(phone) {
        return phone.replace(/^(\d{3})\d{4}(\d{3})$/, '$1****$2');
    }

    return (
        <div className="verification-box">
            <div className="modal">
                <h2 className="modal__title">Xác thực mã OTP</h2>

                <p className="modal__desc">
                    Mã xác thực đã được gửi đến số điện thoại:{' '}
                    <span>{maskPhone(phone)}</span>
                </p>

                <form onSubmit={handleSubmit}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            animation: shake ? 'shake 0.3s' : 'none',
                            marginBottom: 16,
                        }}
                        onPaste={handlePaste}
                    >
                        {otpArray.map((v, index) => (
                            <input
                                key={index}
                                value={v}
                                maxLength={1}
                                ref={(el) => (inputsRef.current[index] = el)}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                style={{
                                    width: 54,
                                    height: 64,
                                    fontSize: '3.6rem',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    outline: 'none',
                                    border: 'none',
                                    transition: '0.2s',
                                    color: isCompleted ? '#007029' : '#31344b',
                                    background: '#e9edf3',
                                    boxShadow:
                                        'inset 1px 1px 6px #b8b9be, inset -2px -2px 8px #ffffff',
                                }}
                            />
                        ))}
                    </div>

                    <div className="resend">
                        <p>Bạn chưa nhận được mã?</p>
                        <button
                            onClick={handleResend}
                            disabled={processing || countdown > 0}
                            style={{
                                cursor: countdown > 0 ? 'default' : 'pointer',
                            }}
                        >
                            {countdown > 0
                                ? `Gửi lại sau ${countdown}s`
                                : 'Gửi lại OTP'}
                        </button>
                    </div>

                    {errors.message && (
                        <div className="notification__verify">
                            {errors.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing || !isCompleted}
                        className="button-verifyOtp"
                    >
                        Xác nhận
                    </button>
                </form>
            </div>
        </div>
    );
}

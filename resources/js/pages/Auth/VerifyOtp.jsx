import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import './VerifyOtp.css'

export default function VerifyOtp({ email, onClose, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email,
        otp: '',
    });

    const OTP_LENGTH = 6;
    const [otpArray, setOtpArray] = useState(Array(OTP_LENGTH).fill(''));
    const inputsRef = useRef([]);

    const [countdown, setCountdown] = useState(0);
    const [shake, setShake] = useState(false);

    const [focusedIndex, setFocusedIndex] = useState(null);

    const isCompleted = otpArray.every((v) => v !== '') && otpArray.length === OTP_LENGTH;

    // Focus vào ô đầu tiên
    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    // Gộp OTP thành chuỗi
    useEffect(() => {
        setData('otp', otpArray.join(''));
    }, [otpArray]);

    // // Clear lỗi khi user nhập lại
    // useEffect(() => {
    //     if (otpArray.some((v) => v !== '')) {
    //         if (errors.message) errors.message = null;
    //         if (flash?.error) flash.error = null;
    //     }
    // }, [otpArray]);

    // Shake animation khi có lỗi từ backend
    useEffect(() => {
        if (flash?.error || errors?.message) {
            // Animation shake
            setShake(true);
            setTimeout(() => setShake(false), 400);

            // Reset OTP về rỗng
            setOtpArray(Array(OTP_LENGTH).fill(''));
            setData('otp', '');

            // Focus vào ô đầu tiên sau khi reset
            setTimeout(() => {
                inputsRef.current[0]?.focus();
            }, 50);
        }
    }, [flash, errors]);

    // Countdown resend
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    function handleSubmit(e) {
        if (e) e.preventDefault();

        post('/verify-otp', {
            onSuccess: () => {
                reset();
                if (onClose) onClose(false);
            },
        });
    };

    function handleResend(e) {
        e.preventDefault();
        if (countdown > 0) return;

        post('/resend-otp', {
            data: { email: data.email },
            onSuccess: () => {
                setCountdown(60);
            }
        });
    };

    function handleChange(e, index) {
        let val = e.target.value.replace(/\D/g, '').slice(-1);
        const newOtp = [...otpArray];
        newOtp[index] = val;
        setOtpArray(newOtp);

        if (val && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    function handleKeyDown(e, index) {
        // Nếu nhấn Enter -> submit khi đủ 6 ký tự
        if (e.key === 'Enter') {
            e.preventDefault(); // chặn form tự submit

            if (otpArray.every(v => v !== '')) {
                handleSubmit(); // giờ thì ok
            }
            return;
        }

        // Backspace
        if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    function handlePaste(e) {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, OTP_LENGTH);

        const newOtp = Array(OTP_LENGTH).fill('');
        pasteData.split('').forEach((v, i) => (newOtp[i] = v));
        setOtpArray(newOtp);

        // // Auto submit nếu đủ 6 ký tự
        // if (pasteData.length === OTP_LENGTH) {
        //     handleSubmit();
        // }
    };

    // Ẩn email theo dạng: f***@gmail.com
    function maskEmail(email) {
        if (!email) return ""; // hoặc return "invalid email"

        const [local, domain] = email.split("@");

        if (local.length <= 2) {
            // a@ => a*@domain
            return local[0] + "*" + "@" + domain;
        }

        if (local.length <= 4) {
            // abcd@ => ab**@domain
            return local.slice(0, 2) + "**@" + domain;
        }

        // local dài > 4
        const first = local.slice(0, 4);   // giữ 4 ký tự đầu
        const last = local.slice(-2);      // giữ 2 ký tự cuối
        return `${first}*****${last}@${domain}`;
    }

    const styles = {
        otpContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 16,
            animation: shake ? 'shake 0.3s' : 'none',
        },
        otpInput: (index) => ({
            width: 54,
            height: 64,
            fontSize: '3.6rem',
            fontWeight: '600',
            textAlign: 'center',
            outline: 'none',
            transition: 'border-color 0.2s',
            color: isCompleted ? '#2a8c4e' : '#000',
            background: isCompleted ? '#fafffb' : '#fefefe',
            border: `2px solid ${isCompleted
                ? '#d9f8e4'
                : focusedIndex === index
                    ? '#222'
                    : '#d1d5db'
                }`,
        })
    };

    return (
        <div className='verification-box'>
            <div className='modal'>
                <h2 className='modal__title'>Xác thực mã OTP</h2>

                <p className='modal__desc'>
                    Mã xác thực đã được gửi đến Email: <span>{maskEmail(data.email)}</span>
                </p>

                <span style={{ display: 'block', margin: '42px 0 12px', userSelect: 'none', fontWeight: 500 }}>Nhập mã OTP</span>
                <form onSubmit={handleSubmit}>
                    <div style={styles.otpContainer} onPaste={handlePaste}>
                        {Array(OTP_LENGTH).fill().map((_, index) => (
                            <input
                                key={index}
                                maxLength={1}
                                value={otpArray[index]}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputsRef.current[index] = el)}
                                style={styles.otpInput(index)}
                                onFocus={() => setFocusedIndex(index)}
                                onBlur={() => setFocusedIndex(null)}
                            />
                        ))}
                    </div>

                    <div className='resend'>
                        <p>Bạn chưa nhận được mã? </p>
                        <button
                            onClick={handleResend}
                            disabled={processing || countdown > 0}
                            style={{
                                cursor: countdown > 0 ? 'default' : 'pointer',
                            }}
                        >
                            {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại OTP'}
                        </button>
                    </div>

                    {errors.message && (
                        <div className='notification__verify'>{errors.message}</div>
                    )}
                    {flash?.success && (
                        <div className='notification__verify notification__verify--success'>{flash.success}</div>
                    )}
                    {flash?.error && (
                        <div className='notification__verify'>{flash.error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={processing || data.otp.length < 6}
                        className='button-verifyOtp'
                        style={{
                            cursor: data.otp.length < 6 ? 'default' : 'pointer',
                            opacity: data.otp.length < 6 ? 0.84 : 1,
                        }}
                    >
                        Xác nhận
                    </button>
                </form>
            </div >
        </div >
    );
}

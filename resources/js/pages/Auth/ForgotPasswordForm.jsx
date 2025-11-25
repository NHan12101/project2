import { useForm } from '@inertiajs/react';

export default function ForgotPasswordForm({ onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    function handleSubmit(e) {
        e.preventDefault();

        // post('/forgot-password', {
        //     onSuccess: () => {
        //         alert('OTP đã được gửi đến email của bạn');
        //         onClose(); // tắt popup sau khi gửi OTP
        //     },
        // });
        post('/forgot-password');
    }

    return (
        // Overlay đen mờ
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose} // click background để đóng popup
        >
            {/* Container popup */}
            <div 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg relative"
                onClick={(e) => e.stopPropagation()} // tránh click container đóng popup
            >
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Quên mật khẩu
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Nhập email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm">{errors.email}</span>
                    )}

                    <button
                        type="submit"
                        disabled={processing || !data.email}
                        className={`bg-blue-500 text-white py-2 rounded-md font-medium transition-all
                            hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Gửi OTP
                    </button>
                </form>

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export default function PostPackageSection({ form, subscriptions }) {
    const { data, setData } = form;

    const selectedPackage = subscriptions.find(s => s.id === data.subscription_id);
    const totalPrice = selectedPackage ? selectedPackage.price_per_day * data.days : 0;
    const paymentMethods = ['momo', 'vnpay', 'stripe', 'paypal'];

    return (
        <div className="post-package">
            <h2>Cấu hình gói đăng tin</h2>

            <div className="package-list">
                {subscriptions.map((pkg) => (
                    <div
                        key={pkg.id}
                        className={'package-card ' + (data.subscription_id === pkg.id ? 'active' : '')}
                        onClick={() => setData('subscription_id', pkg.id)}
                    >
                        <h4>{pkg.name}</h4>
                        <p>{pkg.price_per_day.toLocaleString()}đ / ngày</p>
                        <small>Ưu tiên: {pkg.priority}</small>
                    </div>
                ))}
            </div>

            <div className="package-days">
                <h4>Chọn số ngày</h4>
                {[7, 10, 15, 30, 60].map(d => (
                    <button
                        key={d}
                        type="button"
                        className={data.days === d ? 'active' : ''}
                        onClick={() => setData('days', d)}
                    >
                        {d} ngày
                    </button>
                ))}
            </div>

            {selectedPackage && (
                <div className="package-total">
                    Tổng tiền: <strong>{totalPrice.toLocaleString()}đ</strong>
                </div>
            )}

            <div className="payment-methods">
                {paymentMethods.map(method => (
                    <label key={method}>
                        <input
                            type="radio"
                            name="payment_method"
                            value={method}
                            checked={data.payment_method === method}
                            onChange={() => setData('payment_method', method)}
                        />
                        {method.toUpperCase()}
                    </label>
                ))}
            </div>
        </div>
    );
}

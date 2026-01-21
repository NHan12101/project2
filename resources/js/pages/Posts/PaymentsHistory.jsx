import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from '../components/Headers/Navbar/Navbar';
import './PaymentsHistory.css';

export default function PaymentsHistory({ payments }) {
    const [hover, setHover] = useState(false);

    return (
        <>
            <Head title="Lịch sử giao dịch" />
            <Navbar />

            <section className="payments-history">
                <div className="viewed-header__link">
                    <Link href="/home">StayHub</Link>
                    <p>/</p>
                    <p>Lịch sử giao dịch</p>
                </div>

                <div className="viewed-header__title" style={{ marginTop: 8 }}>
                    <p>Lịch sử giao dịch</p>

                    <span>
                        <svg
                            data-type="monochrome"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="1em"
                            height="1em"
                            fill="none"
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                        >
                            <path
                                d="M20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12ZM11 16.5V12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12V16.5C13 17.0523 12.5523 17.5 12 17.5C11.4477 17.5 11 17.0523 11 16.5ZM11 8.66504V8.625C11 8.07272 11.4477 7.625 12 7.625C12.5523 7.625 13 8.07272 13 8.625V8.66504C12.9997 9.2171 12.5521 9.66504 12 9.66504C11.4479 9.66504 11.0003 9.2171 11 8.66504ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                fill="currentColor"
                            ></path>
                        </svg>

                        {hover && (
                            <div className="viewed-header__suggest">
                                <h2>Lịch sử giao dịch</h2>

                                <span>
                                    Danh sách các giao dịch thanh toán của bạn,
                                    hiển thị tối đa 10 giao dịch mỗi trang.
                                </span>
                            </div>
                        )}
                    </span>
                </div>

                <>
                    <div className="payments-history__table-wrapper">
                        <table className="payments-history__table">
                            <thead className="payments-history__thead">
                                <tr>
                                    <th>STT</th>
                                    <th>Mã GD</th>
                                    <th>Gói</th>
                                    <th>Số ngày</th>
                                    <th>Số tiền</th>
                                    <th>Phương thức</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian</th>
                                </tr>
                            </thead>

                            {payments.data.length === 0 ? (
                                <tbody className="payments-history__tbody">
                                    <tr className="payments-history__empty-row">
                                        <td
                                            colSpan={8}
                                            className="payments-history__empty-cell"
                                        >
                                            <div
                                                className="viewed-empty"
                                                style={{ padding: '64px' }}
                                            >
                                                <div className="viewed-empty__icon">
                                                    <svg
                                                        width="40"
                                                        height="40"
                                                        viewBox="0 0 40 40"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M5.33301 31.9995V8.00048C5.33303 4.87088 7.87072 2.33316 11.0003 2.33316H26.1159C27.15 2.33316 28.1185 2.76824 28.8112 3.4969L29.861 4.57112C30.2595 4.96702 30.691 5.38184 31.111 5.75764L31.7344 6.33869C32.4018 6.98148 33.1633 7.76413 33.6501 8.26903L33.8828 8.53433C34.3933 9.17932 34.6673 9.97783 34.6673 10.7967L34.6657 31.9995L34.6592 32.2908C34.5126 35.1886 32.189 37.5118 29.2913 37.6587L29 37.6668H11.0003C7.96836 37.6668 5.49269 35.2851 5.34115 32.2908L5.33301 31.9995ZM26.0003 22.3332L26.1712 22.3413C27.0114 22.4269 27.667 23.137 27.667 23.9998C27.667 24.8626 27.0114 25.5728 26.1712 25.6584L26.0003 25.6665H14C13.0797 25.6663 12.3333 24.9202 12.3333 23.9998C12.3333 23.0795 13.0797 22.3333 14 22.3332H26.0003ZM26.0003 16.3338L26.1712 16.3419C27.0114 16.4275 27.667 17.1377 27.667 18.0005C27.6667 18.8629 27.0112 19.5718 26.1712 19.6574L26.0003 19.6671H14C13.0799 19.667 12.3337 18.9206 12.3333 18.0005C12.3333 17.0801 13.0797 16.334 14 16.3338H26.0003ZM18.0007 10.3328L18.1699 10.341C19.0107 10.4259 19.6672 11.1364 19.6673 11.9995C19.6673 12.8627 19.0107 13.573 18.1699 13.658L18.0007 13.6662H14C13.0797 13.666 12.3333 12.9199 12.3333 11.9995C12.3335 11.0793 13.0798 10.333 14 10.3328H18.0007ZM26.6676 9.99918C26.6676 10.1831 26.8159 10.3325 26.9997 10.3328H31.0068C30.535 9.84647 29.9439 9.24363 29.4362 8.75406L28.8893 8.24136C28.08 7.51725 27.2598 6.68502 26.6676 6.07014V9.99918ZM8.66634 31.9995L8.67773 32.2388C8.7974 33.4152 9.79234 34.3335 11.0003 34.3335H29L29.2376 34.3205C30.3359 34.2092 31.2093 33.3369 31.321 32.2388L31.3324 31.9995L31.334 13.6662H26.9997C24.9749 13.6658 23.3343 12.024 23.3343 9.99918V5.66649H11.0003C9.71167 5.66649 8.66635 6.71182 8.66634 8.00048V31.9995Z"
                                                            fill="currentColor"
                                                        ></path>
                                                    </svg>
                                                </div>

                                                <h1>
                                                    Bạn chưa có giao dịch nào
                                                    gần đây
                                                </h1>

                                                <p>
                                                    Khi bạn thực hiện thanh toán
                                                    hoặc mua gói dịch vụ, lịch
                                                    sử giao dịch sẽ được hiển
                                                    thị tại đây.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody className="payments-history__tbody">
                                    {payments.data.map((p, index) => (
                                        <tr
                                            key={p.id}
                                            className="payments-history__row"
                                        >
                                            <td className="payments-history__cell payments-history__cell--id">
                                                {(payments.current_page - 1) *
                                                    payments.per_page +
                                                    index +
                                                    1}
                                            </td>

                                            <td className="payments-history__cell">
                                                {p.order_id ?? p.transaction_id}
                                            </td>
                                            <td className="payments-history__cell">
                                                {p.subscription?.name ?? '-'}
                                            </td>
                                            <td className="payments-history__cell">
                                                {p.days}
                                            </td>
                                            <td className="payments-history__cell payments-history__cell--amount">
                                                {Number(
                                                    p.amount,
                                                ).toLocaleString()}{' '}
                                                {p.currency}
                                            </td>
                                            <td className="payments-history__cell">
                                                {p.method.toUpperCase()}
                                            </td>
                                            <td
                                                className={`payments-history__cell payments-history__status payments-history__status--${p.status}`}
                                            >
                                                {p.status === 'success' &&
                                                    'Thành công'}
                                                {p.status === 'pending' &&
                                                    'Đang xử lý'}
                                                {p.status === 'failed' &&
                                                    'Thất bại'}
                                            </td>
                                            <td className="payments-history__cell">
                                                {new Date(
                                                    p.created_at,
                                                ).toLocaleString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="payments-history__pagination">
                        {payments.links.map((link, i) => (
                            <button
                                key={i}
                                className={`payments-history__page-btn ${
                                    link.active
                                        ? 'payments-history__page-btn--active'
                                        : ''
                                }`}
                                disabled={!link.url}
                                onClick={() =>
                                    link.url && router.visit(link.url)
                                }
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                </>
            </section>
        </>
    );
}

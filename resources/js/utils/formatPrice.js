/**
 * Format giá tiền theo chuẩn BĐS Việt Nam
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
    if (typeof price !== 'number') return '';

    if (price >= 1_000_000_000) {
        return (
            (price / 1_000_000_000)
                .toFixed(1)
                .replace('.', ',') + ' tỷ'
        );
    }

    if (price >= 1_000_000) {
        return (
            (price / 1_000_000)
                .toFixed(1)
                .replace('.', ',') + ' triệu'
        );
    }

    return price.toLocaleString('vi-VN');
}

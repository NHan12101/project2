export default function Pagination({ meta, onPageChange }) {
    if (!meta) return null;

    const { current_page, last_page } = meta;

    if (last_page <= 1) return null; // Nếu chỉ có 1 trang thì không hiển thị

    const pages = [];
    for (let i = 1; i <= last_page; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination">
            <button
                disabled={current_page === 1}
                onClick={() => onPageChange(current_page - 1)}
            >
                Prev
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    className={page === current_page ? 'active' : ''}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            <button
                disabled={current_page === last_page}
                onClick={() => onPageChange(current_page + 1)}
            >
                Next
            </button>
        </div>
    );
}

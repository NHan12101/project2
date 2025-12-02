import { router } from '@inertiajs/react';
import React from 'react';

export default function Pagination({ meta, filters }) {
    if (!meta?.last_page || meta.last_page <= 1) return null;

    const { current_page, last_page } = meta;

    const goToPage = (pageNumber) => {
        if (pageNumber === '...' || pageNumber < 1 || pageNumber > last_page) return;
        router.get('/home-finder', { ...filters, page: pageNumber }, {
            preserveState: true,
            replace: true,
            scroll: 'top',
        });
    };

    const getPageNumbers = () => {
        const pages = [];
        const delta = 2; // số trang trước và sau current_page
        let start = Math.max(2, current_page - delta);
        let end = Math.min(last_page - 1, current_page + delta);

        pages.push(1); // luôn có trang đầu
        if (start > 2) pages.push('...');

        for (let i = start; i <= end; i++) pages.push(i);

        if (end < last_page - 1) pages.push('...');
        if (last_page > 1) pages.push(last_page); // luôn có trang cuối

        return pages;
    };

    return (
        <div className="pagination">
            <button
                onClick={() => goToPage(current_page - 1)}
                disabled={current_page === 1}
                className="pagination-btn"
            >
                Prev
            </button>

            {getPageNumbers().map((pageNumber, idx) =>
                pageNumber === '...' ? (
                    <span key={`dots-${idx}`} className="pagination-ellipsis">…</span>
                ) : (
                    <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`pagination-btn ${pageNumber === current_page ? 'active' : ''}`}
                    >
                        {pageNumber}
                    </button>
                )
            )}

            <button
                onClick={() => goToPage(current_page + 1)}
                disabled={current_page === last_page}
                className="pagination-btn"
            >
                Next
            </button>
        </div>
    );
}

import { usePage } from '@inertiajs/react';
import useDropdown from '@/hooks/useDropdown.js';
import { useEffect, useState } from 'react';


export default function Suggest({ value, onChange, classContainer = '', classInput = '', classScroll }) {
    const { suggestTitles } = usePage().props;
    const { menuRef: suggestionsRef, open: openSuggestions, setOpen: setOpenSuggestions } = useDropdown();

    // Gợi ý lọc theo tên bài đăng
    const [suggestions, setSuggestions] = useState([]);

    // ========== NORMALIZE =================
    function normalizeText(text) {
        if (!text) return '';

        return text
            ?.normalize('NFD')                       // 1. Tách ký tự có dấu thành ký tự + dấu
            .replace(/[\u0300-\u036f]/g, '')         // 2. Loại bỏ toàn bộ dấu
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')   // 3. Cho phép giữ đ và Đ
            .replace(/[^a-zA-Z0-9\s]/g, '')          // 4. Xóa mọi ký tự không phải chữ cái hoặc số
            .toLowerCase();
    }

    function matchKeywords(title, keyword) {
        const nTitle = normalizeText(title);
        const words = normalizeText(keyword).split(/\s+/).filter(Boolean);
        return words.every(w => nTitle.includes(w));
    }

    // ========== FILTER ===============
    useEffect(() => {
        if (!value.trim()) {
            setSuggestions([]);
            return;
        }

        setSuggestions(
            suggestTitles
                .filter((title) => matchKeywords(title, value))
                .slice(0, 10)
        );
    }, [value, suggestTitles]);

    return (
        <div className={classContainer} ref={suggestionsRef}>
            <div className="search-bar__02--icon-search">
                <img src="/icons/icon-search.svg" alt="Tìm kiếm" />
            </div>

            <input
                type="text"
                autoComplete="off"
                className={classInput}
                placeholder="Tìm bất động sản..."
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setOpenSuggestions(!!e.target.value.trim());
                }}
                onFocus={() => {
                    if (value.trim()) setOpenSuggestions(true);
                }}
            />

            {openSuggestions && (
                <div className={classScroll ? 'suggestions-box__scroll' : 'suggestions-box'}>
                    <div className='suggestion-item'>
                        <div className='suggestion-content'>
                            <span style={{ textAlign: 'left', width: '100%' }}>{`Tìm kiếm từ khóa "${value}"`}</span>

                            <svg
                                data-type="monochrome"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill="none">
                                <path
                                    d="M12.1436 7.27547C12.5186 6.91847 13.0986 6.91029 13.4834 7.24032L13.5576 7.31063L17.7246 11.6856C18.092 12.0717 18.092 12.6784 17.7246 13.0645L13.5576 17.4395L13.4834 17.5098C13.0986 17.8399 12.5186 17.8317 12.1436 17.4747C11.7436 17.0938 11.7285 16.4606 12.1094 16.0606L14.667 13.3751H7C6.44772 13.3751 6 12.9274 6 12.3751C6 11.8228 6.44772 11.3751 7 11.3751H14.667L12.1094 8.68954L12.042 8.61239C11.7314 8.21192 11.7686 7.63254 12.1436 7.27547Z"
                                    fill="currentColor">
                                </path>
                            </svg>
                        </div>
                    </div>

                    {suggestions.map((title, index) => (
                        <div
                            key={index}
                            className="suggestion-item"
                            onClick={() => onChange(title)}
                        >
                            <div className='suggestion-content'>
                                <svg
                                    data-type="monochrome"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    fill="none"
                                >
                                    <path
                                        d="M18.2798 11.4399C18.2797 7.66239 15.2175 4.6001 11.4399 4.6001C7.66244 4.60018 4.60018 7.66244 4.6001 11.4399C4.6001 15.2175 7.66239 18.2797 11.4399 18.2798C15.2176 18.2798 18.2798 15.2176 18.2798 11.4399ZM20.2798 11.4399C20.2798 13.5439 19.5432 15.4748 18.3159 16.9927L21.0952 19.6812L21.1655 19.7563C21.4922 20.1438 21.4786 20.7232 21.1187 21.0952C20.7586 21.4674 20.1798 21.5 19.7817 21.186L19.7046 21.1187L16.8901 18.396C15.3881 19.5745 13.4972 20.2798 11.4399 20.2798C6.55782 20.2797 2.6001 16.3221 2.6001 11.4399C2.60018 6.55787 6.55787 2.60018 11.4399 2.6001C16.3221 2.6001 20.2797 6.55782 20.2798 11.4399Z"
                                        fill="#C0C0C0"
                                    />
                                </svg>

                                <span>{title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

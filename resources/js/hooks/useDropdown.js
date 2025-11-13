import { useState, useRef, useEffect, useCallback } from 'react';

export default function useDropdown() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClickOutside = useCallback((event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    return { menuRef, open, setOpen };
}

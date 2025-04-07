import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Search.module.scss';
import { SearchIcon, CloseCircleIcon } from '~/components/Icons';
import { useSearch } from '~/contexts/SearchContext';
import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);

function Search() {
    const [isSearch, setIsSearch] = useState(false);
    const { searchValue, setSearchValue } = useSearch();

    const inputRef = useRef(null);

    const location = useLocation();
    const isMenuPage = location.pathname.includes("/menu/");
    const isInvoicePage = location.pathname.includes("/invoice");

    const debouncedSearchValue = useDebounce(searchValue, 1000);

    useEffect(() => {
        if (isInvoicePage) {
            // thực hiện search logic ở đây bằng debouncedSearchValue
            console.log("Debounced search for invoice:", debouncedSearchValue);
        }
    }, [debouncedSearchValue, isInvoicePage]);

    const handleChange = (e) => {
        const searchValue = e.target.value;

        if(!searchValue.startsWith(' ')) {
            setSearchValue(e.target.value);
            setIsSearch(true);
        }
        
        if(searchValue === '') {
            setIsSearch(false);
        }

    };

    const handleClear = () => {
        setSearchValue('');
        setIsSearch(false);
        inputRef.current.focus();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('search')}>
                <div className={cx('search-btn')}>
                    <SearchIcon />
                </div>
                <input
                    ref={inputRef}
                    value={searchValue}
                    onChange={handleChange}
                    className={cx('input')}
                    type="text"
                    placeholder={isMenuPage ? "Bạn muốn tìm món gì ?" : "Nhập số điện thoại"}
                />
                {isSearch && (
                    <div className={cx('close-btn')} onClick={handleClear}>
                        <CloseCircleIcon />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;

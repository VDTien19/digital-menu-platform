import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Search.module.scss';
import { SearchIcon, CloseCircleIcon, LoadingIcon } from '~/components/Icons';
import { useSearch } from '~/contexts/SearchContext';
import { useDebounce } from '~/hooks';
import  * as httpRequest from '~/utils/httpRequest';

const cx = classNames.bind(styles);

function Search() {
    const [isSearch, setIsSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [placeholder, setPlaceholder] = useState('Nhập để tìm kiếm');

    const { searchValue, setSearchValue, setInvoices } = useSearch();

    const inputRef = useRef(null);

    const location = useLocation();
    const isMenuPage = location.pathname.includes('/menu/');
    const isInvoicePage = location.pathname.includes('/invoice');

    const debouncedSearchValue = useDebounce(searchValue, 600);

    useEffect(() => {
        if (isInvoicePage && searchValue.trim() !== '') {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [searchValue, isInvoicePage]);

    useEffect(() => {
        const fetchInvoices = async () => {
            if (isInvoicePage && debouncedSearchValue.trim() !== '') {
                setLoading(true);
                try {
                    setLoading(true);
                    const response = await httpRequest.get(`invoices?customer_phone=${debouncedSearchValue}`);
                    setInvoices(response);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchValue, isInvoicePage]);

    // useEffect(() => {
    //     console.log("loading state changed:", loading);
    // }, [loading]);

    const handleChange = (e) => {
        const searchValue = e.target.value;

        if (!searchValue.startsWith(' ')) {
            setSearchValue(e.target.value);
            setIsSearch(true);
        }

        if (searchValue === '') {
            setIsSearch(false);
        }
    };

    const handleClear = () => {
        setSearchValue('');
        setIsSearch(false);
        inputRef.current.focus();
    };

    const handleKeyDown = (e) => {
        if (isInvoicePage) {
            if (
                e.key === 'e' ||
                e.key === 'E' ||
                e.key === '+' ||
                e.key === '-' ||
                e.key === '.'
            ) {
                e.preventDefault();
            }
        }
    };

    useEffect(() => {
        if (isMenuPage) {
            setPlaceholder('Bạn muốn tìm món gì');
        } else if (isInvoicePage) {
            setPlaceholder('Nhập để tìm kiếm hóa đơn');
        } else {
            setPlaceholder('Nhập để tìm kiếm');
        }
    }, [isMenuPage, isInvoicePage])

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
                    placeholder={
                        placeholder
                    }
                    type={isInvoicePage ? 'number' : 'text'}
                    inputMode={isInvoicePage ? 'numeric' : ''}
                    pattern={isInvoicePage ? '[0-9]*' : ''}
                    autoComplete={isInvoicePage ? 'off' : ''}
                    onKeyDown={handleKeyDown}
                />
                {isSearch && (
                    <div className={cx('icon-btn')}>
                        {loading ? (
                            <div className={cx('loading-btn')}><LoadingIcon /></div>
                        ) : (
                            <div className={cx('close-btn')} onClick={handleClear}><CloseCircleIcon /></div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;

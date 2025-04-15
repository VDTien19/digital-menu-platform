import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './AdminSearch.module.scss';
import { SearchIcon, CloseCircleIcon, LoadingIcon } from '~/components/Icons';
import { useSearch } from '~/contexts/SearchContext';
import { searchByPath } from '~/utils/searchHandler';

const cx = classNames.bind(styles);


function AdminSearch() {
    const [isSearch, setIsSearch] = useState(false);
    const inputRef = useRef(null);
    const location = useLocation();

    const {
        searchValue, setSearchValue,
        loading, setLoading,
        setCategories, setDishes, setTables, setStaff, setInvoices
    } = useSearch();

    useEffect(() => {
        return () => {
            setSearchValue('');
            setIsSearch(false);
        };
    }, [location.pathname, setSearchValue]);

    const handleChange = (e) => {
        const value = e.target.value;
        if (!value.startsWith(' ')) {
            setSearchValue(value);
            setIsSearch(true);
        }
        if (value === '') setIsSearch(false);
    };

    const handleClear = () => {
        setSearchValue('');
        setIsSearch(false);
        setCategories([]);
        setDishes([]);
        setTables([]);
        setStaff([]);
        setInvoices([]);
        inputRef.current.focus();
    };

    const handleSearchClick = async () => {
        if (searchValue.trim() === '') return;
        setLoading(true);

        try {
            await searchByPath(location.pathname, searchValue, {
                setCategories, setDishes, setTables, setStaff, setInvoices
            });
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('search')}>
                <input
                    ref={inputRef}
                    value={searchValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={cx('input')}
                    placeholder='Nhập để tìm kiếm'
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
                <div
                    className={cx('search-btn')}
                    onClick={handleSearchClick}
                >
                    <SearchIcon width='2rem' height='2rem' />
                </div>
            </div>
        </div>
    );
}


export default AdminSearch;
import {  } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Header.module.scss';
import Search from '~/layouts/components/Search';
import Menu from '~/layouts/components/Menu';
import { HomeIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function Header () {

    const location = useLocation();
    const isMenuPage = location.pathname.includes("/menu/");

    return (
        <div className={cx('wrapper')}>
            <div className={cx('flex', 'items-center')}>
                <Link to="/res-ktn">
                    <div className={cx('home-icon', 'mr-4', 'flex', 'items-center', 'justify-center')}>
                        <HomeIcon />
                    </div>
                </Link>
                <div className={cx('search', 'flex-1')}>
                    <Search />
                </div>
            </div>
            {isMenuPage && (
                <div className={cx('category', 'mt-2')}>
                    <Menu />
                </div>
            )}
        </div>
    );
}

export default Header;

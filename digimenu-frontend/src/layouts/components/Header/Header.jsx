import {  } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Header.module.scss';
import Search from '~/layouts/components/Search';
import CategoryMenu from '~/layouts/components/CategoryMenu';
import { HomeIcon } from '~/components/Icons';
import { useSlug } from '~/contexts/SlugContext';

const cx = classNames.bind(styles);

function Header () {

    const { slug } = useSlug();
    const { tableName } = useParams();

    const toUrl = `/${slug}?tableName=${tableName}`;

    const location = useLocation();
    const isMenuPage = location.pathname.includes("/menu/");

    return (
        <div className={cx('wrapper')}>
            <div className={cx('flex', 'items-center')}>
                <Link to={toUrl}>
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
                    <CategoryMenu />
                </div>
            )}
        </div>
    );
}

export default Header;

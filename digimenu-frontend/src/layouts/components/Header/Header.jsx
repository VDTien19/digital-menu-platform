import {  } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';

import styles from './Header.module.scss';
import Search from '~/layouts/components/Search';
import CategoryMenu from '~/layouts/components/CategoryMenu';
import { HomeIcon, CartIcon } from '~/components/Icons';
import { useSlug } from '~/contexts/SlugContext';

const cx = classNames.bind(styles);

function Header () {
    const { totalQuantity } = useSelector(state => state.cart);

    const { slug } = useSlug();
    const { tableName } = useParams();

    const toMenuUrl = `/${slug}?tableName=${tableName}`;
    const toHomeUrl = `/${slug}`;
    const toCartUrl = `/${slug}/cart/${tableName}`;

    const location = useLocation();
    const isMenuPage = location.pathname.includes("/menu/");

    return (
        <div className={cx('wrapper')}>
            <div className={cx('flex', 'items-center')}>
                <Link to={isMenuPage ? toMenuUrl : toHomeUrl}>
                    <div className={cx('home-icon', 'mr-4', 'flex', 'items-center', 'justify-center')}>
                        <HomeIcon />
                    </div>
                </Link>
                
                <div className={cx('search', 'flex-1')}>
                    <Search />
                </div>

                {isMenuPage && (
                    <Link to={toCartUrl} className={cx('cart-wrapper', 'block', 'p-2', 'ml-2')}>
                        <div className={cx('cart-icon', 'flex', 'items-center', 'justify-center', 'relative', 'w-full', 'h-full')}>
                            <CartIcon width='1.8rem' height='1.8rem' className={cx('absolute', 'bottom-1/2', 'right-1/2', 'translate-1/2')} />
                            {totalQuantity >= 1 && 
                                <div className={cx('badge-wrapper', 'absolute', '-top-4', '-right-3', 'z-10', 'font-bold', 'p-0.5')}>
                                    <span className={cx('badge', 'text-base')}>{totalQuantity}</span>
                                </div>
                            }
                        </div>
                    </Link>
                )}
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

import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './CategoryItem.module.scss';
import ProductList from '~/components/ProductList';

const cx = classNames.bind(styles);

function CategoryItem ({ title, products }) {
    return (
        <div className={cx('wrapper', 'mt-4')}>
            <div className={cx('title-wrapper', 'flex', 'items-center', 'justify-between')}>
                <div className={cx('title-bg')}>
                    <div className={cx('line')}/>
                </div>
                <span className={cx('title')}>{title}</span>
            </div>
            <ProductList products={products} />
        </div>
    );
}

export default CategoryItem;

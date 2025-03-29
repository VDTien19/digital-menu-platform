import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './ProductList.module.scss';
import ProductCard from '~/components/ProductCard';

const cx = classNames.bind(styles);

function ProductList ({ products }) {
    return (
        <div className={cx('wrapper')}>
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}

export default ProductList;

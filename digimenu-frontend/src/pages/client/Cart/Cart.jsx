import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Cart.module.scss';

const cx = classNames.bind(styles);

function Cart () {
    return (
        <div className={cx('wrapper')}>
            <h1>Cart Client Page</h1>
        </div>
    );
}

export default Cart;

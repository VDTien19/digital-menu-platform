import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Orders.module.scss';

const cx = classNames.bind(styles);

function Orders () {
    return (
        <div className={cx('wrapper')}>
            <h1>Orders Service Page</h1>
        </div>
    );
}

export default Orders;

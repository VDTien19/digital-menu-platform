import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Payment.module.scss';

const cx = classNames.bind(styles);

function Payment () {
    return (
        <div className={cx('wrapper')}>
            <h1>Payment Service Page</h1>
        </div>
    );
}

export default Payment;

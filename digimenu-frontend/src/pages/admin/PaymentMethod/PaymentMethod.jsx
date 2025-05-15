import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './PaymentMethod.module.scss';

const cx = classNames.bind(styles);

function PaymentMethod () {
    return (
        <div className={cx('wrapper')}>
            <h1>PaymentMethod</h1>
        </div>
    );
}

export default PaymentMethod;

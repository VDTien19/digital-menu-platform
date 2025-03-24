import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Invoice.module.scss';

const cx = classNames.bind(styles);

function Invoice () {
    return (
        <div className={cx('wrapper')}>
            <h1>Invoice Client Page</h1>
        </div>
    );
}

export default Invoice;

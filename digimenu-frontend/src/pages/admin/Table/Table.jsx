import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Table.module.scss';

const cx = classNames.bind(styles);

function Table () {
    return (
        <div className={cx('wrapper')}>
            <h1>Table Admin Page</h1>
        </div>
    );
}

export default Table;

import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Staff.module.scss';

const cx = classNames.bind(styles);

function Staff () {
    return (
        <div className={cx('wrapper')}>
            <h1>Staff Admin Page</h1>
        </div>
    );
}

export default Staff;

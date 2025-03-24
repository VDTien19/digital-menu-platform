import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Dashboard.module.scss';

const cx = classNames.bind(styles);

function Dashboard () {
    return (
        <div className={cx('wrapper')}>
            <h1>Dashboard Admin Page</h1>
        </div>
    );
}

export default Dashboard;

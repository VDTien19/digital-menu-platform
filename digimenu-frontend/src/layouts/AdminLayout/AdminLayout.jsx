import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './AdminLayout.module.scss';

const cx = classNames.bind(styles);

function AdminLayout ({ children }) {
    return (
        <div className={cx('wrapper', 'flex')}>
            <div className={cx('sidebar')}>SideBar</div>
            <div className={cx('content')}>
                {children}
            </div>
        </div>
    );
}

export default AdminLayout;

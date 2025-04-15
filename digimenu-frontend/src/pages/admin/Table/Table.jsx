import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Table.module.scss';
import AdminContentHeader from '~/components/admin/AdminContentHeader';

const cx = classNames.bind(styles);

function Table () {
    return (
        <div className={cx('wrapper')}>
            <AdminContentHeader title="Quản lý bàn" titleBtn="Thêm mới" onClick={() => console.log('Click button')} />
        </div>
    );
}

export default Table;

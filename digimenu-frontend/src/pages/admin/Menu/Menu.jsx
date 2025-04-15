import {  } from 'react';
import classNames from 'classnames/bind';
import { useSearchParams } from 'react-router-dom';

import styles from './Menu.module.scss';
import AdminContentHeader from '~/components/admin/AdminContentHeader';

const cx = classNames.bind(styles);

function Menu () {
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name');
    
    return (
        <div className={cx('wrapper')}>
            <AdminContentHeader title="Quản lý sản phẩm" titleBtn="Thêm mới" onClick={() => console.log('Click button')} />
            <div>{name}</div>
        </div>
    );
}

export default Menu;

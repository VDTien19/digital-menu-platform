import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Staff.module.scss';
import AdminContentHeader from '~/components/admin/AdminContentHeader';
import DataTable from '~/components/admin/DataTable';
import TableActions from '~/components/admin/TableActions';

const cx = classNames.bind(styles);

const staffColumns = [
    { key: 'index', label: 'STT', cellClass: 'cell-order', headClass: 'head-order' },
    { key: 'name', label: 'Tên' },
    { key: 'avatar', label: 'Ảnh', render: (value) => <img src={value} alt="avatar" style={{ width: 60 }} />, cellClass: 'cell-images' },
    { key: 'pass', label: 'Pass', cellClass: 'cell-pasword' },
    { key: 'actions', label: '', render: (_, row) => <TableActions data={row} onView={() => {console.log("Xem")}} onEdit={() => console.log("Sửa")} onDelete={() => console.log("Xoá")} />, cellClass: 'cell-actions' },
];

const staffData = [
    { index: 1, name: 'Nguyễn Văn A', avatar: 'https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg', pass: '••••••' },
    { index: 2, name: 'Lê Văn B', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXWH_Uk5GhUcs_IXcOtmVodFFYSDVF-blVVw&s', pass: '••••••' },
];

function Staff () {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('mb-8')}><AdminContentHeader title="Quản lý danh mục" titleBtn="Thêm mới" onClick={() => console.log('Click button')} /></div>
            <DataTable columns={staffColumns} data={staffData} />
        </div>
    );
}

export default Staff;

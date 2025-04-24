import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './DataTable.module.scss';

const cx = classNames.bind(styles);

// Component DataTable: hiển thị bảng dữ liệu dạng linh hoạt dựa vào columns và data truyền vào
function DataTable({ columns, data }) {
    return (
        // Wrapper toàn bộ bảng
        <div className={cx('cus-table', 'w-full')}>

            {/* ===== Table Header ===== */}
            <div className={cx('cus-table-header', 'w-full', 'flex', 'justify-between', 'items-center', 'px-4')}>
                {/* Duyệt qua danh sách column để tạo header cho từng cột */}
                {columns.map((col, index) => (
                    <div
                        key={index}
                        className={cx('cus-table-cell', 'flex-1', 'text-center', 'font-medium', col.headClass)} // sử dụng headClass nếu có
                    >
                        {col.label} {/* Tên hiển thị của cột */}
                    </div>
                ))}
            </div>

            {/* ===== Table Body ===== */}
                {/* <div style={{ height: 10, zIndex: 10, background: 'white' }} /> */}
            <div className={cx('cus-table-body', 'w-full', 'bg-white', 'rounded-2xl')}>
                {/* Duyệt qua từng dòng dữ liệu */}
                {data.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={cx('cus-table-row', 'w-full', 'flex', 'justify-between', 'items-center', 'py-6')}
                    >
                        {/* Duyệt qua từng column để hiển thị dữ liệu tương ứng trong hàng */}
                        {columns.map((col, colIndex) => (
                            <div
                                key={colIndex}
                                className={cx('cus-table-cell', 'flex-1', col.cellClass)} // cellClass để style riêng cho từng ô
                            >
                                {/* Nếu column có hàm render thì gọi để custom content, không thì lấy dữ liệu trực tiếp theo key */}
                                {col.render ? col.render(row[col.key], row) : row[col.key]}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}


export default DataTable;

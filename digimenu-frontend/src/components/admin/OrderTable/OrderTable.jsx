import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames/bind';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import styles from './OrderTable.module.scss';
import DataTable from '~/components/admin/DataTable';

const cx = classNames.bind(styles);

function OrderTable({ orders }) {
    const [selectedFilter, setSelectedFilter] = useState('Chờ xử lý');

    // Local state chỉ dùng để cập nhật trạng thái trên UI nếu thay đổi
    const [orderStatuses, setOrderStatuses] = useState({});

    // Danh sách đơn đã được lọc theo trạng thái từ API, không dùng local state
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const id = order._id;
            const status = orderStatuses[id] ?? order.status ?? 'Chờ xử lý';
            return status === selectedFilter;
        });
    }, [orders, selectedFilter, orderStatuses]);

    // Tính toán số lượng đơn theo từng trạng thái
    const statusCounts = useMemo(() => {
        const counts = {
            'Chờ xử lý': 0,
            'Đã nhận đơn': 0,
            // thêm trạng thái khác nếu có
        };

        orders.forEach((order) => {
            const id = order._id;
            const status = orderStatuses[id] ?? order.status ?? 'Chờ xử lý';

            if (counts[status] !== undefined) {
                counts[status]++;
            }
        });

        return counts;
    }, [orders, orderStatuses]);

    // Hàm xử lý khi thay đổi trạng thái
    const handleStatusChange = (orderId, newStatus) => {
        setOrderStatuses((prev) => ({
            ...prev,
            [orderId]: newStatus,
        }));
    };

    const columns = [
        {
            key: '',
            label: 'STT',
            cellClass: 'text-left pl-4 hidden sm:block',
            headClass: 'text-left hidden sm:block',
            render: (_, __, rowIndex) => rowIndex + 1,
        },
        {
            key: 'table_number',
            label: 'Bàn',
            headClass: 'text-left pl-4 hidden sm:block',
            cellClass: 'text-left hidden sm:block',
            render: (_, row) => (
                <span className="font-medium">Bàn {row.table_number}</span>
            ),
        },
        {
            key: 'dish',
            label: 'Món ăn',
            headClass: 'flex-2',
            cellClass: 'flex-2 pl-8',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <img
                        src={row.image_url}
                        alt={row.dish_name}
                        className="w-10 h-10 rounded"
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <span className={cx('dish-name', 'mr-2')}>
                                {row.dish_name}
                            </span>
                            <span className="text-xs w-6 h-6 border border-gray-400 flex items-center justify-center rounded-md">
                                x{row.quantity}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">
                            {row.price?.toLocaleString()} ₫
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            headClass: 'text-left pl-16',
            cellClass: 'text-left',
            render: (_, row) => {
                const orderId = row._id;
                const currentStatus =
                    orderStatuses[orderId] ?? row.status ?? 'Chờ xử lý';

                return (
                    <select
                        className={cx('status-select')}
                        value={currentStatus}
                        onChange={(e) =>
                            handleStatusChange(orderId, e.target.value)
                        }
                    >
                        <option value="Chờ xử lý">Chờ xử lý</option>
                        <option value="Đã nhận đơn">Đã nhận đơn</option>
                    </select>
                );
            },
        },
        {
            key: 'updated_at',
            label: 'Tạo/Cập nhật',
            headClass: '',
            cellClass: 'text-center',
            render: (value) => (
                <div className="text-xl font-medium">
                    {value && new Date(value).toLocaleTimeString('vi-VN')}
                    <br />
                    {value && new Date(value).toLocaleDateString('vi-VN')}
                </div>
            ),
        },
        {
            key: 'actions',
            label: '',
            cellClass: 'text-center',
            render: () => (
                <button className="text-gray-500 hover:text-black">⋯</button>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            {/* Hàng thống kê và bộ lọc */}
            <div className="flex items-center justify-between px-4 flex-wrap gap-3">
                {/* Thống kê số lượng theo trạng thái */}
                <div className="flex gap-2 flex-wrap">
                    {Object.entries(statusCounts).map(([label, count]) => (
                        <div
                            key={label}
                            className="bg-[#262f3f] text-white text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1"
                        >
                            {label}: <span>{count}</span>
                        </div>
                    ))}
                </div>

                {/* Bộ lọc trạng thái */}
                <div>
                    <select
                        className="px-3 py-1 rounded-md border border-gray-300 text-sm"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        {Object.keys(statusCounts).map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <DataTable columns={columns} data={filteredOrders} />
        </div>
    );
}

export default OrderTable;

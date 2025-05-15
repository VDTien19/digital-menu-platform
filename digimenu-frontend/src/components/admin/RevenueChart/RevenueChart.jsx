import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Dot,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// import InvoiceModal from '~/components/admin/InvoiceModal';
import InvoicePanel from '~/components/admin/InvoicePanel';
import DateFilter from '~/components/admin/DateFilter';

import styles from './RevenueChart.module.scss';

const cx = classNames.bind(styles);

const mockData = [
    { date: '2025-05-01', revenue: 520000 },
    { date: '2025-05-02', revenue: 880000 },
    { date: '2025-05-03', revenue: 630000 },
    { date: '2025-05-04', revenue: 470000 },
    { date: '2025-05-05', revenue: 1020000 },
    { date: '2025-05-06', revenue: 780000 },
    { date: '2025-05-07', revenue: 920000 },
    { date: '2025-05-08', revenue: 1100000 },
    { date: '2025-05-09', revenue: 450000 },
    { date: '2025-05-10', revenue: 980000 },
    { date: '2025-05-11', revenue: 560000 },
    { date: '2025-05-12', revenue: 720000 },
    { date: '2025-05-13', revenue: 1340000 },
    { date: '2025-05-14', revenue: 890000 },
    { date: '2025-05-15', revenue: 700000 },
    { date: '2025-05-16', revenue: 610000 },
    { date: '2025-05-17', revenue: 1250000 },
    { date: '2025-05-18', revenue: 460000 },
    { date: '2025-05-19', revenue: 570000 },
    { date: '2025-05-20', revenue: 980000 },
    { date: '2025-05-21', revenue: 880000 },
    { date: '2025-05-22', revenue: 1310000 },
    { date: '2025-05-23', revenue: 1440000 },
    { date: '2025-05-24', revenue: 530000 },
    { date: '2025-05-25', revenue: 1190000 },
    { date: '2025-05-26', revenue: 600000 },
    { date: '2025-05-27', revenue: 810000 },
    { date: '2025-05-28', revenue: 430000 },
    { date: '2025-05-29', revenue: 970000 },
    { date: '2025-05-30', revenue: 1500000 },
    { date: '2025-05-31', revenue: 690000 },
];

// const mockInvoices = {
//   '2025-05-01': [
//     { id: 'HD001', total: 220000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 },
//     { id: 'HD002', total: 300000 }
//   ],
//   '2025-05-02': [
//     { id: 'HD003', total: 880000 }
//   ],
//   // ... thêm ngày khác nếu cần
// };

export default function RevenueChart() {
    const [selectedDate, setSelectedDate] = useState(null);
    const totalRevenue = mockData.reduce((sum, item) => sum + item.revenue, 0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 500);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <motion.div
                className={cx('chart-wrapper', 'flex', 'gap-4', 'items-start')}
                layout
                transition={{ duration: 2, ease: 'easeInOut' }}
            >
                <motion.div
                    className="w-full"
                    layout
                    transition={{ duration: 2, ease: 'easeInOut' }}
                >
                    <div className="mb-4">
                        <DateFilter />
                    </div>
                    <div className="p-4 bg-white rounded-xl shadow relative">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold">
                                Doanh thu theo ngày
                            </h2>
                            <span className="text-lg text-gray-500">
                                Tổng: {totalRevenue.toLocaleString()} VND
                            </span>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={mockData}
                                onClick={(e) => {
                                    if (e && e.activeLabel)
                                        setSelectedDate(e.activeLabel);
                                }}
                            >
                                <CartesianGrid
                                    stroke="#f0f0f0"
                                    strokeDasharray="3 3"
                                />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip
                                    formatter={(val) =>
                                        `${val.toLocaleString()} VND`
                                    }
                                    labelFormatter={(label) => `Ngày: ${label}`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                    dot={
                                        <Dot
                                            r={4}
                                            stroke="#4f46e5"
                                            fill="#fff"
                                        />
                                    }
                                    animationDuration={2000}
                                    animationEasing="ease-in-out"
                                    isAnimationActive
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    className={cx('invoice-panel', 'overflow-hidden')}
                    animate={{
                        width: selectedDate ? (isMobile ? '100%' : 320) : 0,
                        maxHeight: selectedDate ? 416 : 0,
                        opacity: selectedDate ? 1 : 0,
                    }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    style={{ flexShrink: 0 }}
                >
                    {selectedDate && (
                        <InvoicePanel
                            date={selectedDate}
                            onClose={() => setSelectedDate(null)}
                        />
                    )}
                </motion.div>

                {/* <AnimatePresence>
                    {selectedDate && (
                        <motion.div
                            className={cx(
                                'invoice-panel',
                                'w-[350px]',
                                'h-[416px]',
                                'shrink-0',
                            )}
                            layout
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                            <InvoicePanel
                                date={selectedDate}
                                onClose={() => setSelectedDate(null)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence> */}
            </motion.div>
        </div>
    );
}

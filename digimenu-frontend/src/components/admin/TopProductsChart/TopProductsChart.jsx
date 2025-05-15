import React, { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from 'recharts';
import { useGetTopProductsQuery } from '~/store/dashboardSlice';

const getColor = (value, max) => {
    const ratio = value / max;
    if (ratio > 0.8) return '#4f46e5'; // Indigo-700
    if (ratio > 0.6) return '#6366f1'; // Indigo-500
    if (ratio > 0.4) return '#818cf8'; // Indigo-400
    if (ratio > 0.2) return '#a5b4fc'; // Indigo-300
    return '#c7d2fe'; // Indigo-200
};

function TopProductsChart() {
    const { data, isLoading, error } = useGetTopProductsQuery();
    const [limit, setLimit] = useState(5);
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = nhiều nhất, 'asc' = ít nhất

    const sortedData = useMemo(() => {
        if (!data) return [];
        const copied = [...data];
        copied.sort((a, b) =>
            sortOrder === 'desc'
                ? b.quantity - a.quantity
                : a.quantity - b.quantity,
        );
        return copied.slice(0, limit);
    }, [data, limit, sortOrder]);

    const maxQuantity = useMemo(() => {
        return data ? Math.max(...data.map((p) => p.quantity)) : 1;
    }, [data]);

    if (isLoading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div>Đã có lỗi khi tải dữ liệu sản phẩm</div>;

    return (
        <div className="bg-white p-4 rounded-xl shadow w-full space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-xl font-semibold">Top sản phẩm bán chạy</h3>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-gray-600">
                            Hiển thị:
                        </span>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                            className="border rounded px-2 py-1 h-10 font-medium cursor-pointer"
                            style={{ fontSize: '1.2rem' }}
                        >
                            <option value={5}>Top 5</option>
                            <option value={10}>Top 10</option>
                            <option value={15}>Top 15</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-gray-600">
                            Sắp xếp:
                        </span>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="border rounded px-2 py-1 h-10 font-medium cursor-pointer"
                            style={{ fontSize: '1.2rem' }}
                        >
                            <option value="desc">Nhiều nhất</option>
                            <option value="asc">Ít nhất</option>
                        </select>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={sortedData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={140}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value) => [`${value} đơn`, 'Số lượng']}
                        labelFormatter={(label) => `Sản phẩm: ${label}`}
                    />
                    <Bar
                        dataKey="quantity"
                        radius={[0, 6, 6, 0]}
                        isAnimationActive={true}
                        label={{ position: 'right', fontSize: 12 }}
                        fill="#8884d8"
                    >
                        {sortedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getColor(entry.quantity, maxQuantity)}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TopProductsChart;

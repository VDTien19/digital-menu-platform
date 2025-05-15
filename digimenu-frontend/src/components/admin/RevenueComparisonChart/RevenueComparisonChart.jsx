import React, { useMemo, useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    Dot,
} from 'recharts';
import YearSelector from './YearSelector';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

const RevenueComparisonChart = ({ data, onPointClick }) => {
    const allYears = useMemo(() => {
        if (!data || data.length === 0 || typeof data[0] !== 'object')
            return [];
        return Object.keys(data[0]).filter(
            (k) => /^\d{4}$/.test(k), // chỉ lấy các key là năm: "2022", "2023",...
        );
    }, [data]);

    const [visibleYears, setVisibleYears] = useState([]);

    useEffect(() => {
        setVisibleYears(allYears);
    }, [allYears]);

    // Tìm điểm cao nhất mỗi năm
    const maxPoints = useMemo(() => {
        const result = {};
        allYears.forEach((year) => {
            result[year] = data.reduce((acc, cur) => {
                if (!acc || cur[year] > acc.value) {
                    return { month: cur.month, value: cur[year] };
                }
                return acc;
            }, null);
        });
        return result;
    }, [data]);

    return (
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-semibold">
                📈 So sánh doanh thu theo tháng
            </h3>

            <YearSelector
                allYears={allYears}
                visibleYears={visibleYears}
                onChange={setVisibleYears}
            />

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                    <Legend />

                    {visibleYears.map((year, index) => (
                        <Line
                            key={year}
                            type="monotone"
                            dataKey={year}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={2}
                            dot={({ cx, cy, payload }) => {
                                const isMax =
                                    payload.month === maxPoints[year]?.month;
                                return (
                                    <g>
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={4}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke="#fff"
                                            strokeWidth={1.5}
                                            onClick={() =>
                                                onPointClick?.({
                                                    year,
                                                    month: payload.month,
                                                })
                                            }
                                            className="cursor-pointer"
                                        />
                                        {isMax && (
                                            <text
                                                x={cx}
                                                y={cy - 10}
                                                textAnchor="middle"
                                                fontSize="12"
                                                fill="#f87171"
                                            >
                                                🔥
                                            </text>
                                        )}
                                    </g>
                                );
                            }}
                            activeDot={{ r: 6 }}
                            isAnimationActive={true}
                            animationDuration={1800}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueComparisonChart;

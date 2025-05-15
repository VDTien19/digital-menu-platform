import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { startOfMonth, endOfMonth, subDays, subMonths, format } from 'date-fns';

import styles from './DateFilter.module.scss';

const cx = classNames.bind(styles);

const quickOptions = [
    {
        label: '7 ngày qua',
        value: 'last7days',
        getRange: () => {
            const to = new Date();
            const from = subDays(to, 6);
            return { from, to };
        },
    },
    {
        label: 'Tháng này',
        value: 'thisMonth',
        getRange: () => {
            const now = new Date();
            return {
                from: startOfMonth(now),
                to: endOfMonth(now),
            };
        },
    },
    {
        label: 'Tháng trước',
        value: 'lastMonth',
        getRange: () => {
            const now = subMonths(new Date(), 1);
            return {
                from: startOfMonth(now),
                to: endOfMonth(now),
            };
        },
    },
];

function DateFilter({ onChange }) {
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [activeOption, setActiveOption] = useState('');

    useEffect(() => {
        if (from && to) {
            onChange({ from, to });
        }
    }, [from, to, onChange]);

    const handleQuickSelect = (option) => {
        const { from, to } = option.getRange();
        setFrom(from);
        setTo(to);
        setActiveOption(option.value);
    };

    return (
        <div className={cx('wrapper', 'flex', 'items-start', 'justify-between', 'bg-white', 'rounded-xl', 'shadow', 'p-2', 'space-y-4')}>
            <div className={cx('quick-select', 'mb-4')}>
                <h3 className="text-2xl font-medium mb-2">
                    Lọc theo thời gian
                </h3>

                <div className="flex items-center gap-8">
                    {quickOptions.map((option) => (
                        <label
                            key={option.value}
                            className={cx('option-item', 'flex', 'items-center', 'gap-2', 'cursor-pointer', 'text-xl', 'font-medium')}
                        >
                            <input
                                type="radio"
                                name="quickRange"
                                value={option.value}
                                checked={activeOption === option.value}
                                onChange={() => handleQuickSelect(option)}
                                className="accent-indigo-600 w-6 h-6"
                            />
                            <span>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className={cx('custom-select')}>
                <div className="">
                    <h3 className="text-2xl font-medium mb-2">
                        Hoặc chọn khoảng thời gian:
                    </h3>
                    <div className="flex items-center gap-8">
                        <div className={cx('flex', 'items-center')}>
                            <div
                                className="text-2xl font-medium"
                                style={{ marginRight: '4px' }}
                            >
                                Từ:
                            </div>
                            <DatePicker
                                selected={from}
                                onChange={(date) => {
                                    setFrom(date);
                                    setActiveOption('');
                                }}
                                selectsStart
                                startDate={from}
                                endDate={to}
                                dateFormat="yyyy-MM-dd"
                                className={cx('date-input')}
                            />
                        </div>
                        <div className={cx('flex', 'items-center')}>
                            <div
                                className="text-2xl font-medium"
                                style={{ marginRight: '4px' }}
                            >
                                Đến:
                            </div>
                            <DatePicker
                                selected={to}
                                onChange={(date) => {
                                    setTo(date);
                                    setActiveOption('');
                                }}
                                selectsEnd
                                startDate={from}
                                endDate={to}
                                minDate={from}
                                dateFormat="yyyy-MM-dd"
                                className={cx('date-input')}
                            />
                        </div>
                    </div>
                </div>

                {from && to && (
                    <div className="text-sm text-gray-500 pt-2">
                        📅 Khoảng đã chọn: {format(from, 'dd/MM/yyyy')} →{' '}
                        {format(to, 'dd/MM/yyyy')}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DateFilter;

import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './Dashboard.module.scss';
import DashboardStatic from '~/components/admin/DashboardStatic';
import RevenueComparisonChart from '~/components/admin/RevenueComparisonChart';
import RevenueChart from '~/components/admin/RevenueChart';
import DateFilter from '~/components/admin/DateFilter';
import TopProductsChart from '~/components/admin/TopProductsChart';
import {
    useGetRevenueQuery,
    useGetTopProductsQuery,
} from '~/store/dashboardSlice';

const cx = classNames.bind(styles);

function Dashboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://172.20.10.3:8080/revenueComparison')
            .then((res) => res.json())
            .then((json) => {
                setData(json);
            });
    }, []);

    return (
        <div className={cx('wrapper', 'p-3')}>
            <div className={cx('overview', 'mb-8')}>
                <DashboardStatic />
            </div>
            <div>
                <RevenueComparisonChart data={data} />
            </div>
        </div>
    );
}

export default Dashboard;

import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Analyst.module.scss';
import DashboardStatic from '~/components/admin/DashboardStatic';
import RevenueChart from '~/components/admin/RevenueChart';
import DateFilter from '~/components/admin/DateFilter';
import TopProductsChart from '~/components/admin/TopProductsChart';
import { useGetRevenueQuery, useGetTopProductsQuery } from '~/store/dashboardSlice';

const cx = classNames.bind(styles);

function Analyst () {
    return (
        <div className={cx('wrapper', 'p-3', 'w-full')}>
            {/* <div className={cx('overview', 'mb-8')}>
                <DashboardStatic />
            </div> */}
            <div className={cx('chart', 'gap-8')}>
                <div className={cx('revenue-chart', 'mb-8')}>
                    <RevenueChart />
                </div>
                <div className={cx('product-chart')}>
                    <TopProductsChart />
                </div>
            </div>
        </div>
    );
}

export default Analyst;

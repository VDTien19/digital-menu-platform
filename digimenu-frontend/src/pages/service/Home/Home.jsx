import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import DashboardStatic from '~/components/admin/DashboardStatic';
import RevenueChart from '~/components/admin/RevenueChart';
import TopProductsChart from '~/components/admin/TopProductsChart';

const cx = classNames.bind(styles);

function Home () {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('mb-8')}><DashboardStatic /></div>
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

export default Home;

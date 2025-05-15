import { useEffect } from 'react';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
// import CountUp from 'react-countup';
// import { motion } from 'framer-motion';

import styles from './DashboardStatic.module.scss';
import { fetchCategories } from '~/store/categorySlice';
import { fetchProducts } from '~/store/productSlice';
import { fetchTable } from '~/store/tableSlice';
import SlideUpNumber from '~/components/SlideUpNumber';
// import { fetchOrders } from '~/store/orderSlice';

const cx = classNames.bind(styles);

function DashboardStatic () {
    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.category);
    const { listProducts } = useSelector((state) => state.product);
    const { listTables } = useSelector((state) => state.table);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts());
        dispatch(fetchTable());
    }, [dispatch]);

    useEffect(() => {
        console.log('Categories:', list);
        console.log('Products:', listProducts);
        console.log('Tables:', listTables);
    }, [list, listProducts, listTables]);

    return (
        <div className={cx('wrapper', 'flex', 'flex-wrap', 'justify-start', 'gap-4')}>
            <div className={cx('flex', 'flex-col', 'items-center', 'justify-center', 'shadow-md', 'rounded-2xl', 'h-36', 'cursor-pointer', 'w-full', 'sm:w-[200px]', 'md:w-[220px]', 'lg:w-[230px]', 'bg-green-100')}>
                <p className={cx('text-2xl', 'font-bold', 'mb-2')}>
                    Tổng bàn 
                </p>
                <span className={cx('text-4xl', 'font-bold')}>
                    <SlideUpNumber number={listTables.length} />
                </span>
            </div>
            <div className={cx('flex', 'flex-col', 'items-center', 'justify-center', 'shadow-md', 'rounded-2xl', 'h-36', 'cursor-pointer', 'w-full', 'sm:w-[200px]', 'md:w-[220px]', 'lg:w-[230px]', 'bg-blue-100')}>
                <p className={cx('text-2xl', 'font-bold', 'mb-2')}>
                    Tổng hoá đơn 
                </p>
                <span className={cx('text-4xl', 'font-bold')}>
                    <SlideUpNumber number={97283728} />
                    {/* <CountUp start={0} end={97283728} duration={2} delay={0} separator="," /> */}
                </span>
            </div>
            <div className={cx('flex', 'flex-col', 'items-center', 'justify-center', 'shadow-md', 'rounded-2xl', 'h-36', 'cursor-pointer', 'w-full', 'sm:w-[200px]', 'md:w-[220px]', 'lg:w-[230px]', 'bg-yellow-100')}>
                <p className={cx('text-2xl', 'font-bold', 'mb-2')}>
                    Tổng doanh thu 
                </p>
                <span className={cx('text-4xl', 'font-bold')}>
                    <SlideUpNumber number={97283728} />
                </span>
            </div>
            <div className={cx('flex', 'flex-col', 'items-center', 'justify-center', 'shadow-md', 'rounded-2xl', 'h-36', 'cursor-pointer', 'w-full', 'sm:w-[200px]', 'md:w-[220px]', 'lg:w-[230px]', 'bg-purple-100')}>
                <p className={cx('text-2xl', 'font-bold', 'mb-2')}>
                    Tổng danh mục 
                </p>
                <span className={cx('text-4xl', 'font-bold')}>
                    <SlideUpNumber number={list.length} />
                </span>
            </div>
            <div className={cx('flex', 'flex-col', 'items-center', 'justify-center', 'shadow-md', 'rounded-2xl', 'h-36', 'cursor-pointer', 'w-full', 'sm:w-[200px]', 'md:w-[220px]', 'lg:w-[230px]', 'bg-red-100')}>
                <p className={cx('text-2xl', 'font-bold', 'mb-2')}>
                    Tổng món ăn 
                </p>
                <span className={cx('text-4xl', 'font-bold')}>
                    <SlideUpNumber number={listProducts.length} />
                </span>
            </div>
        </div>
    );
}

export default DashboardStatic;

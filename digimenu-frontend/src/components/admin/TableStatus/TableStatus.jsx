import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import styles from './TableStatus.module.scss';
import { LoadingIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function TableStatus({ onClick, orderGroup }) {
    const waitingCount = orderGroup.orders.reduce((count, order) => {
        return order.status === 'Chờ xét duyệt' ? count + 1 : count;
    }, 0);

    const confirmedCount = orderGroup.orders.reduce((count, order) => {
        return order.status === 'Đã nhận' ? count + 1 : count;
    }, 0);

    // Nếu không có đơn nào chờ xét duyệt thì không render
    if (waitingCount === 0) return null;

    return (
        <div
            className={cx(
                'wrapper',
                'relative',
                'w-32',
                'h-32',
                'shadow-lg',
                'rounded-lg',
                'bg-white',
                'flex',
                'items-center',
                'justify-around',
                'cursor-pointer'
            )}
            onClick={onClick}
        >
            <div className={cx('order-status')}>
                <p className={cx('font-bold')}>{orderGroup.table_id.name}</p>
                <div className={cx('w-4', 'h-4', 'bg-amber-400', 'rounded-full')}></div>
            </div>
            <div className={cx('separate')}></div>
            <div className={cx('flex', 'flex-col', 'items-center', 'justify-center', 'gap-2')}>
                <div className={cx('flex', 'items-center', 'font-bold', 'text-xl')}>
                    <div className={cx('w-6', 'flex', 'items-center', 'justify-center')}>
                        <LoadingIcon />
                    </div>
                    <span className={cx('ml-1')}>{waitingCount}</span>
                </div>
                <div className={cx('flex', 'items-center', 'font-bold', 'text-xl')}>
                    <div className={cx('w-6', 'flex', 'items-center', 'justify-center')}>
                        <FontAwesomeIcon icon={faCircleCheck} className={cx('text-green-400')} />
                    </div>
                    <span className={cx('ml-1')}>{confirmedCount}</span>
                </div>
            </div>
        </div>
    );
}

export default TableStatus;

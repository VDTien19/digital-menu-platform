import { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './InvoiceItem.module.scss';
import Image from '~/components/Images';
import images from '~/assets/images';
import { EyeIcon } from '~/components/Icons';
import TimeAgo from '~/components/TimeAgo';
import InvoiceModal from '~/components/InvoiceModal';
import { formatCurrency } from '~/utils/formatCurrency';

const cx = classNames.bind(styles);

function InvoiceItem ({ item }) {
    const [showModal, setShowModal] = useState(false);

    // const localTime = new Date(item.issued_at).toLocaleString('vi-VN', {
    //     timeZone: 'Asia/Ho_Chi_Minh',
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric',
    //     hour: '2-digit',
    //     minute: '2-digit',
    // });
    return (
        <div onClick={() => setShowModal(true)} className={cx('wrapper', 'w-full', 'h-40', 'flex', 'bg-white', 'rounded-2xl', 'items-center', 'justify-between', 'p-4', 'cursor-pointer')}>
            <div className={cx('w-28', 'h-28', '-ml-2', 'mr-8')}>
                <Image className={cx('image', 'w-full', 'h-full', 'object-cover')} src={images.billImg} alt="Invoice Item" />
            </div>
            <div className={cx('info', 'text-2xl', '-ml-24')}>
                <p>Tên KH: {item.customer_name}</p>
                <p>Số điện thoại: {item.customer_phone}</p>
                <p className={cx('text-xl')}>Tổng hoá đơn: {formatCurrency(item.total)}</p>
                <p className={cx('text-xl')}>Ngày tạo: <TimeAgo date={item.issued_at} /></p>
            </div>
            <div className={cx('cursor-pointer', 'flex', 'items-center', 'relative', '-bottom-12')}>
                <p className={cx('underline', 'mr-2', 'text-xl')}>Xem</p>
                <EyeIcon className={cx('w-7', 'h-7')} />
                {/* <Image className={cx('image', 'w-6', 'h-6')} src={images.eyeGif} alt="Invoice Item" /> */}
            </div>

            {showModal && <InvoiceModal isOpen={showModal} onClose={() => setShowModal(false)} item={item} />}
        </div>
    );
}

export default InvoiceItem;

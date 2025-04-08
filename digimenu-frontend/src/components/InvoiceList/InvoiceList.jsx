import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './InvoiceList.module.scss';
import InvoiceItem from '~/components/InvoiceItem';
import images from '~/assets/images';
import Image from '~/components/Images';

const cx = classNames.bind(styles);

function InvoiceList ({ invoices }) {
    return (
        <div className={cx('wrapper', 'w-full', 'h-full', 'px-4')}>
            {invoices.length >= 1 ? invoices.map((item, index) => (
                <InvoiceItem key={index} item={item} />
            )) : (
                <div className={cx('empty', 'w-full', 'h-full', 'flex', 'flex-col', 'items-center', 'justify-center')}>
                    {/* <p className={cx('text-2xl')}>Không tìm thấy hoá đơn nào.</p> */}
                    <Image src={images.noResultSearch_2} alt="search" className={cx('w-96', 'h-96')} />
                </div>
            )}
        </div>
    );
}

export default InvoiceList;

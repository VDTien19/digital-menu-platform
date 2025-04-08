import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Invoice.module.scss';
import InvoiceList from '~/components/InvoiceList';
import { useSearch } from '~/contexts/SearchContext';
import images from '~/assets/images';
import Image from '~/components/Images';

const cx = classNames.bind(styles);

function Invoice () {
    const { invoices, searchValue } = useSearch();

    return (
        <div className={cx('wrapper')}>
            {!searchValue ? (
                <div className={cx('flex', 'flex-col', 'items-center', 'justify-center', 'w-full', 'h-full')}>
                    {/* <p className={cx('w-full', 'text-center')}>Nhập số điện thoại để tìm hoá đơn.</p> */}
                    <Image src={images.searchInvoice} alt="search" className={cx('w-96', 'h-96')} />
                </div>
            ) : (
                <InvoiceList invoices={invoices} />
            )}
        </div>
    );
}

export default Invoice;

import { forwardRef } from 'react';
import classNames from 'classnames/bind';
import { QRCodeCanvas } from 'qrcode.react';

import styles from './TableQRCode.module.scss';

const cx = classNames.bind(styles);

function TableQRCode ({ name, toUrl, isSimple, className, ...props }, ref) {
    return (
        <div ref={ref} {...props} className={cx('wrapper', 'inline-block', 'bg-white', 'text-center', { 'p-4': isSimple, 'py-6 px-10 shadow': !isSimple }, className)}>
            {!isSimple && (
                <div className={cx('mb-10')}>
                    <p className={cx('text-2xl')}>Quét mã QR để</p>
                    <p><b>GỌI MÓN</b> và <b>THANH TOÁN</b></p>
                </div>
            )}
            <QRCodeCanvas value={toUrl} size={166} bgColor="#ffffff" fgColor="#000000" level="L" includeMargin={false} className={cx('flex', 'justify-center', 'items-center', 'm-auto')} />
            {!isSimple && (
                <>
                    <p className={cx('font-medium', 'mt-8')}><strong>Bàn {name}</strong></p>
                    <p className={cx('mt-6', 'text-lg', 'text-gray-500')}>Powered by <b>KTN.vn</b></p>
                </>
            )}
        </div>
    );
}

export default forwardRef(TableQRCode);

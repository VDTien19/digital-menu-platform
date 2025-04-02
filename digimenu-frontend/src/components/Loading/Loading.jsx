import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Loading.module.scss';
import images from '~/assets/images';
import Image from '~/components/Images';

const cx = classNames.bind(styles);

function Loading () {
    return (
        <div className={cx('wrapper', 'w-full', 'h-full', 'fixed', '-inset-0', 'bg-white')}>
            <div className={cx('absolute', 'bottom-1/2', 'right-1/2', 'translate-1/2', 'flex', 'flex-col', 'items-center', 'justify-center', 'w-full')}>
                <div className={cx('w-28', 'h-28', 'rounded-full', 'bg-gray-200')}>
                    <Image src={images.lightning_1} />
                </div>
                <p className={cx('font-medium', 'text-xl', 'mt-2')}>Đang kết nối, vui lòng chờ</p>
                <p className={cx('text-xl', 'text-gray-400')}>Vui lòng chờ hoặc làm mới trình duyệt của bạn.</p>
            </div>
        </div>
    );
}

export default Loading;

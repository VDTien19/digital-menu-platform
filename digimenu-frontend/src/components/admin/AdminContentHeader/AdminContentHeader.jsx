import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './AdminContentHeader.module.scss';
import { AddIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function AdminContentHeader ({ title, children, titleBtn, onClick }) {
    return (
        <div className={cx('wrapper', 'flex', 'justify-between', 'mt-4')}>
            <div>
                <h2 className={cx('title')}>{title}</h2>
            </div>
            <div>
                <div>{children}</div>
                <div onClick={onClick} className={cx('btn-wrapper', 'rounded-xl', 'cursor-pointer', 'p-2')}>
                    <button className={cx('flex', 'items-center', 'font-medium', 'cursor-pointer')}>
                        <AddIcon className={cx('mr-2')} />
                        <span className={cx('uppercase')}>{titleBtn}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminContentHeader;

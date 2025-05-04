import {  } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';

import styles from './TableActions.module.scss';
import { EyeIcon, TrashIcon, EditIcon, DownloadIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function TableActions({ data, onView, onDownload, onEdit, onDelete, isView=true, isDownload=false }) {
    return (
        <div className={cx('flex', 'justify-center', 'icon-group')}>
            {/* <Tippy content='Xem'> */}
                {isView && (
                    <button className={cx('icon-wrapper')} onClick={() => onView?.(data)}>
                        <EyeIcon width='2.2rem' height='2.2rem' className={cx('mx-3', 'eye-icon', 'cursor-pointer')} />
                    </button>
                )}
            {/* </Tippy> */}
            {/* <Tippy content='Tải về'> */}
                {isDownload && (
                    <button className={cx('icon-wrapper')} onClick={() => onDownload?.(data)}>
                        <DownloadIcon width='2.2rem' height='2.2rem' className={cx('mx-3', 'download-icon', 'cursor-pointer')} />
                    </button>
                )}
            {/* </Tippy> */}
            {/* <Tippy content='Sửa'> */}
                <button className={cx('icon-wrapper')} onClick={() => onEdit?.(data)}>
                    <EditIcon width='1.8rem' height='1.8rem' className={cx('mx-3', 'edit-icon', 'cursor-pointer')} />
                </button>
            {/* </Tippy> */}
            {/* <Tippy content='Xóa'> */}
                <button className={cx('icon-wrapper')} onClick={() => onDelete?.(data)}>
                    <TrashIcon width='1.8rem' height='1.8rem' className={cx('mx-3', 'trash-icon', 'cursor-pointer')} />
                </button>
            {/* </Tippy> */}
        </div>
    );
}

export default TableActions;

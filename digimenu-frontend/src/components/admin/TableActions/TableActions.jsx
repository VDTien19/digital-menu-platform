import {  } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';

import styles from './TableActions.module.scss';
import { EyeIcon, TrashIcon, EditIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function TableActions({ data, onView, onEdit, onDelete, isView=true }) {
    return (
        <div className={cx('flex', 'justify-center')}>
            {/* <Tippy content='Xem'> */}
                {isView && (
                    <button onClick={() => onView?.(data)}>
                        <EyeIcon width='2.2rem' height='2.2rem' className={cx('mx-3', 'eye-icon', 'cursor-pointer')} />
                    </button>
                )}
            {/* </Tippy> */}
            {/* <Tippy content='Sửa'> */}
                <button onClick={() => onEdit?.(data)}>
                    <EditIcon width='1.8rem' height='1.8rem' className={cx('mx-3', 'edit-icon', 'cursor-pointer')} />
                </button>
            {/* </Tippy> */}
            {/* <Tippy content='Xóa'> */}
                <button onClick={() => onDelete?.(data)}>
                    <TrashIcon width='1.8rem' height='1.8rem' className={cx('mx-3', 'trash-icon', 'cursor-pointer')} />
                </button>
            {/* </Tippy> */}
        </div>
    );
}

export default TableActions;

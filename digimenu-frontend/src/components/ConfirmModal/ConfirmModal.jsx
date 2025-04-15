import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './ConfirmModal.module.scss';
import Modal from '~/components/Modal';

const cx = classNames.bind(styles);

function ConfirmModal ({ isOpen, onClose, message, onConfirm }) {
    if (!isOpen) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={cx('modal-content')}>
                <div className={cx('p-4')}>{message}</div>
                <div className={cx('button-group', 'flex', 'justify-around', 'items-center', 'mt-4', 'text-white')}>
                    <button className={cx('btn-confirm', 'w-1/2', 'rounded-bl-xl', 'cursor-pointer', 'p-4')} onClick={onConfirm}>Xác nhận</button>
                    <button className={cx('btn-cancel', 'w-1/2', 'rounded-br-xl', 'cursor-pointer', 'p-4')} onClick={onClose}>Huỷ</button>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmModal;

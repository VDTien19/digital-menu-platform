import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import styles from './Modal.module.scss';
import { CloseIconThin } from '~/components/Icons';

const cx = classNames.bind(styles);

function Modal({ children, isOpen, onClose, title='', partition=false }) {

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className={cx('modal')}>
            <div className={cx('modal-overlay')}>
                <div
                    className={cx('modal-content')}
                    onClick={(e) => e.stopPropagation()}
                >
                    {title && (
                        <div className={cx('modal-header', {partition: partition})}>
                            <h1 className={cx('modal-title')}>{title}</h1>
                            <div className={cx('close-btn')} onClick={onClose}>
                                <CloseIconThin width='2.4rem' height='2.4rem' className={cx('close-icon')} onClick={onClose} />
                                {/* &times; */}
                            </div>
                        </div>
                    )} 

                    <div className={cx('modal-body')}>{children}</div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default Modal;

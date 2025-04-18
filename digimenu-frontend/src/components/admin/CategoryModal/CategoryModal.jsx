import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './CategoryModal.module.scss';
import Modal from '~/components/Modal';

const cx = classNames.bind(styles);

function CategoryModal({ isOpen, onClose, title, data, onSave }) {
    const [name, setName] = useState(data?.name || '');
    const [status, setStatus] = useState('active');

    const handleChangeStatus = (e) => {
        setStatus(e.target.value);
        console.log(e.target.value);
    };

    const handleChange = (e) => {
        setName(e.target.value);
    };

    useEffect(() => {
        if (data) {
            setName(data.name);
        } else {
            setName('');
            setStatus('active');
        }
    }, [data]);

    if (!isOpen) return null;

    return (
        <Modal
            title={title}
            isOpen={isOpen}
            onClose={onClose}
            className={cx('wrapper')}
        >
            <div className={cx('wrapper')}>
                <div className={cx('form')}>
                    <div className={cx('form-group')}>
                        <label
                            className={cx('form-label', 'font-medium')}
                            htmlFor="name"
                        >
                            Tên danh mục:
                        </label>
                        <input
                            placeholder={!data ? 'Nhập tên danh mục mới' : null}
                            className={cx('input')}
                            type="text"
                            value={name || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <label
                            className={cx('form-label', 'font-medium')}
                            htmlFor="status"
                        >
                            Trạng thái:
                        </label>
                        <select
                            value={status}
                            onChange={handleChangeStatus}
                            name=""
                            id=""
                            className={cx('cursor-pointer')}
                        >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Tạm dừng</option>
                        </select>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onSave({ name, status, id: data?.id });
                        }}
                        className={cx('form-submit')}
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default CategoryModal;

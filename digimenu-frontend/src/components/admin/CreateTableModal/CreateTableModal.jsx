import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';

import styles from './CreateTableModal.module.scss';
import Modal from '~/components/Modal';
import { addTable } from '~/store/tableSlice';
import { useSlug } from '~/contexts/SlugContext';

const cx = classNames.bind(styles);

function getNextTableNumber(tables) {
    const usedNumbers = tables.map(table => Number(table.name));
    let nextNumber = 1;
    while (usedNumbers.includes(nextNumber)) {
        nextNumber++;
    }
    return nextNumber;
}

function CreateTableModal ({ isOpen, onClose }) {
    const tables = useSelector((state) => state.table);
    const { slug } = useSlug();

    const [tableName, setTableName] = useState(0);

    // console.log("tables", tables.listTables);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen) {
            const nextTableNumber = getNextTableNumber(tables.listTables);
            setTableName(nextTableNumber);
        }
    }, [tables.listTables, isOpen]);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tạo bàn mới">
            <div className={cx('p-4', 'pt-0')}>
                <div
                    className={cx(
                        'flex',
                        'flex-col',
                        'items-center',
                        'justify-center',
                    )}
                >
                    <div className={cx('mb-4', 'flex', 'items-center', 'justify-center', 'border', 'border-gray-300', 'rounded', 'p-2')}>
                        <label htmlFor="table-name" className={cx('text-2xl', 'font-semibold')}>
                            Tên bàn:
                        </label>
                        <input
                            value={tableName}
                            readOnly
                            placeholder='Nhập số bàn'
                            type="number"
                            id="table-name"
                            className={cx('mt-2', 'border', 'border-gray-300', 'rounded', 'p-2')}
                        />
                    </div>
                    <button className={cx('p-3', 'border', 'border-gray-300', 'rounded', 'bg-blue-500', 'text-white', 'hover:bg-blue-600', 'cursor-pointer', 'transition', 'duration-200')}
                        onClick={() => {
                            const encode = Math.random().toString(36).substring(2, 15);
                            const newTable = {
                                name: tableName,
                                status: 'empty',
                                encode: encode,
                                table_url: `http://172.20.10.2:5173/${slug}?tableName=${tableName}&encode=${encode}`,
                            };
                            dispatch(addTable(newTable));
                            setTableName(tables.listTables.length + 1);
                            onClose();
                        }}
                    >
                        Thêm bàn
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default CreateTableModal;

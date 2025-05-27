import { useRef, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from './Table.module.scss';
import AdminContentHeader from '~/components/admin/AdminContentHeader';
import DataTable from '~/components/admin/DataTable';
import TableActions from '~/components/admin/TableActions';
import TableQRCode from '~/components/admin/TableQRCode';
import { fetchTable, deleteTable, updateTable } from '~/store/tableSlice';
import TableModal from '~/components/admin/TableModal';
import CreateTableModal from '~/components/admin/CreateTableModal';
import ConfirmModal from '~/components/ConfirmModal';
import { useSearch } from '~/contexts/SearchContext';
import { useSlug } from '~/contexts/SlugContext';
import images from '~/assets/images';
import Image from '~/components/Images';
import { NavigationIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function Table() {
    const tableRef = useRef(null);

    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const { slug } = useSlug();
    const { tables, hasSearched, searchValue, setHasSearched } = useSearch();

    useEffect(() => {
        console.log('tables', tables);
    }, [tables]);

    const { listTables } = useSelector((state) => state.table);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTable());
    }, [dispatch]);

    const handleChangeQR = async () => {
        if (!tableData) return;
    
        const encode = Math.random().toString(36).substring(2, 15);
        const tableName = tableData?.name;
    
        const updatedTable = {
            encode,
            table_url: `http://172.20.10.2:5173/${slug}?tableName=${tableName}&encode=${encode}`,
        };
    
        try {
            const updated = await dispatch(updateTable({ id: tableData.id, data: updatedTable })).unwrap();
            setTableData(updated);
            // console.log('QR updated for table', tableData.id, updatedTable);
            // tableRef.current.toUrl = `http://localhost:5173/nha-hang-abc?tableName=${encode}`;
            // tableRef.current.updateQRCode();
            // dispatch(updateTable({ id: tableData?.id, data: { table_url: tableRef.current.toUrl } }));
        } catch (error) {
            console.error('Error updating QR code:', error);
        }
    };

    const tableColumns = [
        {
            key: 'id',
            label: 'ID',
            cellClass: 'cell-order',
            headClass: 'head-order',
        },
        {
            key: 'name',
            label: 'Tên bàn',
            cellClass: 'text-center mr-4',
            render: (_, item) => `Bàn ${item?.name}`,
        },
        {
            key: 'table_url',
            label: 'Liên kết',
            render: (_, item) => {
                if (!item || !item.table_url) return null;
                return (
                    <div className={cx('w-full', 'text-center')}>
                        <Link to={item?.table_url} target="_blank" rel="noopener noreferrer" className={cx('to-url', 'flex', 'items-center', 'justify-center', 'gap-2', 'whitespace-nowrap')}>
                            <span>Xem</span>
                            <NavigationIcon fill="#1212d6" />
                        </Link>
                    </div>
                );
            },
        },
        {
            key: 'qr_image',
            label: 'QR Code',
            render: (_, item) => {
                if (!item || !item.table_url) return null;
                return (
                    <div className={cx('qr-image')}>
                        <TableQRCode isSimple toUrl={item?.table_url} />
                    </div>
                );
            },
            headClass: 'hidden sm:block',
            cellClass: 'hidden sm:block text-center',
        },
        {
            key: 'actions',
            label: '',
            render: (_, row) => {
                return (
                    <TableActions
                        data={row}
                        onEdit={() => {
                            setShowModal(true);
                            setTableData(row);
                        }}
                        onDelete={() => {
                            setShowConfirmModal(true);
                            setTableData(row);
                        }}
                        // onView={() => console.log('View', row)}
                        isView={false}
                        // isDownload={true}
                        onDownload={() => console.log("Download", row)}
                    />
                );
            },
        },
    ];

    useEffect(() => {
        if (searchValue.trim() === '') {
            setHasSearched(false);
        }
    }, [searchValue, setHasSearched]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('')}>
                <AdminContentHeader
                    title="Quản lý bàn"
                    titleBtn="Thêm mới"
                    onClick={() => setShowCreateModal(true)}
                />
            </div>
            <div className={cx('mt-8')}>
                {hasSearched ? (
                    tables.length > 0 ? (
                        <DataTable columns={tableColumns} data={tables} />
                    ) : (
                        <div className={cx('w-full', 'mt-50', 'flex', 'justify-center', 'items-center')}>
                            <Image className={cx('w-90')} src={images.searchNotFound} />
                        </div>
                    )
                ) : (
                    <DataTable columns={tableColumns} data={listTables} />
                )}
            </div>
            {/* <TableQRCode hidden ref={tableRef} toUrl='http://localhost:5173/nha-hang-abc?tableName=5' /> */}

            <TableModal data={tableData} isOpen={showModal} onClose={() => setShowModal(false)} onChangeQR={handleChangeQR} />
            <CreateTableModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                message={<div>Bạn chắc chắn muốn xóa <b>bàn {tableData?.name}</b> chứ ?</div>}
                onConfirm={() => {
                    dispatch(deleteTable(tableData?.id));
                    setShowConfirmModal(false);
                    setTableData(null);
                }}
            />
        </div>
    );
}

export default Table;

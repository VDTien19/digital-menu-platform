import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import styles from './Category.module.scss';
import { useSearch } from '~/contexts/SearchContext';
import AdminContentHeader from '~/components/admin/AdminContentHeader';
import DataTable from '~/components/admin/DataTable';
import TableActions from '~/components/admin/TableActions';
import ConfirmModal from '~/components/ConfirmModal';
import CategoryModal from '~/components/admin/CategoryModal';
import { useSlug } from '~/contexts/SlugContext';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '~/store/categorySlice';

const cx = classNames.bind(styles);

function Category() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { slug } = useSlug();
    const { categories, hasSearched, searchValue, setHasSearched } = useSearch();
    
    const { list } = useSelector((state) => state.category);

    // dispatch fetchCategories
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showModalCategory, setShowModalCategory] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const cateColumns = [
        {
            key: 'index',
            label: 'STT',
            cellClass: 'cell-order',
            headClass: 'head-order',
        },
        {
            key: 'name',
            label: 'Tên',
            cellClass: 'cell-name',
            headClass: 'head-name',
        },
        { key: 'quantity', label: 'Số lượng món', cellClass: 'cell-quantity' },
        {
            key: 'actions',
            label: '',
            render: (_, row) => (
                <TableActions
                    data={row}
                    onView={() => {
                        navigate(`/${slug}/admin/menu?catid=${row?._id}`)
                        // setSelectedItem(row);
                    }}
                    onEdit={() => {
                        setShowModalCategory(true);
                        setSelectedItem(row);
                    }}
                    onDelete={() => {
                        setShowModalConfirm(true);
                        setSelectedItem(row);
                    }}
                />
            ),
            cellClass: 'cell-actions',
        },
    ];

    // Filter categories data for standard format
    const cateDataFilter = list.map((data, index) => ({
        // ...data,
        _id: data._id,
        id: data.id,
        index: index + 1,
        name: data.name,
        quantity: 100,
    }));

    // Filter searched categories data for standard format
    const categoriesFilter = categories.map((data, index) => ({
        _id: data._id,
        id: data.id,
        index: index + 1,
        name: data.name,
        quantity: 100,
    }));

    // useEffect(() => {
    //     // console.log("selectedItem: ", selectedItem);
    //     // console.log("cateData: ", cateData);
    //     // console.log("cateDataFilter: ", cateDataFilter);
    //     // console.log("categories: " + categories)
    // }, [selectedItem, cateData, cateDataFilter, categories])

    const handleSave = async (formData) => {
        try {
            if(formData.id) {
                await dispatch(updateCategory({ id: formData.id, data: formData })).unwrap();
            } else {
                await dispatch(addCategory(formData)).unwrap();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setShowModalCategory(false);
        }
    }

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteCategory(id)).unwrap();
            setShowModalConfirm(false)
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (searchValue.trim() === '') {
            setHasSearched(false);
        }
    }, [searchValue, setHasSearched]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('mb-8')}>
                <AdminContentHeader
                    title="Quản lý danh mục"
                    titleBtn="Thêm mới"
                    onClick={() => {
                        setSelectedItem(null);
                        setShowModalCategory(true);
                    }}
                />
            </div>
            {hasSearched ? (
                categories.length ? (
                    <DataTable columns={cateColumns} data={categoriesFilter} />
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        Không tìm thấy kết quả cho từ khoá '<strong>{searchValue}</strong>'
                    </div>
                )
            ) : (
                <DataTable columns={cateColumns} data={cateDataFilter} />
            )}
            <ConfirmModal
                message={
                    <div>
                        Bạn chắc chắn muốn xoá <b>"{selectedItem?.name}"</b> chứ
                        ?
                    </div>
                }
                isOpen={showModalConfirm}
                onClose={() => setShowModalConfirm(false)}
                onConfirm={() => handleDelete(selectedItem?.id)}
            />
            <CategoryModal
                data={selectedItem}
                title={
                    selectedItem
                        ? `Sửa danh mục ${selectedItem?.name}`
                        : 'Thêm danh mục mới'
                }
                isOpen={showModalCategory}
                onClose={() => {
                    setShowModalCategory(false);
                    setSelectedItem(null);
                }}
                onSave={handleSave}
            />
        </div>
    );
}

export default Category;

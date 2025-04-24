import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import styles from './Menu.module.scss';
import AdminContentHeader from '~/components/admin/AdminContentHeader';
import TableActions from '~/components/admin/TableActions';
import DataTable from '~/components/admin/DataTable';
import {
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
} from '~/store/productSlice';
import MenuModal from '~/components/admin/MenuModal';
import ConfirmModal from '~/components/ConfirmModal';
import { formatCurrency } from '~/utils/formatCurrency';
import { fetchCategories } from '~/store/categorySlice';
import { useSearch } from '~/contexts/SearchContext';
import * as httpRequest from '~/utils/httpRequest';
import images from '~/assets/images';
import Image from '~/components/Images';

const cx = classNames.bind(styles);

function Menu() {
    const [searchParams] = useSearchParams();
    const catid = searchParams.get('catid');  // get id from url to call api all products by category id

    const { dishes, setDishes, hasSearched, searchValue, setHasSearched } = useSearch();

    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [selectItem, setSelectItem] = useState(null);
    const [formattedDishes, setFormattedDishes] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const dispatch = useDispatch();
    const { listProducts } = useSelector(
        (state) => state.product,
    );
    const { list } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const menuColumns = [
        {
            key: 'index',
            label: 'STT',
            cellClass: 'cell-order',
            headClass: 'head-order',
        },
        {
            key: 'name',
            label: 'Tên món',
            cellClass: 'cell-name',
            headClass: 'head-name',
        },
        {
            key: 'price',
            label: 'Giá',
            cellClass: 'cell-price',
        },
        {
            key: 'description',
            label: 'Mô tả',
            headClass: 'hidden sm:block',
            cellClass: 'cell-desc hidden sm:block',
        },
        {
            key: 'actions',
            label: '',
            render: (_, row) => (
                <TableActions
                    data={row}
                    onEdit={() => {
                        setSelectItem(row);
                        setShowMenuModal(true);
                    }}
                    onDelete={() => {
                        setSelectItem(row);
                        setShowModalConfirm(true);
                    }}
                    isView={false}
                />
            ),
            cellClass: 'cell-actions',
        },
    ];

    useEffect(() => {
        const fetchByCategoryId = async () => {
            if (catid) {
                setIsFetching(true);
                try {
                    setHasSearched(true);
                    const res = await httpRequest.get(`menu_items?category_id=${catid}`);
    
                    const formatted = res.map((product, index) => ({
                        index: index + 1,
                        id: product.id,
                        _id: product._id,
                        name: product.name,
                        price: formatCurrency(product.price),
                        description: product.description,
                        image: product.image,
                        category_id: product.category_id,
                    }));
    
                    setFormattedDishes(formatted);
                } catch (error) {
                    console.error("Fetch by category_id failed:", error);
                    setFormattedDishes([]);
                } finally {
                    setIsFetching(false);
                }
            }
        };
    
        fetchByCategoryId();
    }, [catid]);

    useEffect(() => {
        if (dishes.length > 0) {
            const formatted = dishes.map((product, index) => ({
                index: index + 1,
                id: product.id,
                _id: product._id,
                name: product.name,
                price: formatCurrency(product.price),
                description: product.description,
                image: product.image,
                category_id: product.category_id,
            }));
            setFormattedDishes(formatted);
        } else {
            setFormattedDishes([]);
        }
    }, [dishes]);

    // const getProducts = listProducts.flatMap(product => product.products);
    const formatProd = listProducts.map((product, index) => ({
        index: index + 1,
        id: product.id,
        _id: product._id,
        name: product.name,
        price: formatCurrency(product.price),
        description: product.description,
        image: product.image,
        category_id: product.category_id,
    }));

    const handleSave = async (formData) => {
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('price', formData.price);
        payload.append('description', formData.description);
        payload.append('category_id', formData.selectedCategory);
        // payload.append('image', formData.imageUrl);

        if (formData.imageFile) {
            payload.append('image', formData.imageFile);
        }

        try {
            if(formData.id) {
                await dispatch(updateProduct({ id: formData.id, data: payload })).unwrap();
            } else {
                await dispatch(addProduct(payload)).unwrap();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setShowMenuModal(false);
        }
    }

    const handleDelete = async (id) => {
        if(id) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                setShowModalConfirm(false)
            } catch (e) {
                console.error(e);
            }
        }
    }

    useEffect(() => {
        if (searchValue.trim() === '') {
            setHasSearched(false);
            const params = new URLSearchParams(window.location.search);
            if (params.has('catid')) {
                params.delete('catid');
                window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
            }

            setDishes(formatProd);
        }
    }, [searchValue, setHasSearched]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('mb-8')}>
                <AdminContentHeader
                    title="Quản lý sản phẩm"
                    titleBtn="Thêm mới"
                    onClick={() => {
                        setSelectItem(null);
                        setShowMenuModal(true);
                    }}
                />
            </div>

            {isFetching ? (
                <div className={cx('w-full', 'mt-50', 'flex', 'justify-center', 'items-center')}>
                    <Image className={cx('w-90')} src={images.loading} />
                </div>
            ) : (
                catid || hasSearched ? (
                    formattedDishes.length > 0 ? (
                        <div>
                            <DataTable columns={menuColumns} data={formattedDishes} />
                        </div>
                    ) : (
                        <div className={cx('w-full', 'mt-50', 'flex', 'justify-center', 'items-center')}>
                            <Image className={cx('w-90')} src={images.searchNotFound} />
                        </div>
                    )
                ) : (
                    <DataTable columns={menuColumns} data={formatProd} />
                )
            )}

            <MenuModal
                isOpen={showMenuModal}
                onClose={() => setShowMenuModal(false)}
                onSave={handleSave}
                data={selectItem}
                categories={list}
            />

            <ConfirmModal
                message={
                    <div>
                        Bạn chắc chắn muốn xoá <b>"{selectItem?.name}"</b> chứ ?
                    </div>
                }
                isOpen={showModalConfirm}
                onClose={() => setShowModalConfirm(false)}
                onConfirm={() => handleDelete(selectItem?.id)}
            />
        </div>
    );
}

export default Menu;
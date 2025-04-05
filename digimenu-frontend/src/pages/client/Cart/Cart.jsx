import { useState } from 'react';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import styles from './Cart.module.scss';
import CartList from '~/components/CartList';
import images from '~/assets/images'
import Image from '~/components/Images';
import { TrashIcon } from '~/components/Icons';
import ConfirmModal from '~/components/ConfirmModal';

const cx = classNames.bind(styles);

function Cart () {
    const dispatch = useDispatch();
    const { totalQuantity, totalPrice, cartItems } = useSelector((state) => state.cart);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false); 

    const handleConfirm = () => {
        dispatch({ type: 'cart/clearCart' });
        setIsModalOpen(false);
    }

    return (
        <div className={cx('wrapper')}>
            <header className={cx('header', 'top-0', 'h-16', 'flex', 'items-center', 'justify-between')}>
                <div onClick={() => navigate(-1)} className={cx('icon-back', 'w-12', 'h-10', 'rotate-180', 'flex', 'items-center', 'justify-center', 'ml-4', 'rounded', 'cursor-pointer')}>
                    <Image className={cx('icon-image', 'w-4', 'h-4')} src={images.arrow} />
                </div>
                <h2 className={cx('title', 'w-full', 'h-full', 'font-medium', 'flex', 'items-center', 'justify-center')}>Các món đã chọn ({totalQuantity})</h2>
                <div className={cx('mr-4', 'cursor-pointer')} onClick={() => setIsModalOpen(true)}>
                    <TrashIcon />
                </div>
            </header>

            <div className={cx('w-full')}>
                <CartList cartItems={cartItems} />
            </div>

            <ConfirmModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                message="Bạn có chắc chắn muốn xóa tất cả món ăn trong giỏ hàng không?"
                onConfirm={handleConfirm}
            />

            {totalQuantity >= 1 && (
                <footer className={cx('footer', 'bottom-0', 'w-full', 'h-18', 'flex', 'items-center', 'justify-between', 'px-4', 'gap-8')}>
                    <div className={cx('total-price', 'w-3/7', 'h-full', 'bg-amber-200', 'rounded-xl', 'flex', 'items-center', 'justify-center')}>
                        Tổng: {totalPrice.toLocaleString()}đ
                    </div>
                    <div className={cx('checkout-btn', 'w-4/7', 'h-full', 'bg-amber-400', 'rounded-xl', 'flex', 'items-center', 'justify-center', 'cursor-pointer')}>
                        Xác nhận và gọi món
                    </div>
                </footer>
            )}
        </div>
    );
}

export default Cart;

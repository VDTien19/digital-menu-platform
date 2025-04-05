import { useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';

import styles from './CartItem.module.scss';
import Image from '~/components/Images';
import { CloseIconThin } from '~/components/Icons';
import { removeFromCart, increaseOne, decreaseOne } from '~/store/cartSlice';
import ConfirmModal from '~/components/ConfirmModal';

const cx = classNames.bind(styles);

function CartItem({ item }) {
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    }

    const handleConfirm = () => {
        dispatch(removeFromCart(item.id));
        setIsModalOpen(false);
    };

    // const handleIncrease = () => {
    //     dispatch(increaseOne(item.id));
    // };
    // const handleDecrease = () => {
    //     if (item.quantity > 1) {
    //         dispatch(decreaseOne(item.id));
    //     }
    // };

    return (
        <div
            className={cx(
                'wrapper',
                'w-full',
                'h-32',
                'rounded-2xl',
                'bg-white',
                'flex',
                'mb-4',
                'p-4',
                'relative',
            )}
        >
            <div
                className={cx('image', 'h-full', 'w-24', 'rounded-xl', 'mr-4')}
            >
                <Image
                    src={item.image}
                    className={cx(
                        'w-full',
                        'h-full',
                        'rounded-xl',
                        'object-cover',
                    )}
                />
            </div>
            <div className={cx('info')}>
                <div
                    className={cx(
                        'title',
                        'text-xl',
                        'font-semibold',
                        'text-black',
                        'mb-2',
                    )}
                >
                    {item.title}
                </div>
                <div
                    className={cx(
                        'quantity',
                        'text-sm',
                        'text-gray-600',
                        'mb-2',
                    )}
                >
                    <div
                        className={cx(
                            'quantity',
                            'flex',
                            'items-center',
                            'content-center',
                            'mr-8',
                        )}
                    >
                        <button
                            className={cx('quantity-button', 'btn-decrease', {disabled: item.quantity === 1})}
                            onClick={() => dispatch(decreaseOne(item.id))}
                        >
                            <span>_</span>
                        </button>
                        <input
                            value={item.quantity}
                            readOnly
                            type="text"
                            className={cx('quantity-value')}
                        ></input>
                        <button
                            className={cx('quantity-button', 'btn-increase')}
                            onClick={() => dispatch(increaseOne(item.id))}
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className={cx('price', 'text-lg', 'text-gray-500')}>
                    {item.price}đ x {item.quantity} ={' '}
                    {item.price * item.quantity}đ
                </div>
            </div>
            <div
                className={cx(
                    'close-btn',
                    'absolute',
                    'top-2',
                    'right-2',
                    'cursor-pointer',
                    'p-2',
                )}
                onClick={handleClick}
            >
                <CloseIconThin />
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                message={`Bạn có chắc chắn muốn xóa ${item.title} không?`}
            />
        </div>
    );
}

export default CartItem;

import { useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch } from "react-redux";
import { toast } from 'react-hot-toast';

import styles from './ProductCard.module.scss';
import Image from '~/components/Images';
import { CartIcon } from '~/components/Icons';
import { addToCart } from '~/store/cartSlice';
import { formatCurrency } from '~/utils/formatCurrency';

const cx = classNames.bind(styles);

function ProductCard({ product }) {
    
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleAddToCart = () => {
        dispatch(addToCart({
            id: product._id,
            title: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
        }));
        toast(`Thêm x${quantity} ${product.name} vào giỏ hàng.`);
        setQuantity(1);
    };

    return (
        <div className={cx('wrapper', 'flex', 'items-center', 'mb-2')}>
            <div className={cx('image', 'flex', 'items-center', 'mr-6')}>
                <Image
                    className={cx('image-url')}
                    src="https://timtour.vn/files/images/AnGiNgon/pizza-italy-1.jpg"
                    alt="Product Image"
                />
            </div>
            <div className={cx('content', 'flex', 'flex-col')}>
                <p className={cx('title')}>{product.name}</p>
                <p className={cx('description', 'mb-2')}>{product.description}</p>
                <div className={cx('price', 'p-4', 'mb-4')}>{formatCurrency(product.price)}</div>
                <div className={cx('action', 'flex', 'items-center')}>
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
                            onClick={handleDecrease}
                            className={cx('quantity-button', 'btn-decrease', {disabled: quantity === 1})}
                        >
                            <span>_</span>
                        </button>
                        <input
                            value={quantity}
                            readOnly
                            type="text"
                            className={cx('quantity-value', 'cursor-default')}
                        ></input>
                        <button
                            onClick={() => setQuantity((prev) => prev + 1)}
                            className={cx('quantity-button', 'btn-increase')}
                        >
                            +
                        </button>
                    </div>
                    <button className={cx('add-to-cart')} onClick={handleAddToCart}>
                        <CartIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;

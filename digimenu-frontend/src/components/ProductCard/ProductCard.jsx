import { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './ProductCard.module.scss';
import Image from '~/components/Images';
import { CartIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function ProductCard({ product }) {
    const [quantity, setQuantity] = useState(1);

    // const handleQuantityChange = (e) => {
    //     setQuantity(e.target.value);
    // };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
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
                <div className={cx('price', 'p-4', 'mb-4')}>{product.price}đ</div>
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
                            className={cx('quantity-value')}
                        ></input>
                        <button
                            onClick={() => setQuantity((prev) => prev + 1)}
                            className={cx('quantity-button', 'btn-increase')}
                        >
                            +
                        </button>
                    </div>
                    <button className={cx('add-to-cart')}>
                        <CartIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;

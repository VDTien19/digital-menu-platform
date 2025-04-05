import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './CartList.module.scss';
import CartItem from '~/components/CartItem';
import images from '~/assets/images';
import Image from '~/components/Images';

const cx = classNames.bind(styles);

function CartList ({ cartItems }) {
    return (
        <div className={cx('wrapper', 'w-full', 'pt-4')}>
            {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                    <div className={cx('px-4')} key={index} >
                        <CartItem item={item} />
                    </div>
                ))
            ) : (
                <div className={cx('empty-cart-wrapper', 'bg-white', 'relative')}>
                    <div className={cx('absolute', 'bottom-1/2', 'right-1/2', 'translate-1/2', 'w-full')}>
                        <p className={cx('empty-cart', 'text-center', 'text-gray-500')}>Giỏ hàng trống!</p>
                        <Image src={images.noCart} alt="Giỏ hàng trống" className={cx('empty-cart-image', 'w-1/2', 'mx-auto', 'my-4')} />
                        <p className={cx('empty-cart-text', 'text-center', 'text-gray-500')}>Hãy thêm món ăn vào giỏ hàng để đặt hàng!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartList;

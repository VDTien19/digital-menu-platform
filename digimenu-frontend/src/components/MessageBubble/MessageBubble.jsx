import {} from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './MessageBubble.module.scss';

const cx = classNames.bind(styles);

function MessageBubble({ isCustomer = true, message }) {
    return (
        <div
            className={cx(
                'wrapper',
                'flex',
                `${isCustomer ? 'justify-end' : 'justify-start'}`,
                'my-6', 'mx-4'
            )}
        >
            <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md text-2xl ${
                    isCustomer
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-black'
                }`}
            >
                {message}
                {isCustomer && (<Link><p className={cx('text-white', 'underline', 'text-xl')}>Xem các món đã gọi.</p></Link>)}
            </div>
        </div>
    );
}

export default MessageBubble;

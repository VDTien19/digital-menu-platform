import {  } from 'react';
import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';

import styles from './Message.module.scss';
import MessageBubble from '~/components/MessageBubble';

const cx = classNames.bind(styles);

function Message () {
    const location = useLocation();
    console.log("location", location.pathname);
    const isCustomer = location.pathname.includes('/status/');

    return (
        <div className={cx('wrapper')}>
            <MessageBubble isCustomer={isCustomer} message='Đơn hàng của bạn đã được gửi. Chờ xác nhận.' />
            <MessageBubble isCustomer={false} message='Đơn hàng của bạn đã được xác nhận.' />
            <MessageBubble isCustomer={false} message='Chúng tôi đang chế biến món và chuẩn bị phục vụ.' />
        </div>
    );
}

export default Message;

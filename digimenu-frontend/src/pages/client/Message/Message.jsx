import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Message.module.scss';

const cx = classNames.bind(styles);

function Message () {
    return (
        <div className={cx('wrapper')}>
            <h1>Message Client Page</h1>
        </div>
    );
}

export default Message;

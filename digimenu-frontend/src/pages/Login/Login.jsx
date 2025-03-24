import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Login.module.scss';

const cx = classNames.bind(styles);

function Login () {
    return (
        <div className={cx('wrapper')}>
            <h1>Login</h1>
        </div>
    );
}

export default Login;

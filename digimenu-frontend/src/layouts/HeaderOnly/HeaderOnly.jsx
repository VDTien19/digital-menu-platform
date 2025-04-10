import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './HeaderOnly.module.scss';
import Header from '../components/Header';

const cx = classNames.bind(styles);

function HeaderOnly ({ children }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <Header />
            </div>
            <div className={cx('content')}>
                {children}
            </div>
        </div>
    );
}

export default HeaderOnly;

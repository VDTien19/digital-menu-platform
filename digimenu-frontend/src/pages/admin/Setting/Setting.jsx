import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Setting.module.scss';

const cx = classNames.bind(styles);

function Setting () {
    return (
        <div className={cx('wrapper')}>
            <h1>Setting</h1>
        </div>
    );
}

export default Setting;

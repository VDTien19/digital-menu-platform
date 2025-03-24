import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function Menu () {
    return (
        <div className={cx('wrapper')}>
            <h1>Menu Admin Page</h1>
        </div>
    );
}

export default Menu;

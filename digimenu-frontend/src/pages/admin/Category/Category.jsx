import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Category.module.scss';

const cx = classNames.bind(styles);

function Category () {
    return (
        <div className={cx('wrapper')}>
            <h1>Category Admin Page</h1>
        </div>
    );
}

export default Category;

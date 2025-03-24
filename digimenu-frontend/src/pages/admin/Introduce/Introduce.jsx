import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Introduce.module.scss';

const cx = classNames.bind(styles);

function Introduce () {
    return (
        <div className={cx('wrapper')}>
            <h1>Introduce Admin Page</h1>
        </div>
    );
}

export default Introduce;

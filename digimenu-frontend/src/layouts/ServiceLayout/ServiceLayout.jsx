import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './ServiceLayout.module.scss';

const cx = classNames.bind(styles);

function ServiceLayout ({ children }) {
    return (
        <div className={cx('wrapper')}>
            {children}
        </div>
    );
}

export default ServiceLayout;

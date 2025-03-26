import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './FooterOnly.module.scss';
import Footer from '../components/Footer';

const cx = classNames.bind(styles);

function FooterOnly ({ children }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                {children}
            </div>
            <div className={cx('footer')}>
                <Footer />
            </div>
        </div>
    );
}

export default FooterOnly;

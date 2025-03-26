import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './ClientLayout.module.scss';
import Header from '~/layouts/components/Header';
import Footer from '~/layouts/components/Footer';

const cx = classNames.bind(styles);

function ClientLayout ({ children }) {
    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <Header />
            </header>
            <div className={cx('content')}>
                {children}
            </div>
            <footer className={cx('footer')}>
                <Footer />
            </footer>
        </div>
    );
}

export default ClientLayout;

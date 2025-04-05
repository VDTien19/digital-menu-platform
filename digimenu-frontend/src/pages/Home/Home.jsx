import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);

function Home () {
    return (
        <div className={cx('wrapper')}>
            <Loading />
        </div>
    );
}

export default Home;
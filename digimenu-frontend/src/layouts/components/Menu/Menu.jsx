import {  } from 'react';
import classNames from 'classnames/bind';

import styles from './Menu.module.scss';
import { BarIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function Menu () {
    return (
        <div className={cx('wrapper', 'flex', 'flex-row', 'items-center')}>
            <ul className={cx('menu', 'flex', 'flex-row', 'items-center')}>
                <li className={cx('menu-item', 'active')}>Category 1</li>
                <li className={cx('menu-item')}>Category 2</li>
                <li className={cx('menu-item')}>Category 3</li>
                <li className={cx('menu-item')}>Category 4</li>
                <li className={cx('menu-item')}>Category 5</li>
                <li className={cx('menu-item')}>Category 6</li>
                <li className={cx('menu-item')}>Category 7</li>
                <li className={cx('menu-item')}>Category 8</li>
                <li className={cx('menu-item')}>Category 9</li>
                <li className={cx('menu-item')}>Category 10</li>
            </ul>
            <div className={cx('see-more', 'flex', 'items-center', 'ml-0.5')}>
                <button className={cx('see-more-btn')}>
                    <BarIcon className={cx('see-more-icon')} />
                </button>
            </div>
        </div>
    );
}

export default Menu;

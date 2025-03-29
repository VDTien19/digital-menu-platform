import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';

import styles from './CategoryMenu.module.scss';
import { BarIcon } from '~/components/Icons';
import { useCategory } from '~/contexts/CategoryContext';

const cx = classNames.bind(styles);

function CategoryMenu () {
    const [active, setActive] = useState(0);
    const [data, setData] = useState([]);

    const { setActiveCategory } = useCategory();

    useEffect(() => {
        axios.get('http://172.20.10.3:8080/categories')
            .then(res => {
                setData(res.data);
            })
            .catch(err => console.error(err));
    }, [])

    const handleMenuItemClick = (index, id) => {
        setActive(index);
        setActiveCategory(id);
    };

    return (
        <div className={cx('wrapper', 'flex', 'flex-row', 'items-center')}>
            <ul className={cx('menu', 'flex', 'flex-row', 'items-center')}>
                {data.map((category, index) => (
                    <li
                        key={index}
                        className={cx('menu-item', { active: active === index })}
                        onClick={() => handleMenuItemClick(index, category._id)}
                    >
                        {category.name}
                    </li>
                ))}
            </ul>
            <div className={cx('see-more', 'flex', 'items-center', 'ml-0.5')}>
                <button className={cx('see-more-btn')}>
                    <BarIcon className={cx('see-more-icon')} />
                </button>
            </div>
        </div>
    );
}

export default CategoryMenu;

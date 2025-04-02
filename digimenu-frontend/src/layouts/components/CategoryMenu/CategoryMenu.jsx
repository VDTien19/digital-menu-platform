import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import httpRequest from '~/utils/httpRequest';

import styles from './CategoryMenu.module.scss';
import { BarIcon } from '~/components/Icons';
import { useCategory } from '~/contexts/CategoryContext';

const cx = classNames.bind(styles);

function CategoryMenu () {
    const [active, setActive] = useState(0);
    const [data, setData] = useState([]);

    const { setActiveCategory } = useCategory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await httpRequest.get(`categories`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchData();
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

import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';

import styles from './CategoryList.module.scss';
import CategoryItem from '~/components/CategoryItem';
import { useCategory } from '~/contexts/CategoryContext';

const cx = classNames.bind(styles);

function CategoryList({ categories }) {
    const categoryRefs = useRef({});

    const { activeCategory } = useCategory();

    const HEADER_HEIGHT = 92;

    useEffect(() => {
        if (activeCategory !== null && categoryRefs.current[activeCategory]) {
            const element = categoryRefs.current[activeCategory];
            const offsetTop = element.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: offsetTop - HEADER_HEIGHT - 10,
                behavior: 'smooth',
            });
        }
    }, [activeCategory]);

    return (
        <div className={cx('wrapper')}>
            {categories.map((category) => (
                <div key={category._id} ref={(el) => (categoryRefs.current[category._id] = el)}>
                    <CategoryItem title={category.name} products={category.products} />
                </div>
            ))}
        </div>
    );
}

export default CategoryList;

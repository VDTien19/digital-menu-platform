import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import * as httpRequest from '~/utils/httpRequest';
import styles from './Menu.module.scss';
import CategoryList from '~/components/CategoryList';
import ProductList from '~/components/ProductList';
import Loading from '~/components/Loading';
import { useProduct } from '~/contexts/ProductContext';
import { useSearch } from '~/contexts/SearchContext';

const cx = classNames.bind(styles);

function Menu() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const { products } = useProduct();
    const { searchValue, setSearchValue } = useSearch();

    // Clear search value when component unmounts to prevent memory leaks
    useEffect(() => {
        setSearchValue('');
    }, [setSearchValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await httpRequest.get(`categories`);
                setData(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter products based on search value
    const filteredProducts = searchValue
        ? products.filter((product) =>
              product.name.toLowerCase().includes(searchValue.toLowerCase()),
          )
        : [];

    // console.log("Products:", products);
    // console.log("Filtered Products:", filteredProducts);

    if (loading) {
        return (
            <div className={cx('loading', 'fixed', '-inset-0', 'z-999')}>
                <Loading />
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {searchValue && filteredProducts.length > 0 ? (
                <ProductList products={filteredProducts} />
            ) : (
                <CategoryList categories={data} />
            )}
        </div>
    );
}

export default Menu;

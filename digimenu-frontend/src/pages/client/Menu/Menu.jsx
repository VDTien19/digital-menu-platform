import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import httpRequest from '~/utils/httpRequest';
import styles from './Menu.module.scss';
import CategoryList from '~/components/CategoryList';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);


function Menu () {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await httpRequest.get(`categories`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <CategoryList categories={data} />
        </div>
    );
}

export default Menu;

import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';

import styles from './Menu.module.scss';
import CategoryList from '~/components/CategoryList';

const cx = classNames.bind(styles);


function Menu () {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://172.20.10.3:8080/categories')
            .then(res => {
                // console.log(res.data);
                setData(res.data);
            })
            .catch(err => console.error(err));
    }, [])

    return (
        <div className={cx('wrapper')}>
            <CategoryList categories={data} />
        </div>
    );
}

export default Menu;

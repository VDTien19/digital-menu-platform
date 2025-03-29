import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import config from '~/config';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import { useSlug } from '~/contexts/SlugContext';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        title: 'Dashboard',
        to: config.routes.admin_dashboard,
        icon: <FontAwesomeIcon icon={faXmark} />
        // icon: {
        //     active: <HomeActiveIcon />,
        //     default: <HomeIcon />,
        // },
    },
    {
        title: 'Giới thiệu',
        to: config.routes.admin_introduce,
        icon: <FontAwesomeIcon icon={faXmark} />
    },
    {
        title: 'Quản lý loại sản phẩm',
        to: config.routes.admin_category,
        icon: <FontAwesomeIcon icon={faXmark} />
    },
    {
        title: 'Quản lý sản phẩm',
        to: config.routes.admin_menu,
        icon: <FontAwesomeIcon icon={faXmark} />
    }, 
    {
        title: 'Quản lý bàn',
        to: config.routes.admin_table,
        icon: <FontAwesomeIcon icon={faXmark} />
    },
    {
        title: 'Quản lý nhân viên',
        to: config.routes.admin_staff,
        icon: <FontAwesomeIcon icon={faXmark} />
    }, 
];

function Sidebar() {

    const { slug } = useSlug();

    return (
        <aside className={cx('wrapper')}>
            <Menu>
                {MENU_ITEMS.map((item, index) => (
                    <MenuItem
                        key={index}
                        title={item.title}
                        to={item.to.replace(':slug', slug)}
                        icon={item.icon}
                    />
                ))}
            </Menu>
        </aside>
    );
}

export default Sidebar;

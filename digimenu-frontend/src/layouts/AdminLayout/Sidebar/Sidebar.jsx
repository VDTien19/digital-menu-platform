import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faInfo, faChartBar, faUtensils, faTableList, faPeopleGroup } from '@fortawesome/free-solid-svg-icons'

import config from '~/config';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import { useSlug } from '~/contexts/SlugContext';
import Image from '~/components/Images';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        title: 'Dashboard',
        to: config.routes.admin_dashboard,
        icon: <FontAwesomeIcon icon={faHouse} />
        // icon: {
        //     active: <HomeActiveIcon />,
        //     default: <HomeIcon />,
        // },
    },
    {
        title: 'Giới thiệu',
        to: config.routes.admin_introduce,
        icon: <FontAwesomeIcon icon={faInfo} />
    },
    {
        title: 'Quản lý loại danh mục',
        to: config.routes.admin_category,
        icon: <FontAwesomeIcon icon={faChartBar} />
    },
    {
        title: 'Quản lý sản phẩm',
        to: config.routes.admin_menu,
        icon: <FontAwesomeIcon icon={faUtensils} />
    }, 
    {
        title: 'Quản lý bàn',
        to: config.routes.admin_table,
        icon: <FontAwesomeIcon icon={faTableList} />
    },
    {
        title: 'Quản lý nhân sự',
        to: config.routes.admin_staff,
        icon: <FontAwesomeIcon icon={faPeopleGroup} />
    }, 
    // {
    //     title: 'Quản lý hoá đơn',
    //     to: config.routes.admin_invoice,
    //     icon: <FontAwesomeIcon icon={faPeopleGroup} />
    // }, 
];

function Sidebar() {

    const { slug } = useSlug();

    return (
        <aside className={cx('wrapper', 'bg-white')}>
            {/* <div className="flex justify-end mb-4 lg:hidden">
                <button onClick={closeSidebar} className="text-gray-600 text-2xl font-bold">
                    ✕
                </button>
            </div> */}

            <div className={cx('sidebar-header', 'flex', 'flex-col', 'items-center', 'justify-center', 'mb-8')} onClick={(e) => e.stopPropagation()}>
                <Image src='a' alt="Logo" className={cx('image-url', 'w-50', 'h-50', 'rounded-full', 'object-cover')} />
                <p className={cx('text-3xl', 'mt-4', 'font-medium', '')}>Admin</p>
                <p className={cx('text-xl', 'text-gray-500')}>@slug</p>
            </div>

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

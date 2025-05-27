import { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './ServiceLayout.module.scss';
import { CloseIconThin } from '~/components/Icons';
import Sidebar from './Sidebar/Sidebar';
import AdminHeader from '~/layouts/components/AdminHeader';

const cx = classNames.bind(styles);

function ServiceLayout ({ children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleCloseSidebar = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSidebarOpen(false);
            setIsClosing(false);
        }, 400);
    };

    return (
        <div className={cx('wrapper', 'flex')}>
            <div
                className={cx('sidebar', 'h-screen', 'bg-white')}
            >
                <Sidebar />
            </div>
            {isSidebarOpen && (
                <div
                    className={cx('wrapper-sidebar-rsp', 'fixed', 'inset-0', 'bg-black/30', 'z-10', 'lg:hidden', { 'hide-out': isClosing })}
                    onClick={handleCloseSidebar}
                >
                    <div className={cx('sidebar-rsp', 'relative', 'h-full', 'z-20', 'bg-white', { 'slide-out': isClosing })} onClick={(e) => e.stopPropagation()}>
                        <button onClick={handleCloseSidebar} className={cx('close-btn', 'text-gray-600', 'text-2xl', 'font-bold', 'absolute', 'top-4', 'right-4', 'lg:hidden', 'cursor-pointer', 'p-2')}>
                            <CloseIconThin className={cx('close-icon')} />
                        </button>
                        <div onClick={handleCloseSidebar} className={cx('pt-8')}>
                            <Sidebar closeSidebar={handleCloseSidebar} />
                        </div>
                    </div>
                </div>
            )}
            <div className={cx('body', 'flex', 'flex-col', 'flex-1')}>
                <header className={cx('header', 'bg-transparent')}>
                    <AdminHeader onToggleSidebar={handleToggleSidebar} />
                </header>
                <div className={cx('content')}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ServiceLayout;

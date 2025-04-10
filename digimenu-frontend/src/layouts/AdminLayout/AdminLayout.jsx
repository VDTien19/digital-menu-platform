import { useRef, useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './AdminLayout.module.scss';
import Sidebar from './Sidebar';
import AdminHeader from '../components/AdminHeader';

const cx = classNames.bind(styles);

function AdminLayout ({ children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
        console.log("isSidebarOpen", isSidebarOpen)
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
        console.log("isSidebarOpen", isSidebarOpen)
    };

    // Custome resize width
    const sidebarRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(240);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const newWidth = e.clientX;
            if (newWidth > 160 && newWidth < 500) {
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div className={cx('wrapper', 'flex')}>
            <div
                ref={sidebarRef}
                className={cx('sidebar', 'h-screen', 'bg-white')}
                style={{ width: `${sidebarWidth}px` }}
            >
                <Sidebar />
            </div>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-10 lg:hidden"
                    onClick={(e) => e.preventDefault}
                >
                    <div onClick={handleCloseSidebar} className={cx('sidebar-rsp', 'h-full', 'z-40', 'bg-white')}><Sidebar closeSidebar={handleCloseSidebar} /></div>
                </div>
            )}
            {/* Thanh kéo resize */}
            <div
                className="resizer"
                onMouseDown={() => setIsResizing(true)}
                style={{
                    width: '5px',
                    cursor: 'col-resize',
                    backgroundColor: '#e5e5e5',
                    height: '100vh',
                }}
            />
            <div className={cx('body', 'flex', 'flex-col', 'flex-1')}>
                <header className={cx('header', 'bg-white')}>
                    <AdminHeader onToggleSidebar={toggleSidebar} />
                </header>
                <div className={cx('content')}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;

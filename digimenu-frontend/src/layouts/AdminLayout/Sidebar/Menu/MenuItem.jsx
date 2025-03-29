import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function MenuItem({ title, to, icon }) {
    return (
        <NavLink
            to={to}
            end // Chỉ active nếu URL khớp chính xác
            className={(navData) => cx('menu-item', { active: navData.isActive })}
        >
            {/* isActive là một giá trị do React Router cung cấp thông qua callback */}
                <>
                    <div className={cx('icon')}>
                        {icon}
                    </div>
                    <span className={cx('title')}>{title}</span>
                </>
        </NavLink>
    );
}

MenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.shape({
        active: PropTypes.node.isRequired,
        default: PropTypes.node.isRequired,
    }).isRequired,
};

export default MenuItem;

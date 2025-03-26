import {  } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Footer.module.scss';
import Image  from '~/components/Images';

const cx = classNames.bind(styles);

function Footer () {
    return (
        <div className={cx('wrapper')}>
            {/* <div className={cx('res-info', 'flex')}>
                <div className={cx('logo', 'flex', 'items-center')}>
                    <Link to='/res-ktn'><Image className={cx('logo-img', 'mr-4')} src="logo.png" alt="Logo" /></Link>
                    <div>
                        <h2 className={cx('name')}>Restaurant KTN</h2>
                        <div className={cx('phone')}>Phone: <a href="tel:123456789">123-456-7890</a></div>
                        <div className={cx('email')}>Email: <a href="mailto:info@domain.com">info@domain.com</a></div>
                    </div>
                </div>
                <div className={cx('contact', 'my-4')}>
                    <div className={cx('social', 'flex', 'gap-2.5')}>
                        <Link className={cx('social-wrapper')}>
                            <Image className={cx('social-img')} src="facebook.png" alt="Facebook" />
                        </Link>
                        <Link className={cx('social-wrapper')}>
                            <Image className={cx('social-img')} src="facebook.png" alt="Twiter" />
                        </Link>
                        <Link className={cx('social-wrapper')}>
                            <Image className={cx('social-img')} src="facebook.png" alt="Tiktok" />
                        </Link>
                    </div>
                </div>
                <div className={cx('about')}>
                    <div className={cx('font-semibold')}>Về chúng tôi</div>
                    <div>Giới thiệu</div>
                    <div>Dịch vụ</div>
                    <div>Cookie Policy</div>
                    <div>Contact Us</div>
                </div>
                <div className={cx('address')}>
                    <div className={cx('font-semibold')}>Vị trí cửa hàng</div>
                    <p>Miển Bắc</p>
                    <p>Miển Trung</p>
                    <p>Miển Nam</p>
                </div>
            </div> */}
            <div className={cx('system-info')}>
                <div>Sản phẩm được phát triển và kinh doanh bởi <strong>KTN Group</strong></div>
                <strong>Liên hệ để hợp tác</strong>
                <div><strong>Hotline:</strong> <a href="tel:0123456789">0123 456 789</a></div>
                <div><strong>Địa chỉ:</strong> 123 Street, City, Country</div>
                <div><strong>Website:</strong> <Link to="/">www.digimenu.com</Link></div>
                <div className={cx('copy-right', 'mt-4', 'text-center', 'text-2xl')}>
                    <p>© 2025 DigiMenu. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;

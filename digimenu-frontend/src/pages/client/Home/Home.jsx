import {} from 'react';
import classNames from 'classnames/bind';
import { Link, useLocation } from 'react-router-dom';

import styles from './Home.module.scss';
import { useSlug } from '~/contexts/SlugContext';
import Image from '~/components/Images';
import images from '~/assets/images';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Home() {
    const { slug, resData, loading } = useSlug();

    const query = useQuery();
    const tableName = query.get('tableName');
    const toMenuUrl = `/${slug}/menu/${tableName}`;
    const toInvoiceUrl = `/${slug}/invoice`;

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <header className={cx('mb-4')}>
                <h1 className={cx('name', 'uppercase', 'font-medium')}>{resData?.name}</h1>
                <Link to='/' className={cx('flex', 'items-center')}>
                    <Image src={images.located} alt='located' className={cx('mr-2')} />
                    <p className={cx('text-lg')}>{resData?.address}</p>
                </Link>
            </header>
            <div className={cx('banner', 'w-full', 'mb-4')}>
                <Image src={resData?.banner} alt='banner' className={cx('banner-img', 'w-full', 'h-full', 'object-cover', 'rounded-2xl')} />
            </div>
            <div className={cx('great', 'w-full', 'text-center', 'flex', 'items-center', 'justify-center')}>
                <Image src={images.hello} className={cx('hello-img', 'object-cover')} />
                <p className={cx('text-2xl', 'mx-2', 'font-medium')}>Xin chào quý khách.</p>
                <Image src={images.smile} className={cx('w-6', 'h-6', 'object-cover')} />
            </div>
            {tableName && (
                <div className={cx('info', 'flex', 'items-center', 'justify-center', 'text-xl')}>
                    <p className={cx()}>Chúng tôi sẽ trả đồ cho bạn tại bàn: </p>
                    <div className={cx('flex', 'items-center', 'justify-center', 'ml-2', 'w-12', 'h-6', 'border', 'rounded-full', 'border-black', 'border-solid')}>
                        <span className={cx('flex', 'items-center', 'justify-center', 'text-lg', 'mt-0.5', 'font-medium')}>{tableName}</span>
                    </div>
                </div>
            )}
            <div className={cx('interaction', 'flex', 'justify-between', 'items-center', 'h-36', 'gap-4', 'mt-6')}>
                {tableName && (
                    <>
                        <div className={cx('payment-bg', 'w-1/2', 'h-full', 'rounded-3xl', 'relative', 'border', 'border-solid')}>
                            <p className={cx('title', 'absolute', 'top-3', 'left-3', 'text-xl', 'font-medium')}>Gọi thanh toán</p>
                            <Image src={images.requestPayment} className={cx('interaction-img', 'absolute', 'right-0', 'bottom-0', 'rounded-3xl')} />
                        </div>
                        <div className={cx('helper-bg', 'w-1/2', 'h-full', 'rounded-3xl', 'relative', 'border', 'border-solid')}>
                            <p className={cx('title', 'absolute', 'top-3', 'left-3', 'text-xl', 'font-medium')}>Gọi nhân viên</p>
                            <Image src={images.requestServive} className={cx('interaction-img', 'absolute', 'right-0', 'bottom-0', 'rounded-3xl')} />
                        </div>
                    </>
                )}
                {!tableName && (
                    <>
                        <div className={cx('view-feedback-bg', 'w-1/2', 'h-full', 'rounded-3xl', 'relative', 'border', 'border-solid')}>
                            <p className={cx('title', 'absolute', 'top-3', 'left-3', 'text-xl', 'font-medium')}>Xem đánh giá</p>
                            <Image src={images.rateImg} className={cx('interaction-img', 'absolute', 'right-0', 'bottom-0', 'rounded-3xl')} />
                        </div>
                        <Link to={toInvoiceUrl} className={cx('search-invoice-bg', 'w-1/2', 'h-full', 'rounded-3xl', 'relative', 'border', 'border-solid')}>
                            <div>
                                <p className={cx('title', 'absolute', 'top-3', 'left-3', 'text-xl', 'font-medium')}>Tìm kiếm hoá đơn</p>
                                <Image src={images.searchInvoice} className={cx('interaction-img', 'absolute', 'right-0', 'bottom-0', 'rounded-3xl', 'w-28', 'object-cover')} />
                            </div>
                        </Link>
                    </>
                )}
            </div>
            {tableName && (
                <Link to={toMenuUrl} className={cx('block', 'w-full', 'h-36', 'mt-6')}>
                    <div className={cx('bg-menu', 'relative', 'w-full', 'h-full', 'bg-cover', 'bg-center', 'bg-gray-200', 'rounded-2xl')} style={{ backgroundImage: resData?.thumbnail ? `url(${resData.thumbnail})` : "none" }}>
                        <div className={cx('bg-menu-content', 'flex', 'items-center', 'absolute', 'bottom-1/2', 'translate-y-1/2', 'left-4')}>
                            <p className={cx("text-white", 'font-medium', 'mr-2')}>Xem menu - Gọi món</p>
                            <div className={cx('bg-icon', 'w-6', 'h-6', 'flex', 'items-center', 'justify-center', 'rounded-full')}>
                                <Image className={cx('menu-icon', 'w-1/2', 'h-1/2')} src={images.arrow} />
                            </div>
                        </div>
                    </div>
                </Link>
            )}
        </div>
    );
}

export default Home;

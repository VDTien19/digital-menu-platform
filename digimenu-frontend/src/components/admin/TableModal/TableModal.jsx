import { useRef } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './TableModal.module.scss';
import Modal from '~/components/Modal';
import TableQRCode from '~/components/admin/TableQRCode';
import { DownloadIcon, ChangeIcon } from '~/components/Icons';
import { useDownloadImage } from '~/hooks';

const cx = classNames.bind(styles);

function TableModal({ data, isOpen, onClose, onChangeQR }) {
    const qrRef = useRef(null);
    const { downloadImage } = useDownloadImage();

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Quản lý bàn">
            <div className={cx('p-4', 'pt-0')}>
                <div
                    className={cx(
                        'flex',
                        'flex-col',
                        'items-center',
                        'justify-center',
                    )}
                >
                    <h3 className={cx('text-3xl', 'font-bold', 'my-4')}>
                        Bàn {data?.name}
                    </h3>
                    <div
                        className={cx(
                            'text-xl',
                            'mb-8',
                            'flex',
                            'items-center',
                        )}
                    >
                        <span className={cx('whitespace-nowrap')}>
                            Liên kết:{' '}
                        </span>
                        <Link
                            className={cx(
                                'to-url',
                                'hover:opacity-80',
                                'duration-300',
                                'transition-all',
                            )}
                            to={data?.table_url}
                            target='_blank'
                        >
                            {data?.table_url.replace('http://172.20.10.3:5173', '')}
                        </Link>{' '}
                    </div>
                    <TableQRCode
                        // isSimple
                        toUrl={data?.table_url}
                        name={data?.name}
                        className={cx('mb-8')}
                        ref={qrRef}
                    />
                    <button
                        className={cx('btn-change', 'flex', 'items-center')}
                        onClick={onChangeQR}
                    >
                        <ChangeIcon className={cx('change-icon', 'mr-4')} />
                        <span className={cx('mt-0.5')}>Đổi QR</span>
                    </button>
                    {/* QR full image */}
                    {/* <TableQRCode ref={qrRef} className={cx('hide-qr')} toUrl={data?.table_url} /> */}
                    <button
                        onClick={() => downloadImage(qrRef, `Bàn ${data?.name}.png`)}
                        className={cx(
                            'download-btn',
                            'flex',
                            'items-center',
                            'justify-center',
                            'bg-primary',
                            'text-black',
                            'p-2',
                            'rounded-lg',
                            'cursor-pointer',
                        )}
                    >
                        <DownloadIcon className={cx('text-2xl', 'mr-4')} />
                        <span>Tải xuống</span>
                    </button>
                    <div
                        className={cx(
                            'btn-wrapper',
                            'flex',
                            'items-center',
                            'justify-around',
                            'gap-12',
                            'mt-8',
                            'w-full',
                        )}
                    >
                        <button
                            className={cx(
                                'w-30',
                                'py-2',
                                'px-4',
                                'btn-action',
                                'transition-all'
                            )}
                        >
                            Lưu
                        </button>
                        <button
                            onClick={onClose}
                            className={cx(
                                'w-30',
                                'py-2',
                                'px-4',
                                'btn-action',
                                'transition-all'
                            )}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default TableModal;

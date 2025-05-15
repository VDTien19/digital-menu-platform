import { useState } from 'react';
import classNames from 'classnames/bind';

import { CloseIconThin } from '~/components/Icons';
import styles from './InvoicePanel.module.scss';
import InvoiceModal from '~/components/InvoiceModal';

const cx = classNames.bind(styles);

const mockInvoices = {
    '2025-05-01': Array.from({ length: 20 }, (_, i) => ({
        id: `HD00${i + 1}`,
        total: 300000,
    })),
    '2025-05-02': [{ id: 'HD003', total: 880000 }],
    // ... thêm ngày khác nếu cần
};

function InvoicePanel({ date, onClose }) {
    const invoices = mockInvoices[date] || [];

    const [showModal, setShowModal] = useState(false);

    return (
        <div
            className={cx(
                'wrapper',
                'bg-opacity-40',
                'flex',
                'items-center',
                'justify-center',
                'z-50',
            )}
        >
            <div className="bg-white rounded-lg w-[400px] shadow-xl relative">
                <div
                    className={cx(
                        'modal-header',
                        'flex',
                        'items-center',
                        'justify-between',
                    )}
                >
                    <h3 className={cx('text-xl', 'font-bold', 'px-2')}>
                        Hóa đơn ngày {date}
                    </h3>
                    <button
                        onClick={onClose}
                        className={cx('close-btn', 'absolute', 'top-2', 'right-2', 'text-gray-600', 'p-2')}
                    >
                        <CloseIconThin className={cx('close-icon')} fill="#26272a" />
                    </button>
                </div>
                {invoices.length === 0 ? (
                    <p
                        className={cx(
                            'text-gray-500',
                            'pb-4',
                            'text-center',
                            'mt-2',
                        )}
                    >
                        Không có hóa đơn nào.
                    </p>
                ) : (
                    <ul className="space-y-2 pt-0 rounded-b-2xl">
                        {invoices.map((invoice) => (
                            <li
                                key={invoice.id}
                                className={cx(
                                    'invoice-item',
                                    'flex',
                                    'justify-between',
                                    'items-center',
                                    'text-2xl',
                                )}
                                onClick={() => {
                                    setShowModal(true);
                                    console.log(showModal);
                                }}
                            >
                                <span className={cx('font-medium')}>
                                    Mã: {invoice.id}
                                </span>
                                <span>
                                    {invoice.total.toLocaleString()} VND
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {showModal && (
                <InvoiceModal
                    // invoiceId={invoices[0].id}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    // item={}
                />
            )}
        </div>
    );
}

export default InvoicePanel;
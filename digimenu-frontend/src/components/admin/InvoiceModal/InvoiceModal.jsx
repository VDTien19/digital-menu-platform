import React from 'react';
import classNames from 'classnames/bind';

import { CloseIconThin } from '~/components/Icons';

import styles from './InvoiceModal.module.scss';

const cx = classNames.bind(styles);

const mockInvoices = {
  '2025-05-01': [
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
    { id: 'HD001', total: 220000 },
  ],
  '2025-05-02': [
    { id: 'HD003', total: 880000 }
  ],
  // ... thêm ngày khác nếu cần
};

export default function InvoiceModal({ date, onClose }) {
  const invoices = mockInvoices[date] || [];

  return (
    <div className={cx('wrapper', 'bg-opacity-40', 'flex', 'items-center', 'justify-center', 'z-50')}>
      <div className="bg-white rounded-lg w-[400px] shadow-xl relative">
        <div className={cx('modal-header', 'flex', 'items-center', 'justify-between')}>
            <h3 className={cx('text-xl', 'font-bold', 'px-2')}>Hóa đơn ngày {date}</h3>
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-sm"
            >
                <CloseIconThin fill='#26272a' />
            </button>
        </div>
        {invoices.length === 0 ? (
          <p className={cx('text-gray-500', 'pb-4', 'text-center', 'mt-2')}>Không có hóa đơn nào.</p>
        ) : (
          <ul className="space-y-2 pt-0 rounded-b-2xl">
            {invoices.map((invoice) => (
              <li key={invoice.id} className={cx('invoice-item', 'flex', 'justify-between', 'items-center', 'text-2xl')}>
                <span className={cx('font-medium')}>Mã: {invoice.id}</span>
                <span>{invoice.total.toLocaleString()} VND</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

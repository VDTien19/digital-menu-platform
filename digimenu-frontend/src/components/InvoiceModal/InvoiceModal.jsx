import { } from 'react';
import classNames from 'classnames/bind';

import styles from './InvoiceModal.module.scss';
import Modal from '~/components/Modal';
import { formatCurrency } from '~/utils/formatCurrency';
import { formatDateTime } from '~/utils/formatDateTime';

const cx = classNames.bind(styles);

function InvoiceModal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  const formattedDate = formatDateTime(item.issued_at);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Chi tiết hoá đơn' partition>
      <div className={cx('invoice-modal', 'overflow-x-hidden')}>
        <div className={cx('modal-content', 'p-4')}>
          <p className={cx('text-xl', 'font-semibold', 'mb-2')}>Mã hoá đơn: {item._id}</p>
          <p>Ngày tạo: {formattedDate}</p>
          <p>Khách hàng: {item.customer_name} ({item.customer_phone})</p>
          <p>Thu ngân: {item.cashier}</p>
          <p>Phương thức thanh toán: {item.payment_method === 'cash' ? 'Tiền mặt' : item.payment_method}</p>
          {/* <p>Trạng thái: <strong>{item.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</strong></p> */}

          <div className={cx('mt-4')}>
            <p className={cx('text-lg', 'font-medium')}>Danh sách món:</p>
            <table className={cx('w-full', 'mt-2', 'text-sm', 'border-collapse')}>
              <thead>
                <tr>
                  <th className={cx('text-start', 'border-b', 'pb-1')}>Tên món</th>
                  <th className={cx('text-center', 'border-b', 'pb-1')}>Số lượng</th>
                  <th className={cx('text-center', 'border-b', 'pb-1')}>
                    <p className={cx('-mr-12')}>Đơn giá</p>
                  </th>
                  <th className={cx('text-center', 'border-b', 'pb-1')}>
                    <p className={cx('-mr-12')}>Thành tiền</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.items.map((i) => (
                  <tr key={i.item_id}>
                    <td className={cx('name')}>
                        <p>{i.name}</p>
                    </td>
                    <td className={cx('text-center')}>
                        <p>{i.quantity}</p>
                    </td>
                    <td className={cx('text-right')}>
                        <p className={cx('mr-8')}>{formatCurrency(i.unit_price)}</p>
                    </td>
                    <td className={cx('text-right')}>
                        <p className={cx('mr-8')}>{formatCurrency(i.unit_price * i.quantity)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className={cx('text-start', 'mt-4', 'font-semibold')}>
              {/* Tổng cộng: {formatCurrency(item.items.map((i) => i.unit_price * i.quantity).reduce((a, b) => a + b, 0))} */}
              {/* Tổng cộng: {formatCurrency(item.items.reduce((total, i) => total + i.unit_price * i.quantity, 0))} */}
              Tổng cộng: {formatCurrency(item.total)}
            </p>
          </div>
        </div>

        <div className={cx('button-group', 'flex', 'justify-around', 'items-center', 'mt-4', 'text-black')}>
          <button
            className={cx('btn-confirm', 'w-1/2', 'rounded-bl-xl', 'cursor-pointer', 'p-4')}
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default InvoiceModal;

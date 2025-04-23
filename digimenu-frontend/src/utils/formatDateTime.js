import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Định dạng ngày giờ theo múi giờ Việt Nam
 * @param {string | Date} date
 * @param {string} format
 * @returns {string}
 */
export const formatDateTime = (date, format = 'DD/MM/YYYY HH:mm') => {
    return dayjs(date).tz('Asia/Ho_Chi_Minh').format(format);
};
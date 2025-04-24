/**
 * Format số tiền thành định dạng tiền tệ Việt Nam (VND)
 * @param {number} value
 * @returns {string} formatted currency string
 */

export const formatCurrency = (value) =>
    value?.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

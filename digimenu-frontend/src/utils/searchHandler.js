import * as httpRequest from '~/utils/httpRequest';

// const normalizeText = (text) => {
//     return text
//         .toLowerCase()
//         .normalize('NFD')                     // tách ký tự base + dấu
//         .replace(/[\u0300-\u036f]/g, '')      // xóa dấu
//         .replace(/đ/g, 'd')                   // thay đ -> d
//         .replace(/[^a-z0-9\s]/g, '')          // (optional) loại bỏ ký tự đặc biệt
//         .trim();                              // xóa khoảng trắng đầu/cuối
// };

export const searchByPath = async (pathname, searchValue, setters) => {
    const searchMap = [
        {
            path: '/admin/category',
            endpoint: 'menu_categories',
            setter: setters.setCategories,
            queryParam: 'name',
        },
        {
            path: '/admin/menu',
            endpoint: 'menu_items',
            setter: setters.setDishes,
            queryParam: 'name',
        },
        {
            path: '/admin/table',
            endpoint: 'tables',
            setter: setters.setTables,
            queryParam: 'name_like',
        },
        {
            path: '/admin/staff',
            endpoint: 'staff',
            setter: setters.setStaff,
            queryParam: 'name_like',
        },
        {
            path: '/admin/invoice',
            endpoint: 'invoices',
            setter: setters.setInvoices,
            queryParam: 'id_like',
        },
    ];

    // const normalized = normalizeText(searchValue);
    // const encodedKeyword = encodeURIComponent(normalized);

    const encodedKeyword = encodeURIComponent(searchValue);

    for (const item of searchMap) {
        if (pathname.includes(item.path)) {
            const res = await httpRequest.get(`${item.endpoint}?${item.queryParam}=${encodedKeyword}`);
            item.setter(res);
            break;
        }
    }
};

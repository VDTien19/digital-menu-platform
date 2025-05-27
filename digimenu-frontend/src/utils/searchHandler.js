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
            path: 'category',
            endpoint: 'menu_categories',
            setter: setters.setCategories,
            queryParam: 'name',
        },
        {
            path: 'menu',
            endpoint: 'menu_items',
            setter: setters.setDishes,
            queryParam: 'name',
        },
        {
            path: 'table',
            endpoint: 'tables',
            setter: setters.setTables,
            queryParam: 'name',
        },
        {
            path: 'staff',
            endpoint: 'staff',
            setter: setters.setStaff,
            queryParam: 'name',
        },
        {
            path: 'invoice',
            endpoint: 'invoices',
            setter: setters.setInvoices,
            queryParam: 'id',
        },
    ];

    const encodedKeyword = encodeURIComponent(searchValue);

    const segments = pathname.split('/').filter(Boolean); // ['admin', 'menu']
    const lastSegment = segments[segments.length - 1];     // 'menu'

    for (const item of searchMap) {
        if (lastSegment === item.path) {
            const res = await httpRequest.get(`${item.endpoint}?${item.queryParam}=${encodedKeyword}`);
            item.setter(res);
            break;
        }
    }
};


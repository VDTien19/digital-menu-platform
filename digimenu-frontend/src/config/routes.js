const routes = {
    // Home page: digital menu ordering system introduction
    home: '/',

    // Client routes
    client_home: '/:slug',  // query theo tên bàn
    client_menu: '/:slug/menu/:tableName',
    client_message: '/:slug/status/:tableName',
    client_payment: '/:slug/payment/:tableName',
    client_cart: '/:slug/cart/:tableName',
    client_invoice: '/:slug/invoice',
    // client_invoice_detail: '/:slug/invoice/:invoiceId',

    // Admin routes
    admin_dashboard: '/:slug/admin',
    admin_category: '/:slug/admin/category',
    admin_introduce: '/:slug/admin/introduce',
    admin_menu: '/:slug/admin/menu',
    admin_staff: '/:slug/admin/staff',
    admin_table: '/:slug/admin/table',
    admin_login: '/:slug/admin/login',

    // Service routes
    service_home: '/:slug/service',
    service_view_order: '/:slug/service/order/:tableName',
    service_payment: '/:slug/service/payment/:tableName',
    service_login: '/:slug/service/login',
};

export default routes;
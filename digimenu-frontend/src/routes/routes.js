import config from '~/config';

// page
import { Category, Dashboard, Introduce, Menu as AdminMenu, Staff, Table } from '~/pages/admin';
import { Cart, Home as ClientHome, Invoice, Menu as ClientMenu, Message, Payment as ClientPayment } from '~/pages/client';
import { Home as ServiceHome, Orders, Payment as ServicePayment } from '~/pages/service';
import Home from '~/pages/Home';
import Login from '~/pages/Login';

const publicRoutes = [
    // Public routes
    { path: config.routes.home, component: Home, layout: null },
    { path: config.routes.admin_login, component: Login, layout: null },
    { path: config.routes.service_login, component: Login, layout: null },

    // Client routes
    { path: config.routes.client_home, component: ClientHome },
    { path: config.routes.client_menu, component: ClientMenu },
    { path: config.routes.client_message, component: Message },
    { path: config.routes.client_payment, component: ClientPayment },
    { path: config.routes.client_cart, component: Cart },
    { path: config.routes.client_invoice, component: Invoice },
];

const privateRoutes = [
    // Admin routes
    { path: config.routes.admin_dashboard, component: Dashboard, layout: 'admin' },
    { path: config.routes.admin_category, component: Category, layout: 'admin' },
    { path: config.routes.admin_introduce, component: Introduce, layout: 'admin' },
    { path: config.routes.admin_menu, component: AdminMenu, layout: 'admin' },
    { path: config.routes.admin_staff, component: Staff, layout: 'admin' },
    { path: config.routes.admin_table, component: Table, layout: 'admin' },

    // Service routes
    { path: config.routes.service_home, component: ServiceHome, layout: 'staff' },
    { path: config.routes.service_view_order, component: Orders, layout: 'staff' },
    { path: config.routes.service_payment, component: ServicePayment, layout: 'staff' },
];

export { publicRoutes, privateRoutes }
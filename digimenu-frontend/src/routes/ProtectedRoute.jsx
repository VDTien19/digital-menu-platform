import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    let toUrl;

    const slug = 'res-ktn';

    const path = window.location.pathname;
    const isAdmin = path.includes('/admin');
    const isService = path.includes('/service');

    if (isAdmin) {
        toUrl = `/${slug}/admin/login`;
    } else if (isService) {
        toUrl = `/${slug}/service/login`;
    }

    console.log('toUrl:', toUrl);
    
    const token = localStorage.getItem("token");

    return token ? children : <Navigate to={toUrl} />;
};

export default ProtectedRoute;
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children, adminOnly = false }) {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        
        // Comprobar expiración
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            return <Navigate to="/login" replace />;
        }

        // Proteger vistas de solo-admin (ej. Reportes)
        if (adminOnly && decoded.rol !== 'admin') {
            return <Navigate to="/" replace />; 
        }

        return children;
    } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
}

export default ProtectedRoute;

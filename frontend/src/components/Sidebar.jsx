// 1. Agregamos useEffect a la importación de React
import { useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import '../style/App_Dashboard.css'; // Asegúrate de tener tu CSS importado

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    // 2. Lógica para cambiar el color del body
    useEffect(() => {
        // Evaluamos la ruta actual y asignamos un color de fondo
        switch (location.pathname) {
            case '/':
                document.body.style.backgroundColor = '#f8cdef'; 
                break;
            case '/alumnos':
                document.body.style.backgroundColor = '#e6b9f4';
                break;
            case '/asistencias':
                document.body.style.backgroundColor = '#f0f3ca'; 
                break;
            case '/clases':
                document.body.style.backgroundColor = '#cceff1';
                break;
            case '/finanzas':
                document.body.style.backgroundColor = '#cdf8d3';
                break;
            case '/reportes':
                document.body.style.backgroundColor = '#f4dec8'; 
                break;
            default:
                document.body.style.backgroundColor = '#f6c2ef'; 
                break;
        }

        // Limpiamos el estilo al desmontar (buena práctica)
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, [location.pathname]); // El array indica que esto se ejecuta CADA VEZ que cambia la ruta


    // Función intacta para los botones
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="sidebar">
            <div className="profile-icon">
                <i className="fas fa-user"></i>
            </div>
            <ul className="nav-links">
                <li className={`principal ${isActive('/')}`} onClick={() => navigate('/')}>
                    <i className="fas fa-home"></i><span>Página Principal</span>
                </li>
                <li className={`alumnos ${isActive('/alumnos')}`} onClick={() => navigate('/alumnos')}>
                    <i className="fas fa-graduation-cap"></i><span>Alumnos</span>
                </li>
                <li className={`asistencias ${isActive('/asistencias')}`} onClick={() => navigate('/asistencias')}>
                    <i className="fas fa-calendar-check"></i><span>Asistencias</span>
                </li>
                <li className={`clases ${isActive('/clases')}`} onClick={() => navigate('/clases')}>
                    <i className="fas fa-book"></i><span>Clases</span>
                </li>
                <li className={`finanzas ${isActive('/finanzas')}`} onClick={() => navigate('/finanzas')}>
                    <i className="fas fa-piggy-bank"></i><span>Finanzas</span>
                </li>
                <li className={`reportes ${isActive('/reportes')}`} onClick={() => navigate('/reportes')}>
                    <i className="fas fa-chart-bar"></i><span>Reportes</span>
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;
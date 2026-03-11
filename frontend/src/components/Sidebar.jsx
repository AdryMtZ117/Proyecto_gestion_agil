import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation(); // Para saber en qué página estamos

    // Función para saber si el botón debe verse "activo"
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="sidebar">
            <div className="profile-icon">
                <i className="fas fa-user"></i>
            </div>
            <ul className="nav-links">
                <li className={isActive('/')} onClick={() => navigate('/')}>
                    <i className="fas fa-home"></i><span>Página Principal</span>
                </li>
                <li className={isActive('/alumnos')} onClick={() => navigate('/alumnos')}>
                    <i className="fas fa-graduation-cap"></i><span>Alumnos</span>
                </li>
                <li className={isActive('/asistencias')} onClick={() => navigate('/asistencias')}>
                    <i className="fas fa-calendar-check"></i><span>Asistencias</span>
                </li>
                <li className={isActive('/clases')} onClick={() => navigate('/clases')}>
                    <i className="fas fa-book"></i><span>Clases</span>
                </li>
                <li className={isActive('/finanzas')} onClick={() => navigate('/finanzas')}>
                    <i className="fas fa-piggy-bank"></i><span>Finanzas</span>
                </li>
                <li className={isActive('/reportes')} onClick={() => navigate('/reportes')}>
                    <i className="fas fa-chart-bar"></i><span>Reportes</span>
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;
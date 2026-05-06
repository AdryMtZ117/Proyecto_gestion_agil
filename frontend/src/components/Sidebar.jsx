import { useEffect, useState, useRef } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../style/App_Dashboard.css'; 

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [rol, setRol] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileDropdownRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setRol(decoded.rol);
            } catch (e) {
                console.error("Invalid token in sidebar", e);
            }
        }
    }, []);

    useEffect(() => {
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

        return () => {
            document.body.style.backgroundColor = '';
        };
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    return (
        <nav className="sidebar">
            <div 
                className="profile-icon" 
                ref={profileDropdownRef}
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
                <i className="fas fa-user"></i>
                
                {isProfileOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '100%',
                        marginLeft: '15px',
                        background: 'white',
                        color: 'black',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        zIndex: 1000,
                        minWidth: '120px',
                        textAlign: 'center',
                        cursor: 'default',
                        fontSize: '0.75em'
                    }} onClick={(e) => e.stopPropagation()}>
                        <p style={{ margin: '0 0 8px 0', color: '#555', fontWeight: 'bold' }}>
                            Rol: {rol === 'admin' ? 'Administrador' : 'Empleado'}
                        </p>
                        <button onClick={handleLogout} style={{ 
                            background: '#ff4c4c', 
                            border: 'none', 
                            color: '#fff', 
                            cursor: 'pointer', 
                            fontSize: '0.9em',
                            padding: '5px 8px',
                            borderRadius: '4px',
                            width: '100%',
                            fontWeight: 'bold'
                        }}>
                            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>

            <ul className="nav-links" style={{ marginTop: '30px' }}>
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
                {rol !== 'empleado' && (
                    <li className={`reportes ${isActive('/reportes')}`} onClick={() => navigate('/reportes')}>
                        <i className="fas fa-chart-bar"></i><span>Reportes</span>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Sidebar;
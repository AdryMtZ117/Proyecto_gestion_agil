import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../style/App_Dashboard.css';

function NotificationBell() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Fetch notifications
        const fetchNotificaciones = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/notificaciones');
                setNotificaciones(response.data);
            } catch (error) {
                console.error("Error al obtener notificaciones", error);
            }
        };

        fetchNotificaciones();
        // Opcional: Actualizar cada cierto tiempo
        const interval = setInterval(fetchNotificaciones, 60000); 
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="notification" ref={dropdownRef} style={{ position: 'relative', cursor: 'pointer' }} onClick={toggleDropdown}>
            <i className="fas fa-bell"></i>
            {notificaciones.length > 0 && (
                <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                }}>
                    {notificaciones.length}
                </span>
            )}

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '10px',
                    background: 'white',
                    color: 'black',
                    width: '220px',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    borderRadius: '6px',
                    zIndex: 1000,
                    padding: '8px',
                    textAlign: 'left',
                    fontSize: '0.75em'
                }}>
                    <h4 style={{ margin: '0 0 8px 0', borderBottom: '1px solid #ccc', paddingBottom: '4px', fontSize: '1.1em' }}>Notificaciones</h4>
                    {notificaciones.length === 0 ? (
                        <p style={{ margin: 0, color: '#666' }}>No hay notificaciones pendientes.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {notificaciones.map((notif) => (
                                <li key={notif.id} style={{ borderBottom: '1px solid #eee', padding: '6px 0' }}>
                                    <p style={{ margin: '0 0 3px 0', fontWeight: 'bold' }}>{notif.mensaje}</p>
                                    <span style={{ fontSize: '0.85em', color: '#888' }}>{notif.fecha}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;

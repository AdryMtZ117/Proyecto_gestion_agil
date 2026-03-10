import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App3_FINANZAS_A.css';

function App3_FINANZAS_A() {
    const [status, setStatus] = useState({ message: 'Conectando al backend...', db_test: '...' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/api/status')
            .then(response => {
                setStatus(response.data);
            })
            .catch(err => {
                console.error(err);
                setError('Error al conectar con el backend.');
            });
    }, []);

    return (
        <div className="container">
            {/* NAVEGACIÓN ORIGINAL (SIN CAMBIOS) */}
            <nav className="sidebar">
                <div className="profile-icon">
                    <i className="fas fa-user"></i>
                </div>
                <ul className="nav-links">
                    <li onClick={() => navigate('/')}>
                        <i className="fas fa-home"></i><span>Página Principal</span>
                    </li>
                    <li onClick={() => navigate('/alumnos')}>
                        <i className="fas fa-graduation-cap"></i><span>Alumnos</span>
                    </li>
                    <li onClick={() => navigate('/asistencias')}>
                        <i className="fas fa-calendar-check"></i><span>Asistencias</span>
                    </li>
                    <li><i className="fas fa-book"></i><span>Clases</span></li>
                    <li className="active"><i className="fas fa-piggy-bank"></i><span>Finanzas</span></li>
                    <li><i className="fas fa-chart-bar"></i><span>Reportes</span></li>
                </ul>
            </nav>

            {/* CONTENIDO PRINCIPAL ACTUALIZADO */}
            <main className="main-content finanzas-layout">
                <header className="top-bar-simple">
                    <div className="spacer"></div>
                    <div className="notification">
                        <i className="fas fa-bell"></i>
                    </div>
                </header>

                <h2 className="section-title">Control de Pagos</h2>

                <div className="filters-section">
                    <div className="search-container">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Buscar alumno por nombre..." />
                    </div>

                    <div className="dropdowns-container">
                        <div className="custom-select">
                            <select>
                                <option value="">Mes de Pago</option>
                                <option value="enero">Enero</option>
                                <option value="febrero">Febrero</option>
                            </select>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="custom-select">
                            <select>
                                <option value="">Disciplina</option>
                                <option value="karate">Karate</option>
                                <option value="box">Boxeo</option>
                            </select>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="custom-select">
                            <select>
                                <option value="">Estatus de Pago</option>
                                <option value="pagado">Pagado</option>
                                <option value="pendiente">Pendiente</option>
                            </select>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Foto</th>
                                <th>Nombre Completo</th>
                                <th>Disciplina</th>
                                <th>Último Pago</th>
                                <th>Monto</th>
                                <th>Estatus</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="avatar-small"><img src="https://i.pravatar.cc/150?img=5" alt="foto" /></div>
                                </td>
                                <td>Ana Martínez</td>
                                <td>Karate Do</td>
                                <td>15/08/2026</td>
                                <td>$850.00</td>
                                <td><span className="status-pill success">Pagado</span></td>
                                <td><button className="btn-icon"><i className="fas fa-receipt"></i></button></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="avatar-small"><img src="https://i.pravatar.cc/150?img=12" alt="foto" /></div>
                                </td>
                                <td>Carlos Ruiz</td>
                                <td>Jiu-Jitsu</td>
                                <td>02/08/2026</td>
                                <td>$900.00</td>
                                <td><span className="status-pill danger">Pendiente</span></td>
                                <td><button className="btn-icon"><i className="fas fa-dollar-sign"></i></button></td>
                            </tr>
                            {/* Repetir según sea necesario */}
                        </tbody>
                    </table>
                </div>

                <div className="bottom-action">
                    <button className="btn-lila">
                        <i className="fas fa-file-invoice-dollar"></i> Generar Reporte Mensual
                    </button>
                </div>
            </main>
        </div>
    );
}

export default App3_FINANZAS_A;
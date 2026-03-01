import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- Importamos la herramienta para viajar
import './App2_ModuloAlumnos.css';

function App2_ModuloAlumnos() {
    const [status, setStatus] = useState({ message: 'Conectando al backend...', db_test: '...' });
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // <-- Activamos la herramienta

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

    // Interfaz de usuario corregida para React (className y etiquetas cerradas)
    return (
        <div className="container">
            <nav className="sidebar">
                <div className="profile-icon">
                    <i className="fas fa-user"></i>
                </div>
                <ul className="nav-links">
                    {/* Así regresamos al menú principal */}
                    <li onClick={() => navigate('/')}>
                        <i className="fas fa-home"></i><span>Página Principal</span>
                    </li>
                    <li className="active"><i className="fas fa-graduation-cap"></i><span>Alumnos</span></li>
                    <li><i className="fas fa-calendar-check"></i><span>Asistencias</span></li>
                    <li><i className="fas fa-book"></i><span>Clases</span></li>
                    <li><i className="fas fa-piggy-bank"></i><span>Finanzas</span></li>
                    <li><i className="fas fa-chart-bar"></i><span>Reportes</span></li>
                </ul>
            </nav>

            <main className="main-content alumnos-layout">
                <header className="top-bar-simple">
                    <div className="spacer"></div>
                    <div className="notification">
                        <i className="fas fa-bell"></i>
                    </div>
                </header>

                <div className="filters-section">
                    <div className="search-container">
                        <i className="fas fa-search"></i>
                        {/* ETIQUETA INPUT CERRADA CORRECTAMENTE CON "/>" */}
                        <input type="text" placeholder="Buscar" />
                    </div>

                    <div className="dropdowns-container">
                        <div className="custom-select">
                            <select>
                                <option value="">Nombre</option>
                            </select>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="custom-select">
                            <select>
                                <option value="">Disciplina</option>
                            </select>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="custom-select">
                            <select>
                                <option value="">Estatus</option>
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
                                <th>Nombre</th>
                                <th>Disciplina</th>
                                <th>Fecha de Pago</th>
                                <th>Estatus</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {/* ETIQUETA IMG CERRADA CORRECTAMENTE */}
                                    <div className="avatar-small"><img src="https://i.pravatar.cc/150?img=5" alt="foto" /></div>
                                </td>
                                <td>Name</td>
                                <td>Disciplina</td>
                                <td>15/08/2026</td>
                                <td><span className="status-dot success"></span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="avatar-small"><img src="https://i.pravatar.cc/150?img=8" alt="foto" /></div>
                                </td>
                                <td>Name</td>
                                <td>Disciplina</td>
                                <td>15/08/2026</td>
                                <td><span className="status-dot danger"></span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="avatar-small"><img src="https://i.pravatar.cc/150?img=9" alt="foto" /></div>
                                </td>
                                <td>Name</td>
                                <td>Disciplina</td>
                                <td>15/08/2026</td>
                                <td><span className="status-dot success"></span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="avatar-small"><img src="https://i.pravatar.cc/150?img=12" alt="foto" /></div>
                                </td>
                                <td>Name</td>
                                <td>Disciplina</td>
                                <td>15/08/2026</td>
                                <td><span className="status-dot danger"></span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="avatar-small"><img src="https://i.pravatar.cc/150?img=10" alt="foto" /></div>
                                </td>
                                <td>Name</td>
                                <td>Disciplina</td>
                                <td>15/08/2026</td>
                                <td><span className="status-dot danger"></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bottom-action">
                    <button className="btn-lila"><i className="fas fa-plus"></i> Nuevo alumno</button>
                </div>
            </main>
        </div>
    );
}

export default App2_ModuloAlumnos;
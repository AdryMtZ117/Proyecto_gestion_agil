import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import App2_ModuloAlumnos from './App2_ModuloAlumnos';

// --- ESTE ES TU MENÚ PRINCIPAL ---
function PaginaPrincipal() {
    const [status, setStatus] = useState({ message: 'Conectando al backend...', db_test: '...' });
    const navigate = useNavigate(); // <-- La herramienta para viajar

    useEffect(() => {
        axios.get('http://localhost:3000/api/status')
            .then(response => setStatus(response.data))
            .catch(err => console.error('Error al conectar con Node', err));
    }, []);

    return (
        <div className="container">
            <nav className="sidebar">
                <div className="profile-icon">
                    <i className="fas fa-user"></i>
                </div>
                <ul className="nav-links">
                    <li className="active"><i className="fas fa-home"></i><span>Pagina Principal</span></li>

                    {/* ESTE ES EL BOTÓN QUE VIAJA A LA OTRA PÁGINA */}
                    <li onClick={() => navigate('/alumnos')}>
                        <i className="fas fa-graduation-cap"></i><span>Alumnos</span>
                    </li>
                    
                    <li><i className="fas fa-calendar-check"></i><span>Asistencias</span></li>
                    <li><i className="fas fa-book"></i><span>Clases</span></li>
                    <li><i className="fas fa-piggy-bank"></i><span>Finanzas</span></li>
                    <li><i className="fas fa-chart-bar"></i><span>Reportes</span></li>
                </ul>
            </nav>

            <main class="main-content">
            <header class="top-bar">
                <div class="stats-card">
                    <div class="stat">Alumnos Activos: <strong>23</strong></div>
                    <div class="stat">Asistencia de hoy: <strong>18</strong></div>
                    <div class="stat">Ingresos del mes: <strong>$2700</strong></div>
                    <div class="stat">Saldo pendiente: <strong>$3500</strong></div>
                </div>
                <div class="notification">
                    <i class="fas fa-bell"></i>
                </div>
            </header>

            <section id="tab-content">
                <div id="home" class="tab-pane active">
                    <div class="dashboard-grid">
                        <div class="chart-container">
                            <h3>Ingresos / Gastos</h3>
                            <canvas id="myChart"></canvas>
                            <p class="chart-label">Mes: Agosto</p>
                        </div>
                        <div class="classes-container">
                            <h3>Próximas clases</h3>
                            <ul class="class-list">
                                <li><span>1:20 p.m.</span> <span>Danza alt</span></li>
                                <li><span>1:20 p.m.</span> <span>Danza alt</span></li>
                                <li><span>1:30 p.m.</span> <span>Danza alt</span></li>
                                <li><span>2:20 p.m.</span> <span>Danza alt</span></li>
                                <li><span>2:40 p.m.</span> <span>Danza alt</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div id="alumnos" class="tab-pane"><h2>Sección de Alumnos</h2></div>
                <div id="asistencias" class="tab-pane"><h2>Control de Asistencias</h2></div>
                <div id="clases" class="tab-pane"><h2>Gestión de Clases</h2></div>
                <div id="finanzas" class="tab-pane"><h2>Detalle de Finanzas</h2></div>
                <div id="reportes" class="tab-pane"><h2>Generar Reportes</h2></div>
            </section>
        </main>
        </div>
    );
}

// --- ESTE ES EL CONTROLADOR DE RUTAS ---
function App() {
    return (
        <Routes>
            <Route path="/" element={<PaginaPrincipal />} />
            <Route path="/alumnos" element={<App2_ModuloAlumnos />} />
        </Routes>
    );
}

export default App;
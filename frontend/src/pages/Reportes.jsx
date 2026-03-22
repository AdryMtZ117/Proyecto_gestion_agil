import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Reportes.css';

function Finanzas() {
    const navigate = useNavigate();
    const [status, setStatus] = useState({ message: 'Conectando...', db_test: '...' });

    // Datos estáticos para simular las asistencias de la imagen
    const asistencias = [
        { id: 1, clase: 'Danza Moderna', cantidad: 18, highlight: false },
        { id: 2, clase: 'Danza Moderna', cantidad: 20, highlight: true },
        { id: 3, clase: 'Danza Moderna', cantidad: 15, highlight: false },
        { id: 4, clase: 'Danza Moderna', cantidad: 12, highlight: false },
        { id: 5, clase: 'Danza Moderna', cantidad: 16, highlight: false },
        { id: 6, clase: 'Danza Moderna', cantidad: 20, highlight: true },
    ];

    useEffect(() => {
        axios.get('http://localhost:3000/api/status')
            .then(response => setStatus(response.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <main className="main-content finanzas-layout">
            {/* Cabecera / Barra superior */}
            <header className="top-bar-simple">
                <div className="filter-container">
                    <span className="filter-label">Filtro</span>
                    <div className="filter-input-wrapper">
                        <input type="text" value="Esta semana" readOnly />
                        <i className="far fa-times-circle"></i>
                    </div>
                </div>
                <div className="notification">
                    <i className="fas fa-bell"></i>
                </div>
            </header>

            {/* Contenido Principal (Grid 2 Columnas) */}
            <div className="dashboard-content">
                
                {/* Columna Izquierda - Gráfica de Gastos */}
                <div className="card gastos-card">
                    <h2 className="section-title">Resumen de gastos</h2>
                    <div className="chart-wrapper">
                        {/* La gráfica se dibuja con CSS puro */}
                        <div className="pie-chart"></div>
                        
                        {/* Etiquetas de la gráfica posicionadas manualmente */}
                        <span className="chart-label label-mantenimiento">Mantenimiento</span>
                        <span className="chart-label label-sueldos">Sueldos de<br/>maestros</span>
                        <span className="chart-label label-banos">Baños</span>
                        <span className="chart-label label-materiales">Materiales</span>
                        <span className="chart-label label-empleados">Empleados</span>
                        <span className="chart-label label-otros">Otros</span>
                    </div>
                </div>

                {/* Columna Derecha - Asistencias y Botón */}
                <div className="right-column">
                    <div className="card asistencias-card">
                        <h2 className="section-title">Asistencias por clase</h2>
                        <div className="asistencias-list">
                            {asistencias.map((item) => (
                                <div key={item.id} className="asistencia-row">
                                    <div className="asistencia-left">
                                        <i className={item.highlight ? "fas fa-star" : "far fa-star-circle"}></i>
                                        <span>{item.clase}</span>
                                    </div>
                                    <div className="asistencia-right">
                                        <span>{item.cantidad}</span>
                                        <i className="fas fa-caret-right"></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botón de Reporte PDF Dividido */}
                    <div className="action-buttons-container">
                        <button className="btn-reporte-pdf">
                            <i className="fas fa-star"></i> Reporte PDF
                        </button>
                        <button className="btn-reporte-dropdown">
                            <i className="fas fa-chevron-down"></i>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Finanzas;
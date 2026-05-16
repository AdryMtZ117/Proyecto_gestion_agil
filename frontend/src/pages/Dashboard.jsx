import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { jwtDecode } from 'jwt-decode';
import '../style/App_Dashboard.css';
import '../style/Reportes.css';

import NotificationBell from '../components/NotificationBell';

function Dashboard() {
    const [dashboard, setDashboard] = useState({
        alumnosActivos: 0,
        asistenciasHoy: 0,
        ingresosMes: 0,
        saldoPendiente: 0,
        ingresosGastos: [],
        proximasClases: []
    });
    const [rol, setRol] = useState('');

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setRol(decoded.rol);
            } catch (e) {
                console.error(e);
            }
        }

        fetch('http://localhost:3000/api/dashboard')
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.error("Error en datos del dashboard:", data.error, data.details);
                } else {
                    setDashboard(data);
                }
            })
            .catch(err => console.error("Error dashboard:", err));
    }, []);

    useEffect(() => {
        if (rol === 'empleado' || dashboard.ingresosGastos.length === 0) return;

        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dashboard.ingresosGastos.map(d => d.dia),
                datasets: [
                    {
                        label: "Ingresos",
                        data: dashboard.ingresosGastos.map(d => d.ingresos),
                        backgroundColor: "rgba(75,192,192,0.6)"
                    },
                    {
                        label: "Gastos",
                        data: dashboard.ingresosGastos.map(d => d.gastos),
                        backgroundColor: "rgba(255,99,132,0.6)"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Ingresos / Gastos' }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };

    }, [dashboard.ingresosGastos, rol]);


    return (
        <main className="main-content finanzas-layout">
        <div className="main-content">

            <header className="top-bar">
                <div className="stats-card">
                    <div className="stat">Alumnos Activos: <strong>{dashboard.alumnosActivos}</strong></div>
                    <div className="stat">Asistencia de hoy: <strong>{dashboard.asistenciasHoy}</strong></div>
                    {rol !== 'empleado' && (
                        <>
                            <div className="stat">Ingresos del mes: <strong>${dashboard.ingresosMes}</strong></div>
                            <div className="stat">Saldo pendiente: <strong>${dashboard.saldoPendiente}</strong></div>
                        </>
                    )}
                </div>
                <NotificationBell />
            </header>

            <div className="dashboard-grid" style={rol === 'empleado' ? { display: 'flex', flexDirection: 'column', gap: '20px' } : {}}>
                {rol !== 'empleado' && (
                    <div className="chart-container">
                        <h3>Ingresos / Gastos</h3>
                        <div style={{ height: "450px", width: "100%" }}>
                            <canvas ref={chartRef}></canvas>
                        </div>
                        <p className="chart-label">
                            Mes: {new Date().toLocaleString('es-ES', { month: 'long' })}
                        </p>
                    </div>
                )}

                <div className="classes-container" style={rol === 'empleado' ? { width: '100%', flex: 1 } : {}}>
                    <h3>Próximas clases</h3>
                    <ul className="class-list" style={rol === 'empleado' ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' } : {}}>
                        {dashboard.proximasClases.length === 0 ? (
                            <p>No hay próximas clases</p>
                        ) : (
                            dashboard.proximasClases.map((clase, i) => (
                                <li key={i} style={rol === 'empleado' ? { background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px' } : {}}>
                                    <span style={rol === 'empleado' ? { display: 'block', fontSize: '1.2em', fontWeight: 'bold' } : {}}>{clase.hora}</span>
                                    <span style={rol === 'empleado' ? { display: 'block', color: '#ffb6b9', marginTop: '5px' } : {}}>{clase.nombre}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {rol === 'empleado' && (
                    <div className="classes-container" style={{ width: '100%', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px', textAlign: 'center' }}>
                        <h3>Gestión de Alumnos y Asistencias</h3>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <div>
                                <i className="fas fa-users" style={{ fontSize: '3em', color: '#ffb6b9' }}></i>
                                <p style={{ marginTop: '10px', fontSize: '1.2em' }}>{dashboard.alumnosActivos} Alumnos Totales</p>
                            </div>
                            <div>
                                <i className="fas fa-calendar-check" style={{ fontSize: '3em', color: '#cdf8d3' }}></i>
                                <p style={{ marginTop: '10px', fontSize: '1.2em' }}>{dashboard.asistenciasHoy} Asistencias Hoy</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
        </main>
    );
}

export default Dashboard;
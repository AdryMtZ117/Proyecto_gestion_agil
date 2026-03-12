import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../style/App_Dashboard.css';

function Dashboard() {

    const [dashboard, setDashboard] = useState({
        alumnosActivos: 0,
        asistenciasHoy: 0,
        ingresosMes: 0,
        saldoPendiente: 0,
        ingresosGastos: [],
        proximasClases: []
    });

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // FETCH DEL BACKEND
    useEffect(() => {
        fetch('http://localhost:3000/api/dashboard')
            .then(res => res.json())
            .then(data => setDashboard(data))
            .catch(err => console.error("Error dashboard:", err));
    }, []);

    // CREAR GRAFICA CON LOS DATOS
    useEffect(() => {

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
                        title: {
                            display: true,
                            text: 'Ingresos / Gastos'
                        }
                    },
                    
                }
            }
        });

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };

    }, [dashboard.ingresosGastos]);


    return (
        <div className="main-content">

            <header className="top-bar">
                <div className="stats-card">

                    <div className="stat">
                        Alumnos Activos: <strong>{dashboard.alumnosActivos}</strong>
                    </div>

                    <div className="stat">
                        Asistencia de hoy: <strong>{dashboard.asistenciasHoy}</strong>
                    </div>

                    <div className="stat">
                        Ingresos del mes: <strong>${dashboard.ingresosMes}</strong>
                    </div>

                    <div className="stat">
                        Saldo pendiente: <strong>${dashboard.saldoPendiente}</strong>
                    </div>

                </div>

                <div className="notification">
                    <i className="fas fa-bell"></i>
                </div>
            </header>


            <div className="dashboard-grid">

                <div className="chart-container">
                    <h3>Ingresos / Gastos</h3>

                    <div style={{ height: "450px", width: "100%" }}>
                        <canvas ref={chartRef}></canvas>
                    </div>

                    <p className="chart-label">
                        Mes: {new Date().toLocaleString('es-ES', { month: 'long' })}
                    </p>

                </div>


                <div className="classes-container">
                    <h3>Próximas clases</h3>

                    <ul className="class-list">

                        {dashboard.proximasClases.length === 0 ? (
                            <p>No hay próximas clases</p>
                        ) : (
                            dashboard.proximasClases.map((clase, i) => (
                                <li key={i}>
                                    <span>{clase.hora}</span>
                                    <span>{clase.nombre}</span>
                                </li>
                            ))
                        )}

                    </ul>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;
import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import '../style/App_Dashboard.css';

function Dashboard() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        // Destruye el gráfico anterior si existe (evita errores de React)
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                datasets: [
                    { label: 'Ingresos', data: [1200, 1900, 1500, 2700], backgroundColor: '#ff0066' },
                    { label: 'Gastos', data: [500, 800, 400, 600], backgroundColor: '#bbb' }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
        
        return () => chartInstance.current?.destroy();
    }, []);

    return (
        <div className="main-content">
            <header className="top-bar">
                <div className="stats-card">
                    <div className="stat">Alumnos Activos: <strong>23</strong></div>
                    <div className="stat">Asistencia de hoy: <strong>18</strong></div>
                    <div className="stat">Ingresos del mes: <strong>$2700</strong></div>
                    <div className="stat">Saldo pendiente: <strong>$3500</strong></div>
                </div>
                
                {/* Usamos la etiqueta <i> clásica porque ya tienes FontAwesome en tu index.html */}
                <div className="notification">
                    <i className="fas fa-bell"></i>
                </div>
            </header>

            <div className="dashboard-grid">
                <div className="chart-container">
                    <h3>Ingresos / Gastos</h3>
                    <div style={{ height: '250px' }}>
                        <canvas ref={chartRef}></canvas>
                    </div>
                    <p className="chart-label">Mes: Agosto</p>
                </div>
                
                <div className="classes-container">
                    <h3>Próximas clases</h3>
                    <ul className="class-list">
                        <li><span>1:20 p.m.</span> <span>Danza alt</span></li>
                        <li><span>1:30 p.m.</span> <span>Danza alt</span></li>
                        <li><span>2:20 p.m.</span> <span>Danza alt</span></li>
                        <li><span>2:40 p.m.</span> <span>Danza alt</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
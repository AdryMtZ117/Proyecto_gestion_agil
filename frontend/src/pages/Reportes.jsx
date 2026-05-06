import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../style/Reportes.css';

import NotificationBell from '../components/NotificationBell';

function Finanzas() {
    const navigate = useNavigate();
    const [periodo, setPeriodo] = useState('todo');
    const [datos, setDatos] = useState({
        gastos: [],
        totalIngresos: 0,
        asistencias: []
    });
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        fetchDashboardData();
    }, [periodo]);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/reportes/dashboard?periodo=${periodo}`);
            setDatos(response.data);
            renderChart(response.data.gastos);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    const renderChart = (gastos) => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        const labels = gastos.map(g => g.concepto);
        const data = gastos.map(g => g.total);

        if (gastos.length === 0) {
            labels.push("Sin gastos");
            data.push(1);
        }

        chartInstance.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#000' }
                    }
                }
            }
        });
    };

    const handleGeneratePDF = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/reportes/pdf-data?periodo=${periodo}`);
            const data = response.data;
            const doc = new jsPDF();
            
            doc.setFontSize(18);
            doc.text("Reporte Financiero y de Asistencias", 14, 22);
            
            doc.setFontSize(12);
            doc.text(`Periodo: ${periodo === 'todo' ? 'Todo el tiempo' : periodo.replace('_', ' ')}`, 14, 30);
            doc.text(`Total Ingresos: $${Number(data.resumenFinanciero.totalIngresos || 0).toFixed(2)}`, 14, 38);
            doc.text(`Total Gastos: $${Number(data.resumenFinanciero.totalGastos || 0).toFixed(2)}`, 14, 46);
            doc.text(`Balance: $${Number(data.resumenFinanciero.balance || 0).toFixed(2)}`, 14, 54);

            let currentY = 64;

            // Clases Activas
            doc.setFontSize(14);
            doc.text("Clases Activas", 14, currentY);
            autoTable(doc, {
                startY: currentY + 4,
                head: [['Nombre', 'Dias', 'Inicio', 'Fin', 'Capacidad']],
                body: data.clasesActivas.map(c => [c.nombre, c.dias_semana, c.hora_inicio, c.hora_fin, c.capacidad_maxima]),
            });
            currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY) + 14;

            // Asistencias
            doc.text("Asistencias por Clase", 14, currentY);
            autoTable(doc, {
                startY: currentY + 4,
                head: [['Clase', 'Cantidad de Asistencias']],
                body: data.asistencias.map(a => [a.clase, a.cantidad]),
            });
            currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY) + 14;
            
            if (currentY > 250) { doc.addPage(); currentY = 20; }

            // Historial Pagos
            doc.text("Historial de Pagos (Ingresos)", 14, currentY);
            autoTable(doc, {
                startY: currentY + 4,
                head: [['ID', 'Cliente', 'Membresia', 'Monto', 'Fecha']],
                body: data.historialPagos.map(p => [p.id_pago, `${p.cliente_nombre} ${p.cliente_apellido}`, p.membresia, `$${p.monto_pagado}`, p.fecha_pago]),
            });
            currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY) + 14;

            if (currentY > 250) { doc.addPage(); currentY = 20; }

            // Historial Gastos
            doc.text("Historial de Gastos", 14, currentY);
            autoTable(doc, {
                startY: currentY + 4,
                head: [['ID', 'Concepto', 'Factura', 'Monto', 'Fecha']],
                body: data.historialGastos.map(g => [g.id_gasto, g.concepto, g.factura || 'N/A', `$${g.monto_pagado}`, g.fecha_pago]),
            });

            doc.save(`reporte_${periodo}.pdf`);

        } catch (error) {
            console.error("Error generando PDF:", error);
            alert("Hubo un error al generar el PDF.");
        }
    };

    return (
        <main className="main-content finanzas-layout">
            <header className="top-bar-simple">
                <div className="filter-container">
                    <span className="filter-label">Filtro</span>
                    <div className="filter-input-wrapper">
                        <select 
                            value={periodo} 
                            onChange={(e) => setPeriodo(e.target.value)}
                            className="period-select"
                            style={{ background: 'transparent', color: 'white', border: 'none', outline: 'none', padding: '5px', width: '100%' }}
                        >
                            <option value="todo" style={{ color: 'black' }}>Todo el tiempo</option>
                            <option value="esta_semana" style={{ color: 'black' }}>Esta semana</option>
                            <option value="este_mes" style={{ color: 'black' }}>Este mes</option>
                            <option value="este_ano" style={{ color: 'black' }}>Este año</option>
                        </select>
                    </div>
                </div>
                <NotificationBell />
            </header>

            <div className="dashboard-content">
                <div className="card gastos-card">
                    <h2 className="section-title" style={{color: '#000'}}>Resumen de gastos e ingresos</h2>
                    <div style={{color: '#000', marginBottom: '10px'}}>
                        <strong>Total Ingresos:</strong> ${Number(datos.totalIngresos || 0).toFixed(2)}
                    </div>
                    <div className="chart-wrapper" style={{ position: 'relative', height: '250px', width: '100%' }}>
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>

                <div className="right-column">
                    <div className="card asistencias-card">
                        <h2 className="section-title">Asistencias por clase</h2>
                        <div className="asistencias-list">
                            {datos.asistencias.map((item, index) => (
                                <div key={index} className="asistencia-row">
                                    <div className="asistencia-left">
                                        <i className={index === 0 ? "fas fa-star" : "far fa-star-circle"} style={{ color: index === 0 ? '#FFD700' : '#000' }}></i>
                                        <span style={{ color: '#000' }}>{item.clase}</span>
                                    </div>
                                    <div className="asistencia-right">
                                        <span style={{ color: '#000' }}>{item.cantidad}</span>
                                    </div>
                                </div>
                            ))}
                            {datos.asistencias.length === 0 && (
                                <div style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>No hay asistencias registradas.</div>
                            )}
                        </div>
                    </div>

                    <div className="action-buttons-container">
                        <button className="btn-reporte-pdf" onClick={handleGeneratePDF}>
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
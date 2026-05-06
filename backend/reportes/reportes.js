const express = require('express');
const router = express.Router();

// Helper para obtener la condición de fecha según el periodo
function getDateCondition(periodo, dateColumn) {
    switch (periodo) {
        case 'esta_semana':
            return `YEARWEEK(${dateColumn}, 1) = YEARWEEK(CURDATE(), 1)`;
        case 'este_mes':
            return `YEAR(${dateColumn}) = YEAR(CURDATE()) AND MONTH(${dateColumn}) = MONTH(CURDATE())`;
        case 'este_ano':
            return `YEAR(${dateColumn}) = YEAR(CURDATE())`;
        case 'todo':
        default:
            return '1=1'; // Sin filtro de fecha
    }
}

// Endpoint para el Dashboard (gráficas y resumen)
router.get('/dashboard', async (req, res) => {
    const { periodo = 'todo' } = req.query;
    
    try {
        const pool = req.pool.promise();
        
        const condicionGastos = getDateCondition(periodo, 'fecha_pago');
        const condicionAsistencias = getDateCondition(periodo, 'fecha_hora');
        const condicionIngresos = getDateCondition(periodo, 'fecha_pago');

        // 1. Resumen de gastos agrupado por concepto (para la gráfica)
        const [gastos] = await pool.query(`
            SELECT concepto, SUM(monto_pagado) as total 
            FROM Historial_gastos 
            WHERE ${condicionGastos} 
            GROUP BY concepto
        `);

        // 2. Total de ingresos
        const [ingresos] = await pool.query(`
            SELECT SUM(monto_pagado) as total 
            FROM Historial_pago 
            WHERE ${condicionIngresos}
        `);

        // 3. Asistencias por clase
        const [asistencias] = await pool.query(`
            SELECT c.nombre as clase, COUNT(a.id_asistencia) as cantidad 
            FROM Asistencia a 
            JOIN Clases c ON a.id_clase = c.id_clase 
            WHERE ${condicionAsistencias} 
            GROUP BY c.id_clase, c.nombre
            ORDER BY cantidad DESC
        `);

        res.json({
            gastos: gastos,
            totalIngresos: ingresos[0].total || 0,
            asistencias: asistencias
        });
    } catch (error) {
        console.error('Error al obtener datos del dashboard de reportes:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

// Endpoint para obtener todos los datos del PDF
router.get('/pdf-data', async (req, res) => {
    const { periodo = 'todo' } = req.query;
    
    try {
        const pool = req.pool.promise();
        
        const condicionGastos = getDateCondition(periodo, 'fecha_pago');
        const condicionAsistencias = getDateCondition(periodo, 'fecha_hora');
        const condicionIngresos = getDateCondition(periodo, 'fecha_pago');

        // 1. Clases activas
        const [clasesActivas] = await pool.query(`
            SELECT nombre, dias_semana, hora_inicio, hora_fin, capacidad_maxima 
            FROM Clases 
            WHERE activo = 1
        `);

        // 2. Historial de Pagos (Ingresos)
        const [historialPagos] = await pool.query(`
            SELECT p.id_pago, c.nombre as cliente_nombre, c.apellidoP as cliente_apellido, 
                   m.nombre as membresia, p.monto_pagado, DATE_FORMAT(p.fecha_pago, '%Y-%m-%d %H:%i:%s') as fecha_pago 
            FROM Historial_pago p 
            JOIN Cliente c ON p.id_cliente = c.id_cliente 
            JOIN Membresia m ON p.id_membresia = m.id_membresia 
            WHERE ${condicionIngresos}
            ORDER BY p.fecha_pago DESC
        `);

        // 3. Historial de Gastos
        const [historialGastos] = await pool.query(`
            SELECT id_gasto, concepto, factura, monto_pagado, DATE_FORMAT(fecha_pago, '%Y-%m-%d %H:%i:%s') as fecha_pago 
            FROM Historial_gastos 
            WHERE ${condicionGastos}
            ORDER BY fecha_pago DESC
        `);

        // 4. Asistencias detalladas
        const [asistencias] = await pool.query(`
            SELECT c.nombre as clase, COUNT(a.id_asistencia) as cantidad 
            FROM Asistencia a 
            JOIN Clases c ON a.id_clase = c.id_clase 
            WHERE ${condicionAsistencias} 
            GROUP BY c.id_clase, c.nombre
            ORDER BY cantidad DESC
        `);

        // Totales calculados
        const totalIngresos = historialPagos.reduce((sum, pago) => sum + pago.monto_pagado, 0);
        const totalGastos = historialGastos.reduce((sum, gasto) => sum + gasto.monto_pagado, 0);

        res.json({
            periodo,
            resumenFinanciero: {
                totalIngresos,
                totalGastos,
                balance: totalIngresos - totalGastos
            },
            clasesActivas,
            historialPagos,
            historialGastos,
            asistencias
        });
    } catch (error) {
        console.error('Error al obtener datos para PDF:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

module.exports = router;

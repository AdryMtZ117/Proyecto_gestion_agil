const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = req.pool.promise();
        
        // Buscar alumnos activos que tengan el pago vencido o que no tengan ningún pago registrado
        const query = `
            SELECT c.id_cliente, c.nombre, c.apellidoP, MAX(h.fecha_fin) as ultimo_vencimiento
            FROM Cliente c
            LEFT JOIN Historial_pago h ON c.id_cliente = h.id_cliente
            WHERE c.estado = 'activo'
            GROUP BY c.id_cliente, c.nombre, c.apellidoP
            HAVING ultimo_vencimiento < CURDATE() OR ultimo_vencimiento IS NULL
            ORDER BY ultimo_vencimiento ASC
        `;
        
        const [rows] = await pool.query(query);
        
        const notificaciones = rows.map(row => {
            if (!row.ultimo_vencimiento) {
                return {
                    id: `cliente_${row.id_cliente}_nopago`,
                    mensaje: `El alumno ${row.nombre} ${row.apellidoP} está activo pero no ha registrado su primer pago.`,
                    fecha: 'Atención requerida'
                };
            } else {
                // Formatear la fecha
                const fecha = new Date(row.ultimo_vencimiento);
                const fechaFormat = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                return {
                    id: `cliente_${row.id_cliente}_vencido`,
                    mensaje: `El pago del alumno ${row.nombre} ${row.apellidoP} venció el ${fechaFormat}.`,
                    fecha: fechaFormat
                };
            }
        });

        res.json(notificaciones);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

module.exports = router;

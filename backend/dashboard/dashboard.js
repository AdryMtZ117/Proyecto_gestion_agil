// dashboard/dashboard.js
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const pool = req.pool;
  const poolPromise = pool.promise();

  try {
    // --- Consultas simultáneas
    const [
      [alumnosActivosResult],
      [asistenciasHoyResult],
      [ingresosMesResult],
      [saldoPendienteResult],
      [ingresosGastosResult],
      [proximasClasesResult]
    ] = await Promise.all([

      //Alumnos activos
      poolPromise.query("SELECT COUNT(*) AS total FROM Cliente WHERE estado='activo'"),

      //Asistencias hoy
      poolPromise.query("SELECT COUNT(*) AS total FROM Asistencia WHERE DATE(fecha_hora)=CURDATE()"),

      //Ingresos del mes
      poolPromise.query(`
        SELECT IFNULL(SUM(monto_pagado),0) AS total
        FROM Historial_pago
        WHERE estado='pagado'
          AND MONTH(fecha_pago) = MONTH(CURDATE())  
          AND YEAR(fecha_pago) = YEAR(CURDATE())
      `),

      //Saldo pendiente
      poolPromise.query(`
        SELECT IFNULL(SUM(monto_pagado),0) AS total
        FROM Historial_pago
        WHERE estado='pendiente'
      `),

      //Ingresos/Gastos diarios del mes actual
      poolPromise.query(`
        WITH RECURSIVE dias AS (
          SELECT 1 AS dia
          UNION ALL
          SELECT dia + 1 FROM dias WHERE dia < DAY(LAST_DAY(CURDATE()))
        )
        SELECT 
          d.dia,
          IFNULL(p.ingresos,0) AS ingresos,
          IFNULL(g.gastos,0) AS gastos
        FROM dias d
        LEFT JOIN (
          SELECT DAY(fecha_pago) AS dia, SUM(monto_pagado) AS ingresos
          FROM Historial_pago
          WHERE estado='pagado'
            AND MONTH(fecha_pago)=MONTH(CURDATE())
            AND YEAR(fecha_pago)=YEAR(CURDATE())
          GROUP BY DAY(fecha_pago)
        ) p ON d.dia = p.dia
        LEFT JOIN (
          SELECT DAY(fecha_pago) AS dia, SUM(monto_pagado) AS gastos
          FROM Historial_gastos
          WHERE MONTH(fecha_pago)=MONTH(CURDATE())
            AND YEAR(fecha_pago)=YEAR(CURDATE())
          GROUP BY DAY(fecha_pago)
        ) g ON d.dia = g.dia
        ORDER BY d.dia
      `),

      //Próximas 5 clases
      poolPromise.query(`
        SELECT 
          nombre,
          DATE_FORMAT(horario, '%h:%i %p') AS hora
        FROM Clases
        WHERE activo=1
        ORDER BY horario ASC
        LIMIT 5
      `)
    ]);

    // --- Enviar JSON al front
    res.json({
      alumnosActivos: alumnosActivosResult[0].total,
      asistenciasHoy: asistenciasHoyResult[0].total,
      ingresosMes: ingresosMesResult[0].total,
      saldoPendiente: saldoPendienteResult[0].total,
      ingresosGastos: ingresosGastosResult,
      proximasClases: proximasClasesResult
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Error al obtener datos del dashboard',
      details: err.message
    });
  }
});

module.exports = router;
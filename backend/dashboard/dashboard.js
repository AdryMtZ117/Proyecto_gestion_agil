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
      [ingresosResult],
      [gastosResult],
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

      //Ingresos diarios del mes actual
      poolPromise.query(`
        SELECT DAY(fecha_pago) AS dia, SUM(monto_pagado) AS ingresos
        FROM Historial_pago
        WHERE estado='pagado'
          AND MONTH(fecha_pago)=MONTH(CURDATE())
          AND YEAR(fecha_pago)=YEAR(CURDATE())
        GROUP BY DAY(fecha_pago)
      `),

      //Gastos diarios del mes actual
      poolPromise.query(`
        SELECT DAY(fecha_pago) AS dia, SUM(monto_pagado) AS gastos
        FROM Historial_gastos
        WHERE MONTH(fecha_pago)=MONTH(CURDATE())
          AND YEAR(fecha_pago)=YEAR(CURDATE())
        GROUP BY DAY(fecha_pago)
      `),

      //Próximas 5 clases
      poolPromise.query(`
        SELECT 
          nombre,
          DATE_FORMAT(hora_inicio, '%h:%i %p') AS hora
        FROM Clases
        WHERE activo=1
        ORDER BY hora_inicio ASC
        LIMIT 5
      `)
    ]);

    // Procesar ingresos y gastos por día
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const diasEnMes = new Date(currentYear, currentMonth, 0).getDate();

    const ingresosGastosResult = [];
    for (let i = 1; i <= diasEnMes; i++) {
      const ingresoDia = ingresosResult.find(row => row.dia === i);
      const gastoDia = gastosResult.find(row => row.dia === i);
      ingresosGastosResult.push({
        dia: i,
        ingresos: ingresoDia ? ingresoDia.ingresos : 0,
        gastos: gastoDia ? gastoDia.gastos : 0
      });
    }

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
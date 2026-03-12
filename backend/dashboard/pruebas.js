const express = require('express');
const router = express.Router();
router.use(express.json());

let ultimoRegistro = {};

router.get('/insertar', async (req, res) => {
  const pool = req.pool;
  const poolPromise = pool.promise();

  try {
    const [maestro] = await poolPromise.query(
      `INSERT INTO Maestros (Nombre, apellidoP, apellidoM, telefono)
       VALUES (?, ?, ?, ?)`,
      ['Maestro', 'Test', 'Uno', '5551234567']
    );

    const [clase] = await poolPromise.query(
      `INSERT INTO Clases (nombre, horario, capacidad_maxima, nivel, id_maestro)
       VALUES (?, ?, ?, ?, ?)`,
      ['Yoga Test', '2026-03-15 10:00', 10, 'Básico', maestro.insertId]
    );

    const [membresia] = await poolPromise.query(
      `INSERT INTO Membresia (nombre, precio, tipo, duracion, id_clase)
       VALUES (?, ?, ?, ?, ?)`,
      ['Membresía Test', 100, 'Mensual', 30, clase.insertId]
    );

    const [cliente] = await poolPromise.query(
      `INSERT INTO Cliente (nombre, apellidoP, apellidoM, telefono, correo_electronico, id_membresia)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['Cliente', 'Test', 'Uno', '5559876543', 'cliente@test.com', membresia.insertId]
    );

    const [pago] = await poolPromise.query(
      `INSERT INTO Historial_pago (id_cliente, id_membresia, fecha_inicio, fecha_fin, estado, monto_pagado, id_empleado_registro)
       VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'pagado', 100, 1)`,
      [cliente.insertId, membresia.insertId]
    );

    ultimoRegistro = {
      maestroId: maestro.insertId,
      claseId: clase.insertId,
      membresiaId: membresia.insertId,
      clienteId: cliente.insertId,
      pagoId: pago.insertId
    };

    res.send(`
      <p>Datos de prueba insertados</p>
      <ul>
        <li>Maestro ID: ${maestro.insertId}</li>
        <li>Clase ID: ${clase.insertId}</li>
        <li>Membresía ID: ${membresia.insertId}</li>
        <li>Cliente ID: ${cliente.insertId}</li>
        <li>Pago ID: ${pago.insertId}</li>
      </ul>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send(`<p>Error insertando datos: ${err.message}</p>`);
  }
});

router.get('/borrar', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).send('<p>No permitido</p>');
  }

  const pool = req.pool;
  const poolPromise = pool.promise();

  try {
    // Desactivar llaves foraneas
    await poolPromise.query(`SET FOREIGN_KEY_CHECKS = 0`);

    //TRUNCATE
    await poolPromise.query(`TRUNCATE TABLE Historial_pago`);
    await poolPromise.query(`TRUNCATE TABLE Cliente`);
    await poolPromise.query(`TRUNCATE TABLE Membresia`);
    await poolPromise.query(`TRUNCATE TABLE Clases`);
    await poolPromise.query(`TRUNCATE TABLE Maestros`);

    //Reactivar llaves foráneas
    await poolPromise.query(`SET FOREIGN_KEY_CHECKS = 1`);

    ultimoRegistro = {};

    res.send(`<p>Base de datos reiniciada</p>`);
  } catch (err) {
    console.error(err);
    res.status(500).send(`<p>Error reiniciando tablas: ${err.message}</p>`);
  }
});

module.exports = router;
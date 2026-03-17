const express = require('express');
const router = express.Router();
router.use(express.json());

let ultimoRegistro = {};

// PRUEBAS UNITARIAS PARA AMBAS INTEGRACIONES DE ALUMNOS

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
      ['Karate Test', 'Lunes y Miércoles 18:00', 10, 'Básico', maestro.insertId]
    );
    const [membresia] = await poolPromise.query(
      `INSERT INTO Membresia (nombre, precio, tipo, duracion, id_clase)
       VALUES (?, ?, ?, ?, ?)`,
      ['Membresía Test', 100, 'Mensual', 30, clase.insertId]
    );
    const estados = ['Activo', 'Inactivo', 'Con deuda'];
    const alumnos = [];

    for (let i = 0; i < 3; i++) {
      const [alumno] = await poolPromise.query(
        `INSERT INTO Cliente (nombre, apellidoP, apellidoM, telefono, correo_electronico, id_membresia, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [`Alumno${i+1}`, 'Prueba', `${i+1}`, `55500000${i+1}`, `alumno${i+1}@test.com`, membresia.insertId, estados[i]]
      );

      await poolPromise.query(
        `INSERT INTO Historial_pago (id_cliente, id_membresia, fecha_inicio, fecha_fin, estado, monto_pagado, id_empleado_registro)
         VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), ?, 100, 1)`,
        [alumno.insertId, membresia.insertId, estados[i] === 'Con deuda' ? 'pendiente' : 'pagado']
      );

      await poolPromise.query(
        `INSERT INTO Asistencia (id_cliente, id_membresia, id_clase, fecha_hora, alerta_mostrada)
         VALUES (?, ?, ?, NOW(), 'ninguna')`,
        [alumno.insertId, membresia.insertId, clase.insertId]
      );

      alumnos.push({
        id: alumno.insertId,
        nombre: `Alumno${i+1} Prueba Uno`,
        email: `alumno${i+1}@test.com`,
        telefono: `55500000${i+1}`,
        disciplina: 'Karate Test',
        horarios: [clase.horario],
        estado: estados[i],
        membresia: membresia.nombre,
        precio_membresia: membresia.precio,
        fechaPago: new Date().toLocaleDateString('es-ES'),
        ultimoPago: new Date().toLocaleDateString('es-ES'),
        historialPagos: [{
          fechaInicio: new Date().toLocaleDateString('es-ES'),
          fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('es-ES'),
          monto: 100,
          fechaPago: new Date().toLocaleDateString('es-ES'),
          estado: estados[i] === 'Con deuda' ? 'pendiente' : 'pagado'
        }],
        asistencia: [{
          fecha: new Date().toLocaleDateString('es-ES'),
          clase: 'Karate Test'
        }],
        fotoPerfil: `https://i.pravatar.cc/150?img=${alumno.insertId}`
      });
    }

    ultimoRegistro = { maestroId: maestro.insertId, claseId: clase.insertId, membresiaId: membresia.insertId, alumnos };
    res.json({ message: 'Alumnos de prueba insertados', alumnos: ultimoRegistro.alumnos });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error insertando datos de prueba', error: err.message });
  }
});

router.get('/borrar', async (req, res) => {
  const pool = req.pool;
  const poolPromise = pool.promise();

  try {
    await poolPromise.query(`SET FOREIGN_KEY_CHECKS = 0`);
    await poolPromise.query(`TRUNCATE TABLE Asistencia`);
    await poolPromise.query(`TRUNCATE TABLE Historial_pago`);
    await poolPromise.query(`TRUNCATE TABLE Cliente`);
    await poolPromise.query(`TRUNCATE TABLE Membresia`);
    await poolPromise.query(`TRUNCATE TABLE Clases`);
    await poolPromise.query(`TRUNCATE TABLE Maestros`);
    await poolPromise.query(`SET FOREIGN_KEY_CHECKS = 1`);

    ultimoRegistro = {};
    res.json({ message: 'Base de datos reiniciada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error reiniciando tablas', error: err.message });
  }
});

module.exports = router;
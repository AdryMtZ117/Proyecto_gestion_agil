const express = require('express');
const router = express.Router();

//BACK PARA LA TABLA DE ALUMNOS 
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.pool.promise().query(`
      SELECT 
        c.id_cliente,
        c.nombre, c.apellidoP, c.apellidoM,
        c.telefono,
        c.correo_electronico,
        c.estado,
        cl.nombre AS disciplina,
        cl.dias_semana,
        cl.hora_inicio,
        cl.hora_fin,
        MAX(h.fecha_pago) AS fechaPago
      FROM Cliente c
      LEFT JOIN Membresia me ON c.id_membresia = me.id_membresia
      LEFT JOIN Clases cl ON me.id_clase = cl.id_clase
      LEFT JOIN Historial_pago h ON h.id_cliente = c.id_cliente
      GROUP BY c.id_cliente, c.nombre, c.apellidoP, c.apellidoM, c.telefono, c.correo_electronico, c.estado, cl.nombre, cl.dias_semana, cl.hora_inicio, cl.hora_fin
      ORDER BY c.nombre
    `);
    const alumnos = rows.map(row => ({
      id: row.id_cliente,
      nombre: `${row.nombre} ${row.apellidoP} ${row.apellidoM || ''}`.trim(),
      nombre_real: row.nombre,
      apellidoP: row.apellidoP,
      apellidoM: row.apellidoM,
      correo_electronico: row.correo_electronico,
      telefono: row.telefono,
      disciplina: row.disciplina || 'No asignada',
      horarios: (row.dias_semana && row.hora_inicio) ? [`${row.dias_semana} (${row.hora_inicio} - ${row.hora_fin})`] : [],
      estado: row.estado,
      fechaPago: row.fechaPago ? new Date(row.fechaPago).toLocaleDateString('es-ES') : 'Sin pago',
      fotoPerfil: `https://i.pravatar.cc/150?img=${row.id_cliente}`
    }));

    const nombres = [...new Set(alumnos.map(a => a.nombre))];
    const disciplinas = [...new Set(alumnos.map(a => a.disciplina))];
    const estatus = ['Activo', 'Inactivo', 'Con deuda'];

    res.json({ alumnos, filtros: { nombres, disciplinas, estatus } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener alumnos', error: err.message });
  }
});

//BACK PARA EL PERFIL COMPLETO DEL ALUMNO NOTA: FALTA CORREGIR FRONT
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await req.pool.promise().query(`
      SELECT 
        c.*,
        cl.nombre AS disciplina,
        cl.dias_semana,
        cl.hora_inicio,
        cl.hora_fin,
        me.nombre AS membresia,
        me.precio AS precio_membresia,
        (SELECT MAX(h.fecha_pago) FROM Historial_pago h WHERE h.id_cliente = c.id_cliente) AS ultimoPago
      FROM Cliente c
      LEFT JOIN Membresia me ON c.id_membresia = me.id_membresia
      LEFT JOIN Clases cl ON me.id_clase = cl.id_clase
      WHERE c.id_cliente = ?
    `, [id]);

    if (!rows.length) return res.status(404).json({ message: 'Alumno no encontrado' });

    const alumno = rows[0];

    const [pagos] = await req.pool.promise().query(`
      SELECT fecha_inicio, fecha_fin, monto_pagado, fecha_pago, estado
      FROM Historial_pago
      WHERE id_cliente = ?
      ORDER BY fecha_pago DESC
    `, [id]);

    const [asistencias] = await req.pool.promise().query(`
      SELECT a.fecha_hora, cl.nombre AS clase_nombre
      FROM Asistencia a
      LEFT JOIN Clases cl ON a.id_clase = cl.id_clase
      WHERE a.id_cliente = ?
      ORDER BY a.fecha_hora DESC
    `, [id]);

    res.json({
      id: alumno.id_cliente,
      nombre: `${alumno.nombre} ${alumno.apellidoP} ${alumno.apellidoM || ''}`.trim(),
      email: alumno.correo_electronico,
      telefono: alumno.telefono,
      estado: alumno.estado,
      disciplina: alumno.disciplina || 'No asignada',
      horarios: (alumno.dias_semana && alumno.hora_inicio) ? [`${alumno.dias_semana} (${alumno.hora_inicio} - ${alumno.hora_fin})`] : [],
      membresia: alumno.membresia,
      precio_membresia: alumno.precio_membresia,
      ultimoPago: alumno.ultimoPago ? new Date(alumno.ultimoPago).toLocaleDateString('es-ES') : 'Sin pago',
      historialPagos: pagos.map(p => ({
        fechaInicio: new Date(p.fecha_inicio).toLocaleDateString('es-ES'),
        fechaFin: new Date(p.fecha_fin).toLocaleDateString('es-ES'),
        monto: p.monto_pagado,
        fechaPago: p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString('es-ES') : 'Pendiente',
        estado: p.estado
      })),
      asistencia: asistencias.map(a => ({
        fecha: new Date(a.fecha_hora).toLocaleDateString('es-ES'),
        clase: a.clase_nombre
      })),
      fotoPerfil: `https://i.pravatar.cc/150?img=${alumno.id_cliente}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener perfil del alumno', error: err.message });
  }
});

// CREAR NUEVO ALUMNO
router.post('/', async (req, res) => {
  const { nombre, apellidoP, apellidoM, telefono, correo_electronico, estado } = req.body;
  try {
    const [result] = await req.pool.promise().query(
      'INSERT INTO Cliente (nombre, apellidoP, apellidoM, telefono, correo_electronico, estado) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellidoP, apellidoM || null, telefono, correo_electronico, estado || 'activo']
    );
    res.status(201).json({ message: 'Alumno creado correctamente', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear alumno', error: err.message });
  }
});

// ACTUALIZAR ALUMNO EXISTENTE
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { nombre, apellidoP, apellidoM, telefono, correo_electronico, estado } = req.body;
  try {
    const [result] = await req.pool.promise().query(
      'UPDATE Cliente SET nombre = ?, apellidoP = ?, apellidoM = ?, telefono = ?, correo_electronico = ?, estado = ? WHERE id_cliente = ?',
      [nombre, apellidoP, apellidoM || null, telefono, correo_electronico, estado || 'activo', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    
    res.json({ message: 'Alumno actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar alumno', error: err.message });
  }
});

// ELIMINAR ALUMNO
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const connection = await req.pool.promise().getConnection();
  
  try {
    await connection.beginTransaction();

    // Eliminar asistencias vinculadas
    await connection.query('DELETE FROM Asistencia WHERE id_cliente = ?', [id]);
    
    // Eliminar historial de pagos vinculado
    await connection.query('DELETE FROM Historial_pago WHERE id_cliente = ?', [id]);
    
    // Eliminar al cliente
    const [result] = await connection.query('DELETE FROM Cliente WHERE id_cliente = ?', [id]);

    await connection.commit();
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    res.json({ message: 'Alumno eliminado exitosamente junto con sus registros dependientes' });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar alumno', error: err.message });
  }
});

module.exports = router;
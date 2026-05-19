const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = 'uploads/alumnos/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const { nombre = '', apellidoP = '', apellidoM = '' } = req.body;
    const nombreCompleto = `${nombre}_${apellidoP}_${apellidoM}`.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    cb(null, `${nombreCompleto}${ext}`);
  }
});

const upload = multer({ storage });

const MEMBRESIAS_FIJAS = [
  { id_membresia: 1, nombre: 'Mensual', precio: 400, descripcion: 'Acceso completo por 1 mes' },
  { id_membresia: 2, nombre: 'Trimestral', precio: 1050, descripcion: 'Acceso completo por 3 meses' },
  { id_membresia: 3, nombre: 'Anual', precio: 3600, descripcion: 'Acceso completo por 12 meses' },
];

router.get('/clases', async (req, res) => {
  try {
    const [rows] = await req.pool.promise().query('SELECT id_clase, nombre, dias_semana, hora_inicio, hora_fin FROM Clases WHERE activo = 1');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener clases', error: err.message });
  }
});

router.get('/membresias', (_req, res) => {
  res.json({ membresias: MEMBRESIAS_FIJAS });
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await req.pool.promise().query(`
      SELECT
        c.id_cliente,
        c.nombre,
        c.apellidoP,
        c.apellidoM,
        c.telefono,
        c.correo_electronico,
        c.estado,
        cl.id_clase,
        c.id_membresia,
        c.foto_path,
        me.nombre AS membresia_nombre,

        cl.nombre AS disciplina,
        cl.dias_semana,
        cl.hora_inicio,
        cl.hora_fin,
        MAX(h.fecha_pago) AS fechaPago
      FROM Cliente c
      LEFT JOIN Membresia me ON c.id_membresia = me.id_membresia
      LEFT JOIN Clases cl ON me.id_clase = cl.id_clase
      LEFT JOIN Historial_pago h ON h.id_cliente = c.id_cliente
      GROUP BY c.id_cliente, c.nombre, c.apellidoP, c.apellidoM, c.telefono, c.correo_electronico, c.estado, cl.id_clase, c.id_membresia, c.foto_path, me.nombre, cl.nombre, cl.dias_semana, cl.hora_inicio, cl.hora_fin

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
      id_clase: row.id_clase || '',
      disciplina: row.disciplina || 'No asignada',
      id_membresia: row.id_membresia || '',
      membresia_nombre: row.membresia_nombre || 'Sin membresia',
      horarios:
        (row.dias_semana && row.hora_inicio)
          ? [`${row.dias_semana} (${row.hora_inicio} - ${row.hora_fin})`]
          : [],
      estado: row.estado,
      fechaPago:
        row.fechaPago
          ? new Date(row.fechaPago).toLocaleDateString('es-ES')
          : 'Sin pago',
      foto_path:
        row.foto_path
          ? `http://localhost:3000/uploads/alumnos/${row.foto_path}`
          : null,
    }));

    const nombres = [...new Set(alumnos.map(a => a.nombre))];
    const disciplinas = [...new Set(alumnos.map(a => a.disciplina))];
    const estatus = ['activo', 'inactivo', 'con deuda'];

    res.json({
      alumnos,
      filtros: {
        nombres,
        disciplinas,
        estatus
      }
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Error al obtener alumnos',
      error: err.message
    });
  }
});

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
        me.id_membresia,
        me.nombre AS membresia,
        me.precio AS precio_membresia,
        (
          SELECT MAX(h.fecha_pago)
          FROM Historial_pago h
          WHERE h.id_cliente = c.id_cliente
        ) AS ultimoPago
      FROM Cliente c
      LEFT JOIN Membresia me
        ON c.id_membresia = me.id_membresia
      LEFT JOIN Clases cl
        ON me.id_clase = cl.id_clase
      WHERE c.id_cliente = ?
    `, [id]);

    if (!rows.length) {
      return res.status(404).json({
        message: 'Alumno no encontrado'
      });
    }

    const alumno = rows[0];

    const [pagos] = await req.pool.promise().query(`
      SELECT
        fecha_inicio,
        fecha_fin,
        monto_pagado,
        fecha_pago,
        estado
      FROM Historial_pago
      WHERE id_cliente = ?
      ORDER BY fecha_pago DESC
    `, [id]);

    const [asistencias] = await req.pool.promise().query(`
      SELECT
        a.fecha_hora,
        cl.nombre AS clase_nombre
      FROM Asistencia a
      LEFT JOIN Clases cl
        ON a.id_clase = cl.id_clase
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
      id_membresia: alumno.id_membresia || '',
      membresia: alumno.membresia || 'Sin membresia',
      horarios:
        (alumno.dias_semana && alumno.hora_inicio)
          ? [`${alumno.dias_semana} (${alumno.hora_inicio} - ${alumno.hora_fin})`]
          : [],
      precio_membresia: alumno.precio_membresia,
      ultimoPago:
        alumno.ultimoPago
          ? new Date(alumno.ultimoPago).toLocaleDateString('es-ES')
          : 'Sin pago',
      foto_path:
        alumno.foto_path
          ? `http://localhost:3000/uploads/alumnos/${alumno.foto_path}`
          : null,
      historialPagos: pagos.map(p => ({
        fechaInicio: new Date(p.fecha_inicio).toLocaleDateString('es-ES'),
        fechaFin: new Date(p.fecha_fin).toLocaleDateString('es-ES'),
        monto: p.monto_pagado,
        fechaPago:
          p.fecha_pago
            ? new Date(p.fecha_pago).toLocaleDateString('es-ES')
            : 'Pendiente',
        estado: p.estado,
      })),
      asistencia: asistencias.map(a => ({
        fecha: new Date(a.fecha_hora).toLocaleDateString('es-ES'),
        clase: a.clase_nombre,
      })),
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Error al obtener perfil del alumno',
      error: err.message
    });
  }
});

router.post('/', upload.single('foto'), async (req, res) => {
  const { nombre, apellidoP, apellidoM, telefono, correo_electronico, estado, id_clase, id_membresia } = req.body;
  const foto_path = req.file ? req.file.filename : null;
  const connection = await req.pool.promise().getConnection();
  try {
    await connection.beginTransaction();

    let final_id_membresia = id_membresia || null;
    
    if (id_clase && !final_id_membresia) {
      const [membresias] = await connection.query('SELECT id_membresia FROM Membresia WHERE id_clase = ? LIMIT 1', [id_clase]);
      if (membresias.length > 0) {
        final_id_membresia = membresias[0].id_membresia;
      } else {
        const [resMem] = await connection.query(
          'INSERT INTO Membresia (nombre, precio, tipo, duracion, id_clase) VALUES (?, ?, ?, ?, ?)',
          ['Membresia Básica', 0, 'Mensual', 1, id_clase]
        );
        final_id_membresia = resMem.insertId;
      }
    }

    const [result] = await connection.query(
      'INSERT INTO Cliente (nombre, apellidoP, apellidoM, telefono, correo_electronico, estado, id_membresia, foto_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellidoP, apellidoM || null, telefono, correo_electronico, estado || 'activo', final_id_membresia, foto_path]
    );

    await connection.commit();
    res.status(201).json({ message: 'Alumno creado correctamente', id: result.insertId });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error al crear alumno', error: err.message });
  } finally {
    connection.release();
  }
});

router.put('/:id', upload.single('foto'), async (req, res) => {
  const id = req.params.id;
  const { nombre, apellidoP, apellidoM, telefono, correo_electronico, estado, id_clase, id_membresia } = req.body;
  const connection = await req.pool.promise().getConnection();
  try {
    await connection.beginTransaction();

    let final_id_membresia = id_membresia || null;
    
    if (id_clase && !final_id_membresia) {
      const [membresias] = await connection.query('SELECT id_membresia FROM Membresia WHERE id_clase = ? LIMIT 1', [id_clase]);
      if (membresias.length > 0) {
        final_id_membresia = membresias[0].id_membresia;
      } else {
        const [resMem] = await connection.query(
          'INSERT INTO Membresia (nombre, precio, tipo, duracion, id_clase) VALUES (?, ?, ?, ?, ?)',
          ['Membresia Básica', 0, 'Mensual', 1, id_clase]
        );
        final_id_membresia = resMem.insertId;
      }
    }

    let query;
    let params;

    if (req.file) {
      query = 'UPDATE Cliente SET nombre = ?, apellidoP = ?, apellidoM = ?, telefono = ?, correo_electronico = ?, estado = ?, id_membresia = ?, foto_path = ? WHERE id_cliente = ?';
      params = [nombre, apellidoP, apellidoM || null, telefono, correo_electronico, estado || 'activo', final_id_membresia, req.file.filename, id];
    } else {
      query = 'UPDATE Cliente SET nombre = ?, apellidoP = ?, apellidoM = ?, telefono = ?, correo_electronico = ?, estado = ?, id_membresia = ? WHERE id_cliente = ?';
      params = [nombre, apellidoP, apellidoM || null, telefono, correo_electronico, estado || 'activo', final_id_membresia, id];
    }

    const [result] = await connection.query(query, params);
    await connection.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    res.json({ message: 'Alumno actualizado correctamente' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar alumno', error: err.message });
  } finally {
    connection.release();
  }
});




router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  const connection = await req.pool.promise().getConnection();

  try {
    await connection.beginTransaction();

    const [fotoRows] = await connection.query(
      `
      SELECT foto_path
      FROM Cliente
      WHERE id_cliente = ?
      `,
      [id]
    );

    if (fotoRows.length && fotoRows[0].foto_path) {
      const rutaFoto = path.join('uploads/alumnos', fotoRows[0].foto_path);

      if (fs.existsSync(rutaFoto)) {
        fs.unlinkSync(rutaFoto);
      }
    }

    await connection.query(
      'DELETE FROM Asistencia WHERE id_cliente = ?',
      [id]
    );

    await connection.query(
      'DELETE FROM Historial_pago WHERE id_cliente = ?',
      [id]
    );

    const [result] = await connection.query(
      'DELETE FROM Cliente WHERE id_cliente = ?',
      [id]
    );

    await connection.commit();
    connection.release();


    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Alumno no encontrado'
      });
    }

    res.json({
      message: 'Alumno eliminado exitosamente'
    });

  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar alumno', error: err.message });
  }
});

module.exports = router;
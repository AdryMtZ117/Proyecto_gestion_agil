const express = require('express');
const router = express.Router();

// GET /api/clases
// Opcional: ?diaSemana=... para filtrar
router.get('/', async (req, res) => {
  try {
    const { diaSemana, fecha } = req.query;
    let query = `
      SELECT c.*, m.Nombre AS maestro_nombre, m.apellidoP AS maestro_apellido
      FROM Clases c
      LEFT JOIN Maestros m ON c.id_maestro = m.id_maestro
      WHERE c.activo = 1
    `;
    const params = [];
    if (diaSemana) {
      query += ` AND c.dias_semana LIKE ?`;
      params.push(`%${diaSemana}%`);
    }
    if (fecha) {
      query += ` AND (c.fecha_inicio IS NULL OR c.fecha_inicio <= ?) AND (c.fecha_fin IS NULL OR c.fecha_fin >= ?)`;
      params.push(fecha, fecha);
    }

    const [rows] = await req.pool.promise().query(query, params);
    
    // Convert to nice format
    const clases = rows.map(r => ({
      id: r.id_clase,
      nombre: r.nombre,
      dias: r.dias_semana,
      horaInicio: r.hora_inicio,
      horaFin: r.hora_fin,
      capacidad: r.capacidad_maxima,
      nivel: r.nivel,
      maestro: `${r.maestro_nombre || ''} ${r.maestro_apellido || ''}`.trim() || 'Sin asignar'
    }));
    res.json(clases);
  } catch(err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error retrieving clases' });
  }
});

// GET /api/clases/:id/alumnos
router.get('/:id/alumnos', async (req, res) => {
  try {
    const [rows] = await req.pool.promise().query(`
      SELECT c.id_cliente, c.nombre, c.apellidoP, c.estado 
      FROM Cliente c
      INNER JOIN Membresia m ON c.id_membresia = m.id_membresia
      WHERE m.id_clase = ?
    `, [req.params.id]);
    
    const alumnos = rows.map(r => ({
      id: r.id_cliente,
      nombre: `${r.nombre} ${r.apellidoP}`.trim(),
      estado: r.estado,
      foto: `https://i.pravatar.cc/150?img=${r.id_cliente}`
    }));
    res.json(alumnos);
  } catch(err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error retrieving alumnos' });
  }
});

// POST /api/clases
router.post('/', async (req, res) => {
  const { nombre, dias_semana, hora_inicio, hora_fin, fecha_inicio, fecha_fin, capacidad_maxima, nivel, id_maestro } = req.body;
  const connection = await req.pool.promise().getConnection();
  try {
    // Verificar maestro
    if (id_maestro) {
      const [maestros] = await connection.query(`SELECT id_maestro FROM Maestros WHERE id_maestro = ?`, [id_maestro]);
      if (!maestros.length) {
        connection.release();
        return res.status(400).json({ status: 'error', message: 'El id_maestro proporcionado no existe en la base de datos.' });
      }
    }

    // Verificar colisiones de hora.
    // SQL time overlaps: (A.start < B.end AND A.end > B.start)
    if (hora_inicio && hora_fin && dias_semana) {
       const diasArr = dias_semana.split(',').map(d => d.trim().toLowerCase());
       
       const [existing] = await connection.query(`SELECT id_clase, dias_semana, hora_inicio, hora_fin FROM Clases WHERE activo=1`);
       for (const ext of existing) {
         if (!ext.dias_semana) continue;
         const extDias = ext.dias_semana.split(',').map(d => d.trim().toLowerCase());
         
         const commonDays = diasArr.filter(d => extDias.includes(d));
         if (commonDays.length > 0) {
            // Check time overlap
            const newStart = hora_inicio;
            const newEnd = hora_fin;
            if (newStart < ext.hora_fin && newEnd > ext.hora_inicio) {
               connection.release();
               return res.status(400).json({ status: 'error', message: `Colisión detectada con la clase ID ${ext.id_clase} en el horario: ${ext.dias_semana} (${ext.hora_inicio} - ${ext.hora_fin}).`});
            }
         }
       }
    }

    const [result] = await connection.query(`
      INSERT INTO Clases (nombre, dias_semana, hora_inicio, hora_fin, fecha_inicio, fecha_fin, capacidad_maxima, nivel, id_maestro)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [nombre, dias_semana, hora_inicio, hora_fin, fecha_inicio || null, fecha_fin || null, capacidad_maxima, nivel, id_maestro || null]);

    connection.release();
    res.json({ status: 'success', id: result.insertId });
  } catch(err) {
    if (connection) connection.release();
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error al registrar la clase' });
  }
});

module.exports = router;

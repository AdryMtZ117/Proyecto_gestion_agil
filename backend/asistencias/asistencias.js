const express = require('express');
const router = express.Router();

// POST /api/asistencias/scan
router.post('/scan', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ status: 'error', message: '¡ERROR NO SE HA ENCONTRADO EL USUARIO []!' });
  }

  try {
    // Buscar estudiante por id_cliente, uid_huella o nombre parecido
    const [rows] = await req.pool.promise().query(`
      SELECT 
        c.id_cliente,
        c.nombre, 
        c.apellidoP, 
        c.estado,
        c.id_membresia,
        cl.id_clase,
        cl.nombre AS disciplina,
        cl.dias_semana
      FROM Cliente c
      LEFT JOIN Membresia me ON c.id_membresia = me.id_membresia
      LEFT JOIN Clases cl ON me.id_clase = cl.id_clase
      WHERE CAST(c.id_cliente AS CHAR) = ? OR c.uid_huella = ? OR c.nombre LIKE ?
      LIMIT 1
    `, [query, query, `%${query}%`]);

    if (!rows.length) {
      return res.status(404).json({
        status: 'error',
        message: `¡ERROR NO SE HA ENCONTRADO EL USUARIO [${query.toUpperCase()}]!`
      });
    }

    const cliente = rows[0];
    const nombreCompleto = `${cliente.nombre} ${cliente.apellidoP}`.trim();

    if (!cliente.id_clase || !cliente.dias_semana) {
      return res.json({
        status: 'error',
        message: `¡ACCESO DENEGADO! EL ALUMNO NO TIENE NINGUNA CLASE ASIGNADA.`,
        photoUrl: `https://i.pravatar.cc/150?img=${cliente.id_cliente}`
      });
    }

    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoyTxt = diasSemana[new Date().getDay()];

    const normalizeStr = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    const diasClaseArr = cliente.dias_semana.split(',').map(d => normalizeStr(d.trim()));
    const hoyNormalizado = normalizeStr(hoyTxt);

    if (!diasClaseArr.includes(hoyNormalizado)) {
      return res.json({
        status: 'error',
        message: `¡ACCESO DENEGADO! LA CLASE DEL ALUMNO NO ES HOY (${hoyTxt.toUpperCase()}).`,
        photoUrl: `https://i.pravatar.cc/150?img=${cliente.id_cliente}`
      });
    }

    // Determinar el mensaje y status dependiendo del estado
    let resultStatus = 'error';
    let message = '';

    const estadoMinuscula = cliente.estado ? cliente.estado.toLowerCase() : '';
    if (estadoMinuscula === 'activo') {
      resultStatus = 'success';
      message = nombreCompleto;
    } else if (estadoMinuscula === 'con deuda') {
      resultStatus = 'warning';
      message = nombreCompleto;
    } else {
      resultStatus = 'error';
      message = `¡ERROR NO SE HA ENCONTRADO EL USUARIO [${query.toUpperCase()}]! (Estado: ${cliente.estado})`;
    }

    // Registrar la asistencia si está activo o con deuda?
    // Asumamos que de momento solo devolvemos la info a la pantalla
    // Si quisieramos registrar en la tabla Asistencia:
    // await req.pool.promise().query('INSERT INTO Asistencia (id_cliente, ...) VALUES (...)')

    res.json({
      status: resultStatus,
      message,
      student: {
        id_cliente: cliente.id_cliente,
        id_membresia: cliente.id_membresia,
        id_clase: cliente.id_clase,
        nombre: nombreCompleto,
        estado: cliente.estado,
        clase: cliente.disciplina || 'No asignada'
      },
      photoUrl: `https://i.pravatar.cc/150?img=${cliente.id_cliente}`
    });

  } catch (err) {
    console.error('Error al escanear asistencia:', err);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
  }
});

// POST /api/asistencias/register
router.post('/register', async (req, res) => {
  const { id_cliente, id_membresia, id_clase } = req.body;

  if (!id_cliente || !id_membresia || !id_clase) {
    return res.status(400).json({ status: 'error', message: 'Faltan datos para registrar asistencia.' });
  }

  try {
    await req.pool.promise().query(
      'INSERT INTO Asistencia (id_cliente, id_membresia, id_clase) VALUES (?, ?, ?)',
      [id_cliente, id_membresia, id_clase]
    );
    res.json({ status: 'success', message: '¡Asistencia registrada exitosamente!' });
  } catch (err) {
    console.error('Error al registrar asistencia:', err);
    res.status(500).json({ status: 'error', message: 'Error interno al registrar la asistencia.' });
  }
});

module.exports = router;

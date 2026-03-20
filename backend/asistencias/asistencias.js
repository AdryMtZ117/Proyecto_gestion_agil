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
        cl.nombre AS disciplina
      FROM Cliente c
      LEFT JOIN Membresia me ON c.id_membresia = me.id_membresia
      LEFT JOIN Clases cl ON me.id_clase = cl.id_clase
      WHERE c.id_cliente = ? OR c.uid_huella = ? OR c.nombre LIKE ?
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

    // Determinar el mensaje y status dependiendo del estado
    let resultStatus = 'error';
    let message = '';

    if (cliente.estado === 'Activo') {
      resultStatus = 'success';
      message = '¡BIENVENIDO A CORAZÓN DE PIEDRA!';
    } else if (cliente.estado === 'Con deuda') {
      resultStatus = 'warning';
      message = '¡ALERTA EL USUARIO TIENE UN PAGO VENCIDO!';
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

module.exports = router;

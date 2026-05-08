const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/tickets';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ================= REGISTRAR GASTO =================
router.post('/registrar-gasto', upload.single('ticket'), async (req, res) => {
  try {
    const pool = req.pool.promise();

    const { concepto, monto_pagado, id_empleado } = req.body;

    if (!concepto || !monto_pagado) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const factura = req.file
      ? `/uploads/tickets/${req.file.filename}`
      : null;

    const [result] = await pool.query(
      `INSERT INTO Historial_gastos 
      (concepto, monto_pagado, factura, id_empleado_registro)
      VALUES (?, ?, ?, ?)`,
      [concepto, monto_pagado, factura, id_empleado || 1]
    );

    return res.json({
      success: true,
      id: result.insertId
    });

  } catch (err) {
    console.error("ERROR BACK:", err);
    return res.status(500).json({
      error: err.message
    });
  }
});

// ================= LISTAR =================
router.get('/listar-gastos', async (req, res) => {
  try {
    const pool = req.pool.promise();

    const [rows] = await pool.query(
      `SELECT 
        id_gasto,
        concepto,
        monto_pagado,
        DATE_FORMAT(fecha_pago, '%Y-%m-%d') AS fecha,
        factura
       FROM Historial_gastos
       ORDER BY fecha_pago DESC`
    );

    return res.json(rows);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ================= BUSCAR =================
router.get('/buscar-gastos', async (req, res) => {
  try {
    const pool = req.pool.promise();
    const q = req.query.q || "";

    const [rows] = await pool.query(
      `SELECT id_gasto, concepto, monto_pagado,
       DATE_FORMAT(fecha_pago, '%Y-%m-%d') AS fecha,
       factura
       FROM Historial_gastos
       WHERE concepto LIKE ?
       ORDER BY fecha_pago DESC`,
      [`%${q}%`]
    );

    return res.json(rows);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ================= FILTRAR =================
router.get('/filtrar-gastos', async (req, res) => {
  try {
    const pool = req.pool.promise();
    const { fecha } = req.query;

    const [rows] = await pool.query(
      `SELECT id_gasto, concepto, monto_pagado,
       DATE_FORMAT(fecha_pago, '%Y-%m-%d') AS fecha,
       factura
       FROM Historial_gastos
       WHERE DATE(fecha_pago) = ?`,
      [fecha]
    );

    return res.json(rows);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
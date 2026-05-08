const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// 1. BUSCAR ALUMNO
router.get('/buscar-alumno', async (req, res) => {
    const poolPromise = req.pool.promise();
    const query = req.query.q;
    try {
        const [rows] = await poolPromise.query(
            "SELECT id_cliente, nombre, apellidoP, foto_path, id_membresia FROM Cliente WHERE nombre LIKE ? OR telefono LIKE ?",
            [`%${query}%`, `%${query}%`]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. LISTAR PAGOS (con foto_path y orden DESC - más nuevo primero)
router.get('/listar-pagos', async (req, res) => {
    const poolPromise = req.pool.promise();
    try {
        const [rows] = await poolPromise.query(
            `SELECT 
                hp.id_pago AS folio, 
                c.nombre,
                c.apellidoP,
                c.foto_path,
                m.nombre AS concepto, 
                hp.monto_pagado AS monto, 
                hp.metodo_pago AS metodo,
                hp.fecha_pago,
                hp.referencia
             FROM Historial_pago hp
             JOIN Cliente c ON hp.id_cliente = c.id_cliente
             JOIN Membresia m ON hp.id_membresia = m.id_membresia
             ORDER BY hp.id_pago DESC`  // Cambiado a DESC para ver los más nuevos primero
        );
        res.json(rows);
    } catch (err) {
        console.error("Error en listar-pagos:", err);
        res.status(500).json({ error: err.message });
    }
});

// 3. REGISTRAR PAGO
router.post('/registrar-pago', async (req, res) => {
    const poolPromise = req.pool.promise();
    const { id_cliente, id_empleado, concepto, monto_pagado, metodo_pago, referencia } = req.body;

    // Validaciones básicas
    if (!id_cliente) {
        return res.status(400).json({ error: "ID de cliente requerido" });
    }
    if (!monto_pagado || monto_pagado <= 0) {
        return res.status(400).json({ error: "Monto válido requerido" });
    }
    if (!metodo_pago) {
        return res.status(400).json({ error: "Método de pago requerido" });
    }

    try {
        // 1. Obtener la membresía del cliente
        const [cli] = await poolPromise.query(
            "SELECT id_membresia FROM Cliente WHERE id_cliente = ?", 
            [id_cliente]
        );
        
        if (!cli || cli.length === 0) {
            return res.status(400).json({ error: "Cliente no encontrado" });
        }
        
        const id_membresia = cli[0]?.id_membresia;
        
        if (!id_membresia) {
            return res.status(400).json({ error: "El alumno no tiene una membresía asignada" });
        }

        // 2. Calcular fechas
        const fecha_inicio = new Date();
        const fecha_fin = new Date();
        fecha_fin.setMonth(fecha_fin.getMonth() + 1);

        // 3. Verificar si id_empleado existe, si no usar 1 por defecto
        let empleadoId = id_empleado || 1;
        
        // 4. Insertar el pago
        const [result] = await poolPromise.query(
            `INSERT INTO Historial_pago 
            (id_cliente, id_membresia, fecha_inicio, fecha_fin, estado, monto_pagado, id_empleado_registro, metodo_pago, referencia, fecha_pago)
            VALUES (?, ?, ?, ?, 'pagado', ?, ?, ?, ?, NOW())`,
            [id_cliente, id_membresia, fecha_inicio, fecha_fin, monto_pagado, empleadoId, metodo_pago, referencia || null]
        );

        console.log(`Pago registrado exitosamente. ID: ${result.insertId}`);
        
        res.status(201).json({ 
            success: true, 
            message: 'Pago registrado correctamente',
            folio: result.insertId 
        });
        
    } catch (err) {
        console.error("Error al registrar pago:", err);
        res.status(500).json({ error: err.message || "No se pudo registrar el pago" });
    }
});

// 4. GENERAR PDF (ESTILO STUDIO FLOW)
router.get('/recibo/:id', async (req, res) => {
    const poolPromise = req.pool.promise();
    try {
        const [rows] = await poolPromise.query(
            `SELECT 
                hp.*, 
                c.nombre, 
                c.apellidoP, 
                c.foto_path, 
                m.nombre AS membresia_nombre
             FROM Historial_pago hp
             JOIN Cliente c ON hp.id_cliente = c.id_cliente
             JOIN Membresia m ON hp.id_membresia = m.id_membresia
             WHERE hp.id_pago = ?`, 
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).send("No se encontró el recibo");
        }
        
        const data = rows[0];

        const doc = new PDFDocument({ size: 'LETTER', margin: 0 });
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        // CABECERA NEGRA
        doc.rect(0, 0, 612, 120).fill('#000000');
        doc.fillColor('#FFFFFF').fontSize(30).font('Helvetica-Bold').text('STUDIO FLOW', 50, 45);

        // FOLIO BLANCO
        doc.rect(420, 40, 140, 40).lineWidth(2).stroke('#FFFFFF');
        doc.fillColor('#FFFFFF').fontSize(16).text(`FOLIO: ${data.id_pago}`, 420, 52, { width: 140, align: 'center' });

        // FOTO - CORREGIDA LA RUTA
        let pathFoto = null;
        if (data.foto_path) {
            // Limpiar la ruta (remover posibles duplicados de 'uploads')
            let cleanPath = data.foto_path.replace(/^uploads[\\/]/, '');
            pathFoto = path.join(__dirname, '../../uploads/alumnos', cleanPath);
        }
        
        if (pathFoto && fs.existsSync(pathFoto)) {
            try {
                doc.image(pathFoto, 450, 140, { width: 100, height: 100 });
            } catch (imgErr) {
                console.error("Error al cargar imagen:", imgErr);
                doc.rect(450, 140, 100, 100).lineWidth(1).stroke('#000000');
                doc.fillColor('#999999').fontSize(10).text('ERROR FOTO', 475, 185);
            }
        } else {
            doc.rect(450, 140, 100, 100).lineWidth(1).stroke('#000000');
            doc.fillColor('#999999').fontSize(10).text('SIN FOTO', 478, 185);
        }

        // DATOS DEL RECIBO
        doc.fillColor('#333333').fontSize(20).font('Helvetica-Bold').text('RECIBO DE PAGO', 50, 150);
        doc.fontSize(12).font('Helvetica').fillColor('#000000');
        doc.text(`ALUMNO: ${data.nombre} ${data.apellidoP}`, 50, 200);
        doc.text(`CONCEPTO: ${data.membresia_nombre}`, 50, 225);
        doc.text(`FECHA: ${new Date(data.fecha_pago).toLocaleDateString()}`, 50, 250);
        doc.text(`MÉTODO: ${data.metodo_pago}`, 50, 275);
        
        if (data.referencia && data.referencia !== 'null') {
            doc.text(`REFERENCIA: ${data.referencia}`, 50, 300);
        }

        // TOTAL
        doc.rect(50, 350, 512, 50).fill('#F2F2F2');
        doc.fillColor('#000000').fontSize(20).font('Helvetica-Bold').text(`TOTAL PAGADO: $${parseFloat(data.monto_pagado).toFixed(2)}`, 70, 365);

        doc.end();
    } catch (err) {
        console.error("Error al generar recibo:", err);
        res.status(500).send(err.message);
    }
});

// 5. (OPCIONAL) Endpoint para verificar conexión
router.get('/test', (req, res) => {
    res.json({ status: 'API de finanzas funcionando correctamente' });
});

module.exports = router;
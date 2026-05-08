const express = require('express');
const router = express.Router();
router.use(express.json());

// Endpoint para insertar datos de prueba
router.get('/insertar', async (req, res) => {
    const poolPromise = req.pool.promise();

    try {
        // 1. Insertar un Empleado (si no existe el ID 1)
        await poolPromise.query(`
            INSERT IGNORE INTO Empleado (id_empleado, usuario, contrasenia, nombre, apellidoP, apellidoM)
            VALUES (1, 'admin', '1234', 'Admin', 'Sistema', 'Flow')
        `);

        // 2. Insertar un Maestro
        const [maestro] = await poolPromise.query(
            "INSERT INTO Maestros (Nombre, apellidoP, apellidoM, telefono) VALUES (?, ?, ?, ?)",
            ['Carlos', 'Ramírez', 'Sosa', '5551112233']
        );

        // 3. Insertar una Clase
        const [clase] = await poolPromise.query(
            "INSERT INTO Clases (nombre, hora_inicio, hora_fin, capacidad_maxima, nivel, id_maestro) VALUES (?, ?, ?, ?, ?, ?)",
            ['Boxeo Pro', '08:00:00', '09:30:00', 15, 'Intermedio', maestro.insertId]
        );

        // 4. Insertar una Membresía
        const [membresia] = await poolPromise.query(
            "INSERT INTO Membresia (nombre, precio, tipo, duracion, id_clase) VALUES (?, ?, ?, ?, ?)",
            ['Mensualidad Box', 650.00, 'Mensual', 30, clase.insertId]
        );

        // 5. Insertar 3 Alumnos con estados diferentes
        const alumnosData = [
            ['Juan', 'Pérez', 'García', '5559998877', 'juan@email.com', 'Activo'],
            ['María', 'López', 'Martínez', '5554443322', 'maria@email.com', 'Inactivo'],
            ['Kevin', 'Sánchez', 'Díaz', '5556667788', 'kevin@email.com', 'Con deuda']
        ];

        const resultadosAlumnos = [];

        for (const data of alumnosData) {
            const [alumno] = await poolPromise.query(
                `INSERT INTO Cliente (nombre, apellidoP, apellidoM, telefono, correo_electronico, id_membresia, estado)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [data[0], data[1], data[2], data[3], data[4], membresia.insertId, data[5]]
            );

            // 6. Insertar un historial de pago para cada uno
            await poolPromise.query(
                `INSERT INTO Historial_pago (id_cliente, id_membresia, fecha_inicio, fecha_fin, estado, monto_pagado, id_empleado_registro)
                 VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), ?, ?, 1)`,
                [
                    alumno.insertId, 
                    membresia.insertId, 
                    data[5] === 'Con deuda' ? 'pendiente' : 'pagado',
                    650.00
                ]
            );

            resultadosAlumnos.push({ id: alumno.insertId, nombre: data[0], estado: data[5] });
        }

        res.json({
            status: "Success",
            message: "Entorno de pruebas generado con éxito",
            data: {
                maestroId: maestro.insertId,
                claseId: clase.insertId,
                membresiaId: membresia.insertId,
                alumnosInsertados: resultadosAlumnos
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en el seeding", detalle: err.message });
    }
});

// Endpoint para limpiar la base de datos 
router.get('/borrar', async (req, res) => {
    const poolPromise = req.pool.promise();
    try {
        await poolPromise.query("SET FOREIGN_KEY_CHECKS = 0");
        await poolPromise.query("TRUNCATE TABLE Historial_gastos");
        await poolPromise.query("TRUNCATE TABLE Historial_pago");
        await poolPromise.query("TRUNCATE TABLE Asistencia");
        await poolPromise.query("TRUNCATE TABLE Cliente");
        await poolPromise.query("TRUNCATE TABLE Membresia");
        await poolPromise.query("TRUNCATE TABLE Clases");
        await poolPromise.query("TRUNCATE TABLE Maestros");
        await poolPromise.query("SET FOREIGN_KEY_CHECKS = 1");

        res.json({ message: "Base de datos vaciada completamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
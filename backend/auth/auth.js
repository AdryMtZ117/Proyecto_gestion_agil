const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey_para_el_proyecto_agil';

router.post('/login', async (req, res) => {
    const { correo, password } = req.body;
    
    if (!correo || !password) {
        return res.status(400).json({ success: false, message: 'Por favor ingresa usuario/correo y contraseña' });
    }

    // Lógica de Admin (Hardcoded)
    if (correo === 'admin' || correo === 'admin@admin.com') {
        if (password === 'admin123') {
            const token = jwt.sign({ id: 0, usuario: 'admin', rol: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
            return res.json({ success: true, token, usuario: { id: 0, nombre: 'Administrador', rol: 'admin' } });
        } else {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta para administrador' });
        }
    }

    // Lógica Empleado (Base de datos)
    try {
        const pool = req.pool.promise();
        const [rows] = await pool.query(
            'SELECT * FROM Empleado WHERE (usuario = ? OR correo_electronico = ?) AND activo = 1', 
            [correo, correo]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario no encontrado o cuenta inactiva' });
        }

        const empleado = rows[0];

        if (password !== empleado.contrasenia) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ 
           id: empleado.id_empleado, 
           usuario: empleado.usuario, 
           rol: empleado.rol 
        }, JWT_SECRET, { expiresIn: '12h' });

        res.json({ 
            success: true, 
            token, 
            usuario: { 
                id: empleado.id_empleado, 
                nombre: `${empleado.nombre} ${empleado.apellidoP}`, 
                rol: empleado.rol 
            } 
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

module.exports = router;

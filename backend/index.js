const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

try {
    require('dotenv').config();
} catch (err) {
    console.warn("⚠️ Advertencia: No se encontró el módulo 'dotenv'.");
}

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tu_base_de_datos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get('/api/status', (req, res) => {
  pool.query('SELECT 1 + 1 AS solution', (error, results) => {
    if (error) {
      return res.status(500).json({
        error: 'Error conectando a la BD',
        details: error.message
      });
    }

    res.json({
      message: '¡Backend y BD conectados!',
      db_test: results[0].solution
    });
  });
});

// RUTAS

//DASHBOARD
const dashboardtestRoutes = require('./dashboard/pruebas');
app.use('/api/pruebas/dashboard', dashboardtestRoutes);

const dashboardRoutes = require('./dashboard/dashboard');
app.use('/api/dashboard', dashboardRoutes);

//ALUMNOS
const alum1testRoutes = require('./alumnos/pruebas');
app.use('/api/pruebas/alumnos', alum1testRoutes);

const alumnos1Routes = require('./alumnos/alumnos');
app.use('/api/alumnos1', alumnos1Routes);

//ASISTENCIAS
const asistenciasRoutes = require('./asistencias/asistencias');
app.use('/api/asistencias', asistenciasRoutes);

//CLASES
const clasesRoutes = require('./clases/clases');
app.use('/api/clases', clasesRoutes);

//FINANZAS A
const finanzasaRoutes = require('./finanzas/finanzasA/finanzasA');
app.use('/api/finanzasA', finanzasaRoutes);

const finanzasapruebasRoutes = require('./finanzas/finanzasA/Pruebas');
app.use('/api/pruebas/finanzasa', finanzasapruebasRoutes);

//FINANZAS B
const finanzasbRoutes = require('./finanzas/finanzasB/finanzasB');
app.use('/api/finanzasB', finanzasbRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
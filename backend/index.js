const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
// Estos datos vendrán de Docker Compose
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'testdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/status', (req, res) => {
  pool.query('SELECT 1 + 1 AS solution', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error conectando a la BD', details: error.message });
    }
    res.json({ message: '¡Backend y BD conectados correctamente!', db_test: results[0].solution });
  });
});

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

//BACKEND JUNTO A SUS PRUEBAS

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
// index.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'appdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: process.env.DB_PORT || 3306
});

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get('/api/status', (req, res) => {
  pool.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '¡Backend corriendo y BD conectada!', db_test: results[0].solution });
  });
});

//BACKEND DEL DASHBOARD JUNTO A SUS PRUEBAS   
const testRoutes = require('./dashboard/pruebas');
app.use('/api/pruebas', testRoutes);
const dashboardRoutes = require('./dashboard/dashboard');
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
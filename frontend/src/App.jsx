import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [status, setStatus] = useState({ message: 'Conectando al backend...', db_test: '...' });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hacemos la petición a nuestro backend en Node
    axios.get('http://localhost:3000/api/status')
      .then(response => {
        setStatus(response.data);
      })
      .catch(err => {
        console.error(err);
        setError('Error al conectar con el backend. Revisa que el contenedor de Node esté corriendo.');
      });
  }, []);

  return (
    <div className="App">
      <h1>🚀 React + Node + MySQL</h1>
      
      <div className="card" style={{ padding: '2rem', marginTop: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        {error ? (
          <h2 style={{ color: '#ff4a4a' }}>❌ {error}</h2>
        ) : (
          <>
            <h2 style={{ color: '#4caf50' }}>✅✅:) 💀{status.message}</h2>
            <p style={{ fontSize: '1.2rem' }}>
              Prueba de base de datos (1+1): <strong>{status.db_test}</strong>
            </p>
          </>
        )}
      </div>
      
      <p className="read-the-docs" style={{ marginTop: '2rem', color: '#888' }}>
        Flujo de datos: Frontend (Puerto 5173) ➔ Backend (Puerto 3000) ➔ Base de Datos (Puerto 3306 interno)
      </p>
    </div>
  );
}

export default App;
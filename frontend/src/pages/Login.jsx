import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Login.css'; 

function Login() {
    const navigate = useNavigate();
    const [credenciales, setCredenciales] = useState({ correo: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', credenciales);
            
            if (response.data.success) {
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('usuario', JSON.stringify(response.data.usuario));
                
                // Redirigir al dashboard
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="login-container" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
            <div className="login-box">
                <h2>Iniciar Sesión</h2>
                {error && <div className="error-message" style={{ color: '#ff4c4c', background: '#ffe6e6', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Usuario o Correo</label>
                        <input 
                            type="text" 
                            name="correo" 
                            placeholder="admin o ejemplo@correo.com"
                            value={credenciales.correo} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="********"
                            value={credenciales.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-login">Ingresar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
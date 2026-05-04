import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Login.css'; // Crearemos este archivo en el siguiente paso

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
            // Asumiendo que tu backend en Node.js recibe esto en la ruta de login
            const response = await axios.post('http://localhost:3000/api/login', credenciales);
            
            if (response.data.success) {
                // Aquí puedes guardar un token o los datos del usuario si tu backend los envía
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
                
                // Redirigir al dashboard o a la página principal tras un login exitoso
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Iniciar Sesión</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            name="correo" 
                            placeholder="ejemplo@correo.com"
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
import { useState, useEffect } from 'react';
import axios from 'axios';
// ¡ESTA ES LA LÍNEA QUE FALTABA!
import { useNavigate } from 'react-router-dom'; 
import '../style/App2_ModuloAlumnos.css'; // Mantenemos sus estilos específicos

function Alumnos() {
    // Aquí activas el navegador
    const navigate = useNavigate();

    const [status, setStatus] = useState({ message: 'Conectando...', db_test: '...' });

    useEffect(() => {
        axios.get('http://localhost:3000/api/status')
            .then(response => setStatus(response.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <main className="main-content alumnos-layout">
            <header className="top-bar-simple">
                <div className="spacer"></div>
                <div className="notification">
                    <i className="fas fa-bell"></i>
                </div>
            </header>

            <div className="filters-section">
                <div className="search-container">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Buscar alumno..." />
                </div>

                <div className="dropdowns-container">
                    <div className="custom-select">
                        <select><option value="">Nombre</option></select>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                    <div className="custom-select">
                        <select><option value="">Disciplina</option></select>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                    <div className="custom-select">
                        <select><option value="">Estatus</option></select>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Nombre</th>
                            <th>Disciplina</th>
                            <th>Fecha de Pago</th>
                            <th>Estatus</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><div className="avatar-small"><img src="https://i.pravatar.cc/150?img=5" alt="foto" /></div></td>
                            <td>Ana Martínez</td>
                            <td>Karate Do</td>
                            <td>15/08/2026</td>
                            <td><span className="status-dot success"></span></td>
                        </tr>
                        {/* Aquí se agregan más */}
                    </tbody>
                </table>

                {/* Al presionar nos despliega mas informacion */}
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <button onClick={() => navigate('/alumnos/perfil')} className="btn-lila">
                        <i className="fas fa-eye"></i> Ver Perfil del Alumno
                    </button>
                </div>
            </div>

            <div className="bottom-action">
                <button className="btn-lila"><i className="fas fa-plus"></i> Nuevo alumno</button>
            </div>
        </main>
    );
}

export default Alumnos;
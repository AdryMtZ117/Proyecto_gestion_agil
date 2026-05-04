import React, { useState } from 'react';
import axios from 'axios';
import '../style/App_Asistencias.css';

function Asistencias() {
    const [searchValue, setSearchValue] = useState('');
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleScan = async () => {
        if (!searchValue.trim()) return;
        setLoading(true);
        setScanResult(null);

        try {
            const response = await axios.post('http://localhost:3000/api/asistencias/scan', { query: searchValue });
            setScanResult(response.data);
        } catch (error) {
            const status = error.response?.status;
            if (status === 404 && searchValue) {
                simularEscaneo(searchValue);
            } else if (error.response && error.response.data) {
                setScanResult(error.response.data);
            } else {
                 setScanResult({
                    status: 'error',
                    message: `¡ERROR NO SE HA ENCONTRADO EL USUARIO [${searchValue.toUpperCase()}]!`
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const simularEscaneo = (val) => {
        if (val === '1' || val.toLowerCase() === 'activo') {
            setScanResult({
                status: 'success',
                message: '¡BIENVENIDO A CORAZÓN DE PIEDRA!',
                student: { nombre: 'María García', estado: 'Activo', clase: 'Pilates' },
                photoUrl: 'https://i.pravatar.cc/150?img=1'
            });
        } else if (val === '2' || val.toLowerCase() === 'deuda') {
            setScanResult({
                status: 'warning',
                message: '¡ALERTA EL USUARIO TIENE UN PAGO VENCIDO!',
                student: { nombre: 'Juan Pérez', estado: 'Con deuda', clase: 'Crossfit' },
                photoUrl: 'https://i.pravatar.cc/150?img=2'
            });
        } else {
            setScanResult({
                status: 'error',
                message: `¡ERROR NO SE HA ENCONTRADO EL USUARIO [${val.toUpperCase()}]!`
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleScan();
        }
    }

    const handleRegisterAsistencia = async () => {
        if (!scanResult || !scanResult.student) return;

        const { id_cliente, id_membresia, id_clase, clase } = scanResult.student;

        if (clase === 'No asignada' || !id_clase || !id_membresia) {
            alert('No se puede registrar asistencia: El alumno no tiene una clase asignada.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/asistencias/register', {
                id_cliente,
                id_membresia,
                id_clase
            });

            if (response.data.status === 'success') {
                alert('¡Asistencia registrada con éxito!');
                setSearchValue('');
                setScanResult(null);
            }
        } catch (error) {
            alert('Error al registrar la asistencia');
            console.error(error);
        }
    };

    return (
        <main className="main-content asistencias-layout">
            <header className="asistencias-header">
                <h1>Control de Asistencia</h1>
                <div className="notification-bell">
                    <i className="fas fa-bell"></i>
                </div>
            </header>

            <div className="asistencias-content">
                <p>Introduzca el numero de matricula, ID o nombre del estudiante:</p>
                
                <input 
                    type="text" 
                    className="input-scan" 
                    placeholder="Escriba aquí..." 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                />

                <button className="btn-scan" onClick={handleScan} disabled={loading}>
                    {loading ? 'Escaneando...' : 'Escaneo'}
                </button>
            </div>

            {scanResult && (
                <div className={`result-card ${scanResult.status}`}>
                    {scanResult.status !== 'error' && (
                        <img 
                            src={scanResult.photoUrl || 'https://via.placeholder.com/120'} 
                            alt="Student" 
                            className="student-photo" 
                        />
                    )}
                    {(scanResult.status === 'error' && scanResult.photoUrl) && (
                            <img 
                            src={scanResult.photoUrl} 
                            alt="Student Error" 
                            className="student-photo" 
                        />
                    )}
                    <div className="result-info">
                        <div className="result-title">{scanResult.message}</div>
                        {scanResult.student && (
                            <div className="result-details">
                                <span>Estado: {scanResult.student.estado}</span>
                                <span>Clase: {scanResult.student.clase}</span>
                                <button className="btn-register-asistencia" onClick={handleRegisterAsistencia}>Registrar asistencia</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}

export default Asistencias;
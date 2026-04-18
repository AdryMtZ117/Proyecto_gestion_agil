import '../style/App_Clases.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Clases() {
    const hoy = new Date();
    const [mesActual, setMesActual] = useState(hoy.getMonth());
    const [anioActual, setAnioActual] = useState(hoy.getFullYear());
    const [diaSeleccionado, setDiaSeleccionado] = useState(hoy.getDate());

    const [clasesDia, setClasesDia] = useState([]);
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);
    const [alumnosClase, setAlumnosClase] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '', dias_semana: '', hora_inicio: '', hora_fin: '', fecha_inicio: '', fecha_fin: '', capacidad_maxima: 20, nivel: 'Principiante', id_maestro: ''
    });

    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const diasSemana = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    const nombresDiasSemanaCompleto = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ];

    // Evitar desborde si el mes cambia a uno con menos días
    const maxDia = new Date(anioActual, mesActual + 1, 0).getDate();
    const diaValido = diaSeleccionado > maxDia ? maxDia : diaSeleccionado;

    const fechaSeleccionadaObj = new Date(anioActual, mesActual, diaValido);
    const diaSemanaSeleccionadoTxt = nombresDiasSemanaCompleto[fechaSeleccionadaObj.getDay()];
    const fechaTexto = `${diaSemanaSeleccionadoTxt}, ${diaValido} de ${nombresMeses[mesActual]} de ${anioActual}`;

    const primerDiaMes = new Date(anioActual, mesActual, 1).getDay();
    const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

    const celdas = [];
    for (let i = 0; i < primerDiaMes; i++) celdas.push(null);
    for (let d = 1; d <= diasEnMes; d++) celdas.push(d);

    const esHoy = (dia) => dia === hoy.getDate() && mesActual === hoy.getMonth() && anioActual === hoy.getFullYear();

    const retroceder = () => {
        setClaseSeleccionada(null);
        if (mesActual === 0) { setMesActual(11); setAnioActual(a => a - 1); }
        else setMesActual(m => m - 1);
        setDiaSeleccionado(1);
    };

    const avanzar = () => {
        setClaseSeleccionada(null);
        if (mesActual === 11) { setMesActual(0); setAnioActual(a => a + 1); }
        else setMesActual(m => m + 1);
        setDiaSeleccionado(1);
    };

    const fetchClasesDia = async () => {
        try {
            const mm = (mesActual + 1).toString().padStart(2, '0');
            const dd = diaValido.toString().padStart(2, '0');
            const yyyy = anioActual;
            const fechaStr = `${yyyy}-${mm}-${dd}`;

            const response = await axios.get(`http://localhost:3000/api/clases?diaSemana=${diaSemanaSeleccionadoTxt}&fecha=${fechaStr}`);
            setClasesDia(response.data);
            setClaseSeleccionada(null);
        } catch (error) {
            console.error("Error fetching clases", error);
        }
    };

    useEffect(() => {
        if (diaSeleccionado) {
            fetchClasesDia();
        }
    }, [diaSeleccionado, mesActual, anioActual]);

    const handleSelectClase = async (clase) => {
        setClaseSeleccionada(clase);
        try {
            const resp = await axios.get(`http://localhost:3000/api/clases/${clase.id}/alumnos`);
            setAlumnosClase(resp.data);
        } catch(error) {
            console.error("Error al cargar alumnos", error);
        }
    };

    const handleChangeForm = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/clases', {
                ...formData,
                id_maestro: formData.id_maestro === '' ? null : parseInt(formData.id_maestro)
            });
            alert("¡Clase agregada exitosamente!");
            setShowModal(false);
            fetchClasesDia();
        } catch (error) {
            alert(error.response?.data?.message || "Error al agregar la clase");
        }
    };

    return (
        <main className="main-content clases-page-wrapper">
            <header className="top-bar-full">
                <button className="btn-agregar-clase" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i> Agregar Clase
                </button>
                <div className="notification">
                    <i className="fas fa-bell"></i>
                </div>
            </header>

            <div className="clases-split-layout">
                <div className="left-panel">
                    <div className="calendario-container">
                        <div className="mes-tab">
                        <span className="mes-label">{nombresMeses[mesActual]} {anioActual}</span>
                        <div className="nav-flechas">
                            <button onClick={retroceder}><i className="fas fa-chevron-left"></i></button>
                            <button onClick={avanzar}><i className="fas fa-chevron-right"></i></button>
                        </div>
                    </div>

                    <div className="calendario-grid-wrapper">
                        <div className="dias-semana">
                            {diasSemana.map((d, i) => (
                                <div key={i} className="dia-semana-label">{d}</div>
                            ))}
                        </div>

                        <div className="dias-grid">
                            {celdas.map((dia, i) => (
                                <div key={i} className={`dia-celda ${dia === null ? 'vacia' : ''}`}>
                                    {dia && (
                                        <div 
                                            className={`dia-numero ${esHoy(dia) ? 'hoy' : ''} ${dia === diaValido ? 'seleccionado' : ''}`}
                                            onClick={() => setDiaSeleccionado(dia)}
                                        >
                                            {dia}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-panel">
                <div className="fecha-header-right">
                    <h2>{fechaTexto}</h2>
                </div>

                {!claseSeleccionada ? (
                    <div className="listado-clases">
                        <h3>Clases Programadas</h3>
                        {clasesDia.length === 0 ? (
                            <p className="no-data">No hay clases programadas para este día.</p>
                        ) : (
                            <div className="clases-cards">
                                {clasesDia.map(cl => (
                                    <div key={cl.id} className="clase-card" onClick={() => handleSelectClase(cl)}>
                                        <h4>{cl.nombre}</h4>
                                        <p><i className="far fa-clock"></i> {cl.horaInicio} - {cl.horaFin}</p>
                                        <p><i className="fas fa-user-tie"></i> {cl.maestro}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="detalle-clase">
                        <button className="btn-volver" onClick={() => setClaseSeleccionada(null)}>
                            <i className="fas fa-arrow-left"></i> Volver a clases
                        </button>
                        <h3>Info de Clase: {claseSeleccionada.nombre}</h3>
                        <div className="info-box">
                            <p><strong>Nivel:</strong> {claseSeleccionada.nivel}</p>
                            <p><strong>Días:</strong> {claseSeleccionada.dias}</p>
                            <p><strong>Horario:</strong> {claseSeleccionada.horaInicio} - {claseSeleccionada.horaFin}</p>
                            <p><strong>Capacidad max:</strong> {claseSeleccionada.capacidad}</p>
                            <p><strong>Maestro:</strong> {claseSeleccionada.maestro}</p>
                        </div>

                        <h4>Alumnos en esta clase ({alumnosClase.length})</h4>
                        {alumnosClase.length === 0 ? (
                            <p className="no-data">Ningún alumno inscrito.</p>
                        ) : (
                            <ul className="lista-alumnos">
                                {alumnosClase.map(al => (
                                    <li key={al.id}>
                                        <img src={al.foto} alt="alumno" />
                                        <span>{al.nombre}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Agregar Nueva Clase</h2>
                        <form onSubmit={handleSubmitForm}>
                            <div className="form-group">
                                <label>Nombre de la Clase</label>
                                <input type="text" name="nombre" placeholder="Ej: Pilates" value={formData.nombre} onChange={handleChangeForm} required />
                            </div>
                            <div className="form-group">
                                <label>Días (ej: Lunes,Miércoles)</label>
                                <input type="text" name="dias_semana" placeholder="Separados por coma" value={formData.dias_semana} onChange={handleChangeForm} required />
                            </div>
                            <div className="form-group-row" style={{display: 'flex', gap: '10px'}}>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Hora Inicio</label>
                                    <input type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleChangeForm} required />
                                </div>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Hora Fin</label>
                                    <input type="time" name="hora_fin" value={formData.hora_fin} onChange={handleChangeForm} required />
                                </div>
                            </div>
                            <div className="form-group-row" style={{display: 'flex', gap: '10px'}}>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Fecha Inicio (Opcional)</label>
                                    <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChangeForm} />
                                </div>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Fecha Fin (Opcional)</label>
                                    <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChangeForm} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>ID Maestro (Foránea)</label>
                                <input type="number" name="id_maestro" value={formData.id_maestro} onChange={handleChangeForm} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn-save">Guardar Clase</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Clases;
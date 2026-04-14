import '../style/App_Clases.css';
import React, { useState } from 'react';

function Clases() {
    const hoy = new Date();
    const [mesActual, setMesActual] = useState(hoy.getMonth());
    const [anioActual, setAnioActual] = useState(hoy.getFullYear());

    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const diasSemana = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const nombresDiasSemanaCompleto = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ];

    const fechaTexto = `${nombresDiasSemanaCompleto[hoy.getDay()]}, ${hoy.getDate()} de ${nombresMeses[hoy.getMonth()]} de ${hoy.getFullYear()}`;

    const primerDiaMes = new Date(anioActual, mesActual, 1).getDay();
    const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

    const celdas = [];
    for (let i = 0; i < primerDiaMes; i++) celdas.push(null);
    for (let d = 1; d <= diasEnMes; d++) celdas.push(d);

    const esHoy = (dia) =>
        dia === hoy.getDate() &&
        mesActual === hoy.getMonth() &&
        anioActual === hoy.getFullYear();

    const retroceder = () => {
        if (mesActual === 0) { setMesActual(11); setAnioActual(a => a - 1); }
        else setMesActual(m => m - 1);
    };

    const avanzar = () => {
        if (mesActual === 11) { setMesActual(0); setAnioActual(a => a + 1); }
        else setMesActual(m => m + 1);
    };

    return (
        <main className="main-content clases-layout">

            <header className="top-bar-simple">
                <div className="fecha-header">
                    <h2>{fechaTexto}</h2>
                    <button className="btn-editar">
                        <i className="fas fa-pencil-alt"></i>
                    </button>
                </div>
                <div className="notification">
                    <i className="fas fa-bell"></i>
                </div>
            </header>

            <div className="calendario-container">

                <div className="mes-tab">
                    <span className="mes-label">{nombresMeses[mesActual]} {anioActual}</span>
                    <button className="btn-dropdown">
                        <i className="fas fa-chevron-down"></i>
                    </button>
                    <div className="nav-flechas">
                        <button onClick={retroceder}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button onClick={avanzar}>
                            <i className="fas fa-chevron-right"></i>
                        </button>
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
                                    <span className={`dia-numero ${esHoy(dia) ? 'hoy' : ''}`}>
                                        {dia}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}

export default Clases;
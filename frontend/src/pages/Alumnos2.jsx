import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Alumnos2.css'; // Asegúrate de tener esta ruta correcta

function Alumnos2() {
    const navigate = useNavigate();

    return (
        <div className="main-content alumnos-profile-layout">
            
            {/* Cabecera con botón de regresar y campana */}
            <header className="profile-top-bar">
                <button className="btn-back" onClick={() => navigate('/alumnos')}>
                    <i className="fas fa-undo"></i> <span>Regresar</span>
                </button>
                <div className="notification">
                    <i className="fas fa-bell"></i>
                </div>
            </header>

            {/* Tarjeta de Perfil Principal */}
            <div className="profile-header-card">
                <div className="profile-avatar">
                    {/* Puedes cambiar la URL por la imagen real del alumno */}
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Alumno" />
                </div>
                <div className="profile-info">
                    <h2>Nombre del Alumno</h2>
                    <p>Contacto: Correo</p>
                    <p>Telefono: 1234567890</p>
                </div>
            </div>

            {/* Grid de 3 columnas para Detalles */}
            <div className="profile-details-grid">
                
                {/* Columna 1: General */}
                <div className="detail-card">
                    <h3 className="card-title">General</h3>
                    <div className="card-content">
                        <p className="label">Diciplinas inscritas:</p>
                        <p className="value">Piano</p>
                        
                        <p className="label mt-4">Horarios:</p>
                        <p className="value">Lun \ Dom 16:00</p>
                    </div>
                </div>

                {/* Columna 2: Finanzas */}
                <div className="detail-card">
                    <h3 className="card-title">Finanzas</h3>
                    <div className="card-content">
                        <p className="value highlight-text">Historial de pago</p>
                        <p className="value highlight-text mt-4">Proximo<br/>Vencimiento</p>
                    </div>
                </div>

                {/* Columna 3: Asistencia (Calendario visual) */}
                <div className="detail-card attendance-card">
                    <h3 className="card-title">Asistencia</h3>
                    
                    <div className="mock-calendar">
                        <p className="cal-subtitle">Select date</p>
                        <div className="cal-header">
                            <h4>Mon, Aug 17</h4>
                            <i className="fas fa-pen"></i>
                        </div>
                        
                        <div className="cal-month-nav">
                            <span>August 2025 <i className="fas fa-caret-down"></i></span>
                            <div className="cal-arrows">
                                <i className="fas fa-chevron-left"></i>
                                <i className="fas fa-chevron-right"></i>
                            </div>
                        </div>

                        <div className="cal-grid weekdays">
                            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                        </div>
                        <div className="cal-grid days">
                            <span></span><span></span><span>1</span><span>2</span><span>3</span><span>4</span>
                            <span className="current-day">5</span><span>6</span><span>7</span><span>8</span>
                            <span>9</span><span>10</span><span>11</span><span>12</span><span>13</span><span>14</span>
                            <span>15</span><span>16</span><span className="selected-day">17</span><span>18</span>
                            <span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span>
                            <span>25</span><span>26</span><span>27</span><span>28</span><span>29</span><span>30</span>
                            <span>31</span>
                        </div>
                        
                        <div className="cal-footer">
                            <span>Cancel</span>
                            <span>OK</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Alumnos2;
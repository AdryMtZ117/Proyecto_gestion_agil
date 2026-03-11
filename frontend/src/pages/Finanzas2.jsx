import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Finanzas2.css'; // Nuestro nuevo archivo de estilos

function Finanzas2() {
    const navigate = useNavigate();

    return (
        <main className="main-content finanzas2-layout">
            
            {/* Cabecera con título, botón regresar y campana */}
            <header className="top-bar-finanzas2">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button className="btn-back-simple" onClick={() => navigate('/finanzas')}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <h2 className="section-title">Registro de Gastos</h2>
                </div>
                <div className="notification">
                    <i className="fas fa-bell"></i>
                </div>
            </header>

            {/* Formulario superior */}
            <div className="gastos-form-section">
                <div className="form-group">
                    <label>Concepto:</label>
                    <div className="custom-select-gastos">
                        <select defaultValue="Luz eléctrica">
                            <option value="Luz eléctrica">Luz eléctrica</option>
                            <option value="Pago a maestro">Pago a maestro</option>
                            <option value="Servicio WiFi">Servicio WiFi</option>
                            <option value="Otro...">Otro...</option>
                        </select>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                </div>

                <div className="form-group">
                    <label>Monto:</label>
                    <input type="text" className="input-monto-gastos" placeholder="$0.00" />
                </div>

                <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                    <button className="btn-upload-ticket">
                        <i className="fas fa-file-upload"></i> Cargar Ticket
                    </button>
                </div>
            </div>

            {/* Grid inferior: Calendario y Tabla */}
            <div className="gastos-grid">
                
                {/* Columna Izquierda: Calendario */}
                <div className="calendar-column">
                    <h3 className="column-title">Fecha:</h3>
                    
                    <div className="mock-calendar-green">
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

                {/* Columna Derecha: Buscador y Tabla */}
                <div className="table-column">
                    <h3 className="column-title">Filtrado por fecha:</h3>
                    
                    <div className="search-bar-gastos">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Buscar" />
                    </div>

                    <div className="table-wrapper-gastos">
                        <table className="gastos-table">
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th>Monto</th>
                                    <th>Fecha</th>
                                    <th>Ticket</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item}>
                                        <td>Concepto</td>
                                        <td>$0.00</td>
                                        <td>15/08/2026</td>
                                        <td>
                                            <button className="btn-descargar">
                                                <i className="fas fa-file-pdf" style={{ color: '#d32f2f' }}></i> Descargar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    );
}

export default Finanzas2;
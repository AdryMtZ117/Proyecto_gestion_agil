import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importación necesaria para el botón
import '../style/App3_FINANZAS_A.css';

function Finanzas() {
    const navigate = useNavigate(); // Activamos la navegación

    const [status, setStatus] = useState({ message: 'Conectando...', db_test: '...' });
    const [metodoPago, setMetodoPago] = useState('Efectivo');

    useEffect(() => {
        axios.get('http://localhost:3000/api/status')
            .then(response => setStatus(response.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <main className="main-content finanzas-layout">
            <header className="top-bar-simple" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="notification">
                    <i className="fas fa-bell"></i>
                </div>
            </header>

            <h2 className="section-title">Registro de Pagos</h2>

            {/* --- SECCIÓN DE FORMULARIO ESTILO BURBUJA --- */}
            <div className="payment-form-section">
                
                {/* Buscador */}
                <div className="form-group full-width">
                    <label>Buscar alumno:</label>
                    <div className="search-bar-rounded">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Buscar" />
                    </div>
                </div>

                <div className="form-row">
                    {/* Concepto y Monto */}
                    <div className="form-group small">
                        <label>Seleccionar concepto:</label>
                        <div className="custom-select-green">
                            <select defaultValue="Mensualidad">
                                <option value="Mensualidad">Mensualidad</option>
                                <option value="Inscripción">Inscripción</option>
                                <option value="Clase suelta">Clase suelta</option>
                                <option value="Uniforme">Uniforme</option>
                            </select>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                    </div>

                    <div className="form-group small">
                        <label>Monto:</label>
                        <input type="text" className="input-monto" placeholder="$0.00" />
                    </div>

                    {/* Método de pago (Botones burbuja) */}
                    <div className="form-group large">
                        <label>Método de pago:</label>
                        <div className="payment-methods-group">
                            <button 
                                className={`btn-method ${metodoPago === 'Efectivo' ? 'active' : ''}`}
                                onClick={() => setMetodoPago('Efectivo')}
                            >
                                Efectivo
                            </button>
                            <button 
                                className={`btn-method ${metodoPago === 'Transferencia' ? 'active' : ''}`}
                                onClick={() => setMetodoPago('Transferencia')}
                            >
                                Transferencia
                            </button>
                            <button 
                                className={`btn-method ${metodoPago === 'Tarjeta' ? 'active' : ''}`}
                                onClick={() => setMetodoPago('Tarjeta')}
                            >
                                Tarjeta
                            </button>
                        </div>
                    </div>
                </div>

                {/* Botones de acción principales */}
                <div className="action-buttons-row">
                    <button className="btn-action primary">Registrar pago</button>
                    <button className="btn-action secondary">Imprimir recibo</button>
                </div>
            </div>

            {/* --- TABLA --- */}
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Folio</th>
                            <th>Nombre</th>
                            <th>Concepto</th>
                            <th>Monto</th>
                            <th>Método</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="folio">1</td>
                            <td>Name</td>
                            <td>Concepto</td>
                            <td>$0.00</td>
                            <td>Efectivo</td>
                        </tr>
                        <tr>
                            <td className="folio">2</td>
                            <td>Name</td>
                            <td>Concepto</td>
                            <td>$0.00</td>
                            <td>Transferencia</td>
                        </tr>
                        <tr>
                            <td className="folio">3</td>
                            <td>Name</td>
                            <td>Concepto</td>
                            <td>$0.00</td>
                            <td>Tarjeta</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* BOTÓN PARA VIAJAR A FINANZAS 2 */}
            <div style={{ textAlign: 'center', padding: '30px' }}>
                <button onClick={() => navigate('/finanzas2')} className="btn-action">
                    <i className="fas fa-file-invoice-dollar"></i> Ir a Registro de Gastos
                </button>
            </div>
            
        </main>
    );
}

export default Finanzas;
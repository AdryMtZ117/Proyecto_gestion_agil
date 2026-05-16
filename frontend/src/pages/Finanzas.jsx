import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../style/App3_FINANZAS_A.css';
import NotificationBell from '../components/NotificationBell';

function Finanzas() {
  const navigate = useNavigate();

  const [status, setStatus] = useState({ message: 'Conectando...', db_test: '...' });
  const [rol, setRol] = useState('');
  const BASE_URL_FOTOS = "http://localhost:3000/uploads/alumnos/";
  const API_URL = "http://localhost:3000/api/finanzasA";

  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [concepto, setConcepto] = useState('Mensualidad');
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [referencia, setReferencia] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRol(decoded.rol);
      } catch (e) {
        console.error(e);
      }
    }
    axios.get('http://localhost:3000/api/status')
      .then(response => setStatus(response.data))
      .catch(err => console.error(err));
    cargarPagos();
  }, []);

  const obtenerUrlImagen = (fotoPath) => {
    if (!fotoPath) return "https://via.placeholder.com/35?text=No+Image";
    return `${BASE_URL_FOTOS}${fotoPath}`;
  };

  const cargarPagos = () => {
    axios.get(`${API_URL}/listar-pagos`)
      .then(res => setPagos(res.data))
      .catch(err => console.error("Error al cargar pagos:", err));
  };

  useEffect(() => {
    if (busqueda.length < 2) {
      setResultados([]);
      return;
    }
    axios.get(`${API_URL}/buscar-alumno?q=${busqueda}`)
      .then(res => setResultados(res.data))
      .catch(err => console.error("Error en búsqueda:", err));
  }, [busqueda]);

  const registrarPago = () => {
    if (!alumnoSeleccionado) return alert('Selecciona un alumno');
    if (!monto) return alert('Ingresa monto');

    axios.post(`${API_URL}/registrar-pago`, {
      id_cliente: alumnoSeleccionado.id_cliente,
      id_empleado: 1,
      concepto: concepto,
      monto_pagado: monto,
      metodo_pago: metodoPago,
      referencia: metodoPago !== 'Efectivo' ? referencia : null,
    })
      .then(() => {
        alert('Pago registrado correctamente');
        setMonto('');
        setReferencia('');
        setAlumnoSeleccionado(null);
        setBusqueda('');
        cargarPagos();
      })
      .catch(err => alert('Error: ' + (err.response?.data?.error || 'Error')));
  };

  const imprimirRecibo = (folio) => {
    if (!folio) return alert('No hay folio');
    window.open(`${API_URL}/recibo/${folio}`, '_blank');
  };

  return (
    <main className="main-content finanzas-layout">
      <header className="top-bar-simple" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <NotificationBell />
      </header>

      <h2 className="section-title">Registro de Pagos</h2>

      <div className="payment-form-section">
        {/* BUSCADOR */}
        <div className="form-group" style={{ position: 'relative' }}>
          <label>Buscar alumno:</label>
          <div className="search-bar-rounded">
            🔍
            <input
              type="text"
              placeholder="Nombre o teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {resultados.length > 0 && (
            <div className="search-results" style={{
              position: 'absolute', background: 'white', border: '1px solid #999',
              zIndex: 100, width: '500px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
            }}>
              {resultados.map((a) => (
                <div
                  key={a.id_cliente}
                  className="result-item"
                  style={{ padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                  onClick={() => {
                    setAlumnoSeleccionado(a);
                    setResultados([]);
                    setBusqueda(`${a.nombre} ${a.apellidoP}`);
                  }}
                >
                  <img
                    src={obtenerUrlImagen(a.foto_path)}
                    alt=""
                    style={{ width: 35, height: 35, borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/35?text=Error"; }}
                  />
                  {a.nombre} {a.apellidoP}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PREVIEW ALUMNO */}
        {alumnoSeleccionado && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 15, margin: '15px 0',
            padding: '15px', background: '#f9fbe7', borderRadius: 12, border: '1px solid #c5d87a'
          }}>
            <img
              src={obtenerUrlImagen(alumnoSeleccionado.foto_path)}
              alt="Perfil"
              style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #7a9a16' }}
              onError={(e) => { e.target.src = "https://via.placeholder.com/60?text=Error"; }}
            />
            <div>
              <strong>{alumnoSeleccionado.nombre} {alumnoSeleccionado.apellidoP}</strong>
              <div style={{ fontSize: 13, color: '#666' }}>ID: {alumnoSeleccionado.id_cliente}</div>
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Concepto:</label>
            <select 
              value={concepto} 
              onChange={(e) => setConcepto(e.target.value)}
              className="custom-select-green"
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #7a9a16' }}
            >
              <option value="Mensualidad">Mensualidad</option>
              <option value="Inscripción">Inscripción</option>
              <option value="Uniforme">Uniforme</option>
              <option value="Examen">Examen</option>
            </select>
          </div>

          <div className="form-group">
            <label>Monto:</label>
            <input
              type="number"
              className="input-monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="$0.00"
            />
          </div>

          <div className="form-group">
            <label>Método:</label>
            <div className="payment-methods-group">
              {['Efectivo', 'Transferencia', 'Tarjeta'].map((m) => (
                <button
                  key={m}
                  className={'btn-method ' + (metodoPago === m ? 'active' : '')}
                  onClick={() => {
                    setMetodoPago(m);
                    if (m !== 'Efectivo') setShowModal(true);
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="action-buttons-row">
          <button className="btn-action" onClick={registrarPago}>Registrar Pago</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Alumno</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p) => (
              <tr key={p.folio}>
                <td>{p.folio}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img
                      src={obtenerUrlImagen(p.foto_path)}
                      alt=""
                      style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/30?text=N/A"; }}
                    />
                    {p.nombre}
                  </div>
                </td>
                <td>{p.concepto}</td>
                <td>${p.monto_pagado || p.monto}</td>
                <td>{p.metodo_pago || p.metodo}</td>
                <td>
                  <button onClick={() => imprimirRecibo(p.folio)} style={{ color: '#3fa9f5', border: 'none', background: 'none', cursor: 'pointer' }}>
                    Imprimir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', textAlign: 'center' }}>
            <h3>Referencia {metodoPago}</h3>
            <input type="text" value={referencia} onChange={(e) => setReferencia(e.target.value)} style={{ padding: '10px', width: '80%', marginBottom: '20px' }} />
            <button className="btn-action" onClick={() => setShowModal(false)}>Aceptar</button>
          </div>
        </div>
      )}

      {/* BOTÓN PARA VIAJAR A FINANZAS 2 */}
      {rol !== 'empleado' && (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <button onClick={() => navigate('/finanzas2')} className="btn-action">
            <i className="fas fa-file-invoice-dollar"></i> Ir a Registro de Gastos
          </button>
        </div>
      )}
    </main>
  );
}

export default Finanzas;
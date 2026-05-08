import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Finanzas2.css';

const API = "http://localhost:3000";

import NotificationBell from '../components/NotificationBell';

function Finanzas2() {
  const navigate = useNavigate();

  const [concepto, setConcepto] = useState("Luz eléctrica");
  const [monto, setMonto] = useState("");
  const [ticket, setTicket] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [busqueda, setBusqueda] = useState("");


  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [anioActual, setAnioActual] = useState(new Date().getFullYear());

  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  useEffect(() => {
    document.body.style.backgroundColor = "#CFF5D8";
    return () => document.body.style.backgroundColor = "";
  }, []);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const res = await fetch(`${API}/api/finanzasB/listar-gastos`);
    const data = await res.json();
    setGastos(data);
  };

  const guardar = async () => {
    if (!monto) return alert("Falta monto");

    const form = new FormData();
    form.append("concepto", concepto);
    form.append("monto_pagado", monto);
    form.append("id_empleado", 1);
    if (ticket) form.append("ticket", ticket);

    await fetch(`${API}/api/finanzasB/registrar-gasto`, {
      method: "POST",
      body: form
    });

    setMonto("");
    setTicket(null);
    cargar();
  };

  const filtrar = async () => {
    if (!fecha) return cargar();
    const res = await fetch(`${API}/api/finanzasB/filtrar-gastos?fecha=${fecha}`);
    const data = await res.json();
    setGastos(data);
  };


  const cambiarMes = (offset) => {
    let m = mesActual + offset;
    let a = anioActual;
    if (m < 0) { m = 11; a--; }
    if (m > 11) { m = 0; a++; }
    setMesActual(m);
    setAnioActual(a);
  };

  const renderDias = () => {
    const dias = new Date(anioActual, mesActual + 1, 0).getDate();
    const arr = [];
    for (let i = 1; i <= dias; i++) {
      const f = `${anioActual}-${String(mesActual+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
      arr.push(
        <button
          key={i}
          className={`day-btn ${fecha === f ? 'active-day' : ''}`}
          onClick={() => setFecha(f)}
        >
          {i}
        </button>
      );
    }
    return arr;
  };

  const abrirTicket = (ruta) => {
    window.open(`${API}/${ruta.replace(/^\/+/, '')}`, "_blank");
  };

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
        <NotificationBell />
      </header>

      <section className="gastos-form-section">
        <div className="form-group">
          <label>Concepto</label>
          <select value={concepto} onChange={(e) => setConcepto(e.target.value)}>
            <option>Luz eléctrica</option>
            <option>Pago maestro</option>
            <option>WiFi</option>
            <option>Otro</option>
          </select>
        </div>

        <div className="form-group">
          <label>Monto</label>
          <input
            type="number"
            placeholder="$ 0.00"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>

        <div className="form-row-actions">
          <div className="upload-wrapper">
            <label className="btn-action-green">
              📎 Cargar Ticket
              <input
                type="file"
                hidden
                onChange={(e) => setTicket(e.target.files[0])}
              />
            </label>
            {ticket && <span className="file-name-text">{ticket.name}</span>}
          </div>

          <button className="btn-action-green" onClick={guardar}>
            Guardar
          </button>
        </div>
      </section>

      <div className="gastos-grid">
        <aside className="calendar-box">
          <h3 className="column-title">Fecha: {fecha}</h3>
          <div className="calendar-nav">
            <button onClick={() => cambiarMes(-1)}>‹</button>
            <span>{meses[mesActual]} {anioActual}</span>
            <button onClick={() => cambiarMes(1)}>›</button>
          </div>
          <div className="calendar-real">
            {renderDias()}
          </div>
          <button className="btn-filter-calendar" onClick={filtrar}>
            Filtrar Fecha
          </button>
        </aside>

        <section className="table-container">
          <input
            className="search-bar-gastos"
            placeholder="Buscar por concepto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <table className="gastos-table">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Ticket</th>
              </tr>
            </thead>
            <tbody>
              {gastos
                .filter(g => g.concepto?.toLowerCase().includes(busqueda.toLowerCase()))
                /* ORDENAR POR FOLIO (id_gasto) DE MENOR A MAYOR */
                .sort((a, b) => Number(a.id_gasto) - Number(b.id_gasto))
                .map(g => (
                <tr key={g.id_gasto}>
                  <td>#{g.id_gasto}</td>
                  <td>{g.concepto}</td>
                  <td className="monto-cell">${g.monto_pagado}</td>
                  <td>{g.fecha}</td>
                  <td>
                    {g.factura ? (
                      <button
                        className="btn-ver-ticket"
                        onClick={() => abrirTicket(g.factura)}
                      >
                        Ver Ticket
                      </button>
                    ) : <span className="no-ticket">Sin archivo</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}

export default Finanzas2;
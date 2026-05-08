import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../style/Alumnos2.css';

function Alumnos2() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [alumno,   setAlumno]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/alumnos1/${id}`)
      .then(res => {
        setAlumno(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!alumno)  return <p>Alumno no encontrado.</p>;

  // El backend ya devuelve foto_path como URL completa.
  // Si falla la carga (archivo borrado del disco), cae al avatar genérico.
  const fotoSrc = imgError || !alumno.foto_path
    ? `https://i.pravatar.cc/150?img=${alumno.id ?? 1}`
    : alumno.foto_path;

  return (
    <div className="main-content alumnos-profile-layout">

      <header className="profile-top-bar">
        <button className="btn-back" onClick={() => navigate('/alumnos')}>
          <i className="fas fa-undo"></i> <span>Regresar</span>
        </button>
      </header>

      <div className="profile-header-card">
        <div className="profile-avatar">
          <img
            src={fotoSrc}
            alt={alumno.nombre}
            onError={() => setImgError(true)}
          />
        </div>
        <div className="profile-info">
          <h2>{alumno.nombre}</h2>
          <p>Correo: {alumno.email || 'No disponible'}</p>
          <p>Teléfono: {alumno.telefono || 'No disponible'}</p>
          <p>Estado: {alumno.estado || 'No disponible'}</p>
        </div>
      </div>

      <div className="profile-details-grid">

        <div className="detail-card">
          <h3 className="card-title">General</h3>
          <p>Disciplina: {alumno.disciplina}</p>
          <p>Membresía: {alumno.membresia || 'Sin membresía'}</p>
          <p>Precio: {alumno.precio_membresia ? `$${alumno.precio_membresia}` : 'N/A'}</p>
          <p>Horarios: {alumno.horarios?.join(', ') || 'No disponible'}</p>
        </div>

        <div className="detail-card">
          <h3 className="card-title">Finanzas</h3>
          <ul>
            {alumno.historialPagos?.length > 0
              ? alumno.historialPagos.map((p, i) => (
                  <li key={i}>
                    {p.fechaPago} — {p.estado} — ${p.monto}
                  </li>
                ))
              : <li>No hay pagos registrados</li>
            }
          </ul>
          <p><strong>Último pago:</strong> {alumno.ultimoPago}</p>
        </div>

        <div className="detail-card">
          <h3 className="card-title">Asistencia</h3>
          <ul>
            {alumno.asistencia?.length > 0
              ? alumno.asistencia.map((a, i) => (
                  <li key={i}>{a.fecha} — {a.clase}</li>
                ))
              : <li>No hay registros</li>
            }
          </ul>
        </div>

      </div>
    </div>
  );
}

export default Alumnos2;
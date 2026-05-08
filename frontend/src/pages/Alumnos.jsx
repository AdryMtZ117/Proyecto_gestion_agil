import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/App2_ModuloAlumnos.css';

// FIX: helper para mapear estado → clase CSS segura
const estadoClase = (estado) => {
  if (!estado) return '';
  const map = {
    'activo':    'activo',
    'inactivo':  'inactivo',
    'con deuda': 'con-deuda',
  };
  return map[estado.toLowerCase().trim()] ?? '';
};

import NotificationBell from '../components/NotificationBell';

function Alumnos() {
  const navigate = useNavigate();

<<<<<<< HEAD
    const [alumnos, setAlumnos] = useState([]);
    const [filtros, setFiltros] = useState({ nombres: [], disciplinas: [], estatus: [] });
    const [busqueda, setBusqueda] = useState('');
    const [filtroDisciplina, setFiltroDisciplina] = useState('');
    const [filtroEstatus, setFiltroEstatus] = useState('');
    const [clasesList, setClasesList] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '', apellidoP: '', apellidoM: '', telefono: '', correo_electronico: '', estado: 'activo', id_clase: ''
=======
  const [alumnos, setAlumnos]     = useState([]);
  const [filtros, setFiltros]     = useState({ nombres: [], disciplinas: [], estatus: [] });
  const [membresias, setMembresias] = useState([]);

  const [busqueda, setBusqueda]           = useState('');
  const [filtroNombre, setFiltroNombre]   = useState('');
  const [filtroDisciplina, setFiltroDisciplina] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('');

  const [showModal, setShowModal]               = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '', apellidoP: '', apellidoM: '',
    telefono: '', correo_electronico: '',
    estado: 'activo', id_membresia: '', foto: null
  });

  // ── Carga inicial ──────────────────────────────────────────────
  const fetchAlumnos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/alumnos1');
      setAlumnos(res.data.alumnos);
      setFiltros(res.data.filtros);
    } catch (err) { console.error(err); }
  };

  const fetchMembresias = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/alumnos1/membresias');
      setMembresias(res.data.membresias);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchAlumnos(); fetchMembresias(); }, []);

  // ── Modal formulario ───────────────────────────────────────────
  const handleOpenNew = () => {
    setFormData({ nombre:'', apellidoP:'', apellidoM:'', telefono:'',
      correo_electronico:'', estado:'activo', id_membresia:'', foto:null });
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (al) => {
    setFormData({
      nombre: al.nombre_real || '',
      apellidoP: al.apellidoP || '',
      apellidoM: al.apellidoM || '',
      telefono: al.telefono || '',
      correo_electronico: al.correo_electronico || '',
      estado: al.estado || 'activo',
      id_membresia: al.id_membresia || '',
      foto: null
>>>>>>> origin/Erick05
    });
    setEditingId(al.id);
    setShowModal(true);
  };

  const handleClose  = () => setShowModal(false);
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

<<<<<<< HEAD
    useEffect(() => {
        fetchAlumnos();
        axios.get('http://localhost:3000/api/alumnos1/clases')
            .then(res => setClasesList(res.data))
            .catch(err => console.error("Error fetching clases for alumnos", err));
    }, []);

    const handleOpenNew = () => {
        setFormData({ nombre: '', apellidoP: '', apellidoM: '', telefono: '', correo_electronico: '', estado: 'activo', id_clase: '' });
        setEditingId(null);
        setShowModal(true);
    };

    const handleOpenEdit = (al) => {
        setFormData({
            nombre: al.nombre_real || '',
            apellidoP: al.apellidoP || '',
            apellidoM: al.apellidoM || '',
            telefono: al.telefono || '',
            correo_electronico: al.correo_electronico || '',
            estado: al.estado || 'activo',
            id_clase: al.id_clase || ''
        });
        setEditingId(al.id);
        setShowModal(true);
    };
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nombre',             formData.nombre);
    data.append('apellidoP',          formData.apellidoP);
    data.append('apellidoM',          formData.apellidoM);
    data.append('telefono',           formData.telefono);
    data.append('correo_electronico', formData.correo_electronico);
    data.append('estado',             formData.estado);
    data.append('id_membresia',       formData.id_membresia);
    if (formData.foto) data.append('foto', formData.foto);

    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/api/alumnos1/${editingId}`, data);
      } else {
        await axios.post('http://localhost:3000/api/alumnos1', data);
      }
      setShowModal(false);
      fetchAlumnos();
    } catch (err) { console.error(err); }
  };

  // ── Borrado ────────────────────────────────────────────────────
  const handleDeleteRequest = (id) => { setDeleteId(id); setShowConfirmModal(true); };
>>>>>>> origin/Erick05

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/alumnos1/${deleteId}`);
      setShowConfirmModal(false);
      setDeleteId(null);
      fetchAlumnos();
    } catch (err) { console.error(err); }
  };

  const handleDeleteCancel = () => { setShowConfirmModal(false); setDeleteId(null); };

<<<<<<< HEAD
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:3000/api/alumnos1/${editingId}`, formData);
            } else {
                await axios.post('http://localhost:3000/api/alumnos1', formData);
            }
            setShowModal(false);
            fetchAlumnos();
        } catch (err) {
            console.error('Error guardando alumno', err);
            alert('Hubo un error al guardar o actualizar el alumno.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este alumno permanentemente?')) {
            try {
                await axios.delete(`http://localhost:3000/api/alumnos1/${id}`);
                fetchAlumnos();
            } catch (err) {
                console.error('Error eliminando alumno', err);
                alert('Hubo un error al eliminar el alumno.');
            }
        }
    };

    const alumnosFiltrados = alumnos.filter(a => 
        a.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
        (filtroDisciplina ? a.disciplina === filtroDisciplina : true) &&
        (filtroEstatus && a.estado ? a.estado.toLowerCase() === filtroEstatus.toLowerCase() : true)
    );

    return (
        <main className="main-content alumnos-layout">
            <header className="top-bar-simple">
                <div className="spacer"></div>
                <NotificationBell />
            </header>

            <div className="filters-section">
                <div className="search-container">
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Buscar alumno..." 
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>

                <div className="dropdowns-container">
                    <div className="custom-select">
                        <select onChange={e => setFiltroDisciplina(e.target.value)}>
                            <option value="">Disciplinas</option>
                            {filtros.disciplinas.map((d, i) => <option key={i} value={d}>{d}</option>)}
                        </select>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                    <div className="custom-select">
                        <select onChange={e => setFiltroEstatus(e.target.value)}>
                            <option value="">Estatus</option>
                            {filtros.estatus.map((e, i) => <option key={i} value={e}>{e}</option>)}
                        </select>
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
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnosFiltrados.map(al => (
                            <tr key={al.id}>
                                <td>
                                    <div className="avatar-small">
                                        <img src={`https://i.pravatar.cc/150?img=${al.id}`} alt="foto" />
                                    </div>
                                </td>
                                <td>{al.nombre}</td>
                                <td>{al.disciplina}</td>
                                <td>{al.fechaPago}</td>
                                <td>
                                    <span className={`status-dot ${al.estado?.toLowerCase() === 'activo' ? 'success' : al.estado?.toLowerCase() === 'con deuda' ? 'deuda' : 'danger'}`}></span>
                                    {al.estado}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="btn-icon" 
                                            title="Ver Perfil"
                                            onClick={() => navigate(`/alumnos/perfil/${al.id}`)}
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button 
                                            className="btn-icon edit-btn" 
                                            title="Editar"
                                            onClick={() => handleOpenEdit(al)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="btn-icon delete-btn" 
                                            title="Eliminar"
                                            onClick={() => handleDelete(al.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bottom-action">
                <button className="btn-lila" onClick={handleOpenNew}><i className="fas fa-plus"></i> Nuevo alumno</button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingId ? 'Editar Alumno' : 'Nuevo Alumno'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Apellido Paterno</label>
                                <input type="text" name="apellidoP" value={formData.apellidoP} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Apellido Materno</label>
                                <input type="text" name="apellidoM" value={formData.apellidoM} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Teléfono</label>
                                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input type="email" name="correo_electronico" value={formData.correo_electronico} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Estado</label>
                                <select name="estado" value={formData.estado} onChange={handleChange}>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="con deuda">Con Deuda</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Asignar a Clase</label>
                                <select name="id_clase" value={formData.id_clase} onChange={handleChange}>
                                    <option value="">Ninguna</option>
                                    {clasesList.map(c => (
                                        <option key={c.id_clase} value={c.id_clase}>{c.nombre} ({c.dias_semana})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleClose}>Cancelar</button>
                                <button type="submit" className="btn-save">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
=======
  // FIX: filtrado con normalización para evitar fallos por mayúsculas/espacios
  const alumnosFiltrados = alumnos.filter(a => {
    const nombre    = a.nombre?.toLowerCase() ?? '';
    const estado    = a.estado?.toLowerCase().trim() ?? '';
    const busq      = busqueda.toLowerCase();
    const filtroEst = filtroEstatus.toLowerCase().trim();

    return (
      nombre.includes(busq) &&
      (filtroNombre     ? a.nombre    === filtroNombre     : true) &&
      (filtroDisciplina ? a.disciplina === filtroDisciplina : true) &&
      (filtroEst        ? estado === filtroEst             : true)  // FIX
>>>>>>> origin/Erick05
    );
  });

  // ── Render ─────────────────────────────────────────────────────
  return (
    <main className="main-content alumnos-layout">

      <header className="top-bar-simple">
        <div className="spacer"></div>
        <div className="notification">
          <i className="fas fa-bell"></i>
        </div>
      </header>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-container">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar alumno..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="dropdowns-container">
          <div className="custom-select">
            <select onChange={(e) => setFiltroNombre(e.target.value)}>
              <option value="">Nombre</option>
              {filtros.nombres.map((n, i) => <option key={i} value={n}>{n}</option>)}
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>

          <div className="custom-select">
            <select onChange={(e) => setFiltroDisciplina(e.target.value)}>
              <option value="">Disciplinas</option>
              {filtros.disciplinas.map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>

          <div className="custom-select">
            <select onChange={(e) => setFiltroEstatus(e.target.value)}>
              <option value="">Estatus</option>
              {filtros.estatus.map((e, i) => <option key={i} value={e}>{e}</option>)}
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Disciplina</th>
              <th>Membresía</th>
              <th>Fecha de Pago</th>
              <th>Estatus</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {alumnosFiltrados.map(al => (
              <tr key={al.id}>
                <td>
                  <div className="avatar-small">
                    <img
                      src={al.foto_path || `https://i.pravatar.cc/150?img=${al.id}`}
                      alt="foto"
                    />
                  </div>
                </td>
                <td>{al.nombre}</td>
                <td>{al.disciplina}</td>
                <td>{al.membresia_nombre}</td>
                <td>{al.fechaPago}</td>
                <td>
                  {/* FIX: se usa estadoClase() para clase CSS válida */}
                  <span className={`status-dot ${estadoClase(al.estado)}`}></span>
                  {al.estado}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => navigate(`/alumnos/perfil/${al.id}`)}>
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn-icon edit-btn" onClick={() => handleOpenEdit(al)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn-icon delete-btn" onClick={() => handleDeleteRequest(al.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bottom-action">
        <button className="btn-lila" onClick={handleOpenNew}>
          <i className="fas fa-plus"></i> Nuevo alumno
        </button>
      </div>

      {/* Modal – Crear / Editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingId ? 'Editar Alumno' : 'Nuevo Alumno'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Apellido Paterno</label>
                <input name="apellidoP" value={formData.apellidoP} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Apellido Materno</label>
                <input name="apellidoM" value={formData.apellidoM} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input name="telefono" value={formData.telefono} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Correo</label>
                <input name="correo_electronico" type="email"
                  value={formData.correo_electronico} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Membresía</label>
                <select name="id_membresia" value={formData.id_membresia} onChange={handleChange}>
                  <option value="">Sin membresía</option>
                  {membresias.map((m) => (
                    <option key={m.id_membresia} value={m.id_membresia}>
                      {m.nombre} — ${m.precio} ({m.descripcion})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select name="estado" value={formData.estado} onChange={handleChange}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="con deuda">Con deuda</option>
                </select>
              </div>
              <div className="form-group">
                <label>Foto</label>
                <input type="file" accept="image/*"
                  onChange={(e) => setFormData({ ...formData, foto: e.target.files[0] })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleClose}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal – Confirmar borrado */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h2>¿Eliminar alumno?</h2>
            <p style={{ margin: '12px 0 24px' }}>
              Esta acción eliminará al alumno y todos sus registros vinculados. No se puede deshacer.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleDeleteCancel}>Cancelar</button>
              <button className="btn-save delete-btn" onClick={handleDeleteConfirm}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

export default Alumnos;
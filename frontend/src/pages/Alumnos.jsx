import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../style/App2_ModuloAlumnos.css'; 

function Alumnos() {
    const navigate = useNavigate();

    const [alumnos, setAlumnos] = useState([]);
    const [filtros, setFiltros] = useState({ nombres: [], disciplinas: [], estatus: [] });
    const [busqueda, setBusqueda] = useState('');
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroDisciplina, setFiltroDisciplina] = useState('');
    const [filtroEstatus, setFiltroEstatus] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '', apellidoP: '', apellidoM: '', telefono: '', correo_electronico: '', estado: 'activo'
    });

    const fetchAlumnos = () => {
        axios.get('http://localhost:3000/api/alumnos1')
            .then(res => {
                setAlumnos(res.data.alumnos);
                setFiltros(res.data.filtros);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchAlumnos();
    }, []);

    const handleOpenNew = () => {
        setFormData({ nombre: '', apellidoP: '', apellidoM: '', telefono: '', correo_electronico: '', estado: 'activo' });
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
            estado: al.estado || 'activo'
        });
        setEditingId(al.id);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
        (filtroNombre ? a.nombre === filtroNombre : true) &&
        (filtroDisciplina ? a.disciplina === filtroDisciplina : true) &&
        (filtroEstatus ? a.estado === filtroEstatus : true)
    );

    return (
        <main className="main-content alumnos-layout">
            <header className="top-bar-simple">
                <div className="spacer"></div>
                <div className="notification">
                    <i className="fas fa-bell"></i>
                </div>
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
                        <select onChange={e => setFiltroNombre(e.target.value)}>
                            <option value="">Nombre</option>
                            {filtros.nombres.map((n, i) => <option key={i} value={n}>{n}</option>)}
                        </select>
                        <i className="fas fa-chevron-down"></i>
                    </div>
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
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleClose}>Cancelar</button>
                                <button type="submit" className="btn-save">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Alumnos;
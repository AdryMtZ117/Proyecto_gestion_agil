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

    useEffect(() => {
        axios.get('http://localhost:3000/api/alumnos1')
            .then(res => {
                setAlumnos(res.data.alumnos);
                setFiltros(res.data.filtros);
            })
            .catch(err => console.error(err));
    }, []);

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
                                    <span className={`status-dot ${al.estado === 'Activo' ? 'success' : al.estado === 'Con deuda' ? 'deuda' : 'danger'}`}></span>
                                    {al.estado}
                                </td>
                                <td>
                                    <button 
                                        className="btn-lila" 
                                        onClick={() => navigate(`/alumnos/perfil/${al.id}`)}
                                    >
                                        <i className="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bottom-action">
                <button className="btn-lila"><i className="fas fa-plus"></i> Nuevo alumno</button>
            </div>
        </main>
    );
}

export default Alumnos;
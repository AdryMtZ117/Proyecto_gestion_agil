import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Alumnos from './pages/Alumnos';
import Finanzas from './pages/Finanzas';
import Sidebar from './components/Sidebar';
import Alumnos2 from './pages/Alumnos2';
import Finanzas2 from './pages/Finanzas2';

import './App.css';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/alumnos" element={<Alumnos />} />
                <Route path="/finanzas" element={<Finanzas />} />
                <Route path="/alumnos/perfil" element={<Alumnos2 />} />
                <Route path="/finanzas2" element={<Finanzas2 />} />
                <Route path="/asistencias" element={<main className="main-content"><h2>Próximamente</h2></main>} />
            </Routes>
        </Layout>
    );
}

export default App;
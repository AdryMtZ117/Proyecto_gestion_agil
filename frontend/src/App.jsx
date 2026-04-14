import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Alumnos from './pages/Alumnos';
import Finanzas from './pages/Finanzas';
import Sidebar from './components/Sidebar';
import Alumnos2 from './pages/Alumnos2';
import Finanzas2 from './pages/Finanzas2';
import Asistencias from './pages/Asistencias';
import Reportes from './pages/Reportes';
import Clases from './pages/Clases';

import './App.css';

//NOTA SE CAMBIO EL PATH DE ALUMNOS PERFIL PARA PODER RECIBIR EL ID DEL ALUMNO

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/alumnos" element={<Alumnos />} />
                <Route path="/finanzas" element={<Finanzas />} />
                <Route path="/alumnos/perfil/:id" element={<Alumnos2 />} />
                <Route path="/finanzas2" element={<Finanzas2 />} />
                <Route path="/asistencias" element={<Asistencias />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/clases" element={<Clases />} />
            </Routes>
        </Layout>
    );
}

export default App;
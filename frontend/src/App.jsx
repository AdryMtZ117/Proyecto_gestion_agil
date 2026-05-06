import { Routes, Route, Navigate } from 'react-router-dom';
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
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout><Dashboard /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/alumnos" element={
                <ProtectedRoute>
                    <Layout><Alumnos /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/finanzas" element={
                <ProtectedRoute>
                    <Layout><Finanzas /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/alumnos/perfil/:id" element={
                <ProtectedRoute>
                    <Layout><Alumnos2 /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/finanzas2" element={
                <ProtectedRoute>
                    <Layout><Finanzas2 /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/asistencias" element={
                <ProtectedRoute>
                    <Layout><Asistencias /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/reportes" element={
                <ProtectedRoute adminOnly={true}>
                    <Layout><Reportes /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/clases" element={
                <ProtectedRoute>
                    <Layout><Clases /></Layout>
                </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
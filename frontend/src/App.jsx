import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Korena ruta preusmerava direktno na /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Stvarna ruta za Login formu */}
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard ruta */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
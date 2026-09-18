import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      {/* Toast dodatno mi pomaze kod testiranja i primanja poruka i potvrdi */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
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
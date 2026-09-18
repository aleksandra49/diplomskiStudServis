import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 30px', backgroundColor: '#222', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Grb ubačen u navbar */}
        <img 
          src="https://ssluzba.ftn.uns.ac.rs/ssluzbasp/images/grb00.gif" 
          alt="Grb" 
          style={{ height: '35px', width: 'auto' }} 
        />
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Studentski Servis ({user.uloga || user.role}: {user.username})
        </div>
      </div>
      <button 
        onClick={handleLogout} 
        style={{ padding: '8px 16px', backgroundColor: 'grey', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Odjava
      </button>
    </nav>
  );
};

export default Navbar;
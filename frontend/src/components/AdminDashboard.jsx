import React, { useState } from 'react';
import AdminPredmeti from './AdminPredmeti';
import AdminNastavnici from './AdminNastavnici';
import AdminStudenti from './AdminStudenti';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profil');

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Admin Panel (Studentska služba)</h2>
      
      {/* Navigacioni tabovi */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #eaeaea', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button style={tabStyle(activeTab === 'profil')} onClick={() => setActiveTab('profil')}>Lični podaci</button>
        <button style={tabStyle(activeTab === 'predmeti')} onClick={() => setActiveTab('predmeti')}>Predmeti</button>
        <button style={tabStyle(activeTab === 'nastavnici')} onClick={() => setActiveTab('nastavnici')}>Nastavnici</button>
        <button style={tabStyle(activeTab === 'studenti')} onClick={() => setActiveTab('studenti')}>Studenti</button>
        <button style={tabStyle(activeTab === 'rokovi')} onClick={() => setActiveTab('rokovi')}>Ispitni rokovi</button>
        <button style={tabStyle(activeTab === 'ocene')} onClick={() => setActiveTab('ocene')}>Odobravanje ocena</button>
      </div>

      {/* Sadržaj tabova */}
      <div>
        {activeTab === 'profil' && (
          <div style={{ padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Podaci o administratoru</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <p><strong>ID korisnika:</strong> {user?.id}</p>
              <p><strong>Korisničko ime:</strong> {user?.username || user?.korisnickoIme}</p>
              <p><strong>Uloga:</strong> {user?.uloga || user?.role}</p>
            </div>
          </div>
        )}

        {activeTab === 'predmeti' && (
          <AdminPredmeti />
        )}

        {activeTab === 'nastavnici' && (
          <AdminNastavnici />
        )}

        {activeTab === 'studenti' && (
          <AdminStudenti />
        )}

        {activeTab === 'rokovi' && (
          <div style={{ padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Kreiranje ispitnih rokova</h3>
            <p style={{ color: '#666' }}>Ovde se definišu rokovi (npr. Januar, Jun, Septembar...).</p>
          </div>
        )}

        {activeTab === 'ocene' && (
          <div style={{ padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Odobravanje ocena</h3>
            <p style={{ color: '#666' }}>Pregled unetih ocena od strane profesora koje čekaju odobrenje studentske službe.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const tabStyle = (isActive) => ({
  padding: '10px 18px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: isActive ? '#007bff' : '#f1f3f5',
  color: isActive ? '#fff' : '#495057',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px'
});

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { getStudentByKorisnikId } from '../api/studentService';
import StudentPohadjanja from './StudentPohadjanja'; 
import StudentIspiti from './StudentIspiti';
import StudentPrijave from './StudentPrijave';
import FinansijskaKartica from './FinansijskaKartica';
import StudentDokumenti from './StudentDokumenti'; 

const StudentDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profil');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const osveziPodatke = () => {
    if (user?.id) {
      getStudentByKorisnikId(user.id)
        .then((response) => {
          setStudent(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Greška pri učitavanju podataka o studentu:", err);
          setError("Nije moguće učitati podatke o studentu.");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    osveziPodatke();
  }, [user]);

  if (loading) return <div style={{ padding: '20px' }}>Učitavanje podataka...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px', flexWrap: 'wrap' }}>
        <button style={tabStyle(activeTab === 'profil')} onClick={() => setActiveTab('profil')}>Lični podaci</button>
        <button style={tabStyle(activeTab === 'pohadjanja')} onClick={() => setActiveTab('pohadjanja')}>Pohađanja</button>
        <button style={tabStyle(activeTab === 'ispiti')} onClick={() => setActiveTab('ispiti')}>Ispiti i Ocene</button>
        <button style={tabStyle(activeTab === 'prijave')} onClick={() => setActiveTab('prijave')}>Prijava / Odjava ispita</button>
        <button style={tabStyle(activeTab === 'finansije')} onClick={() => setActiveTab('finansije')}>Finansijska kartica</button>
        <button style={tabStyle(activeTab === 'dokumenti')} onClick={() => setActiveTab('dokumenti')}>Moji dokumenti</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {student && (
        <div>
          {activeTab === 'profil' && (
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3>Lični podaci studenta</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' }}>
                <p><strong>Ime:</strong> {student.ime}</p>
                <p><strong>Prezime:</strong> {student.prezime}</p>
                <p><strong>Broj indeksa:</strong> {student.brojIndeksa}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Godina studija:</strong> {student.godinaStudija}. godina</p>
                <p><strong>Stanje na računu:</strong> {student.stanjeRacuna} RSD</p>
              </div>
            </div>
          )}
          
          {activeTab === 'pohadjanja' && (
            <StudentPohadjanja studentId={student.id} />
          )}

          {activeTab === 'ispiti' && (
            <StudentIspiti studentId={student.id} />
          )}

          {activeTab === 'prijave' && (
            <StudentPrijave studentId={student.id} />
          )}

          {activeTab === 'finansije' && (
            <FinansijskaKartica 
              studentId={student.id} 
              stanjeRacuna={student.stanjeRacuna} 
              onUplataUspesna={osveziPodatke} 
            />
          )}

          {activeTab === 'dokumenti' && (
            <StudentDokumenti studentId={student.id} />
          )}
        </div>
      )}
    </div>
  );
};

const tabStyle = (isActive) => ({
  padding: '10px 16px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: isActive ? '#007bff' : '#e0e0e0',
  color: isActive ? '#fff' : '#000',
  cursor: 'pointer',
  fontWeight: isActive ? 'bold' : 'normal'
});

export default StudentDashboard;
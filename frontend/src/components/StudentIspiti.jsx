import React, { useState, useEffect } from 'react';
import { getPolaganjaByStudentId } from '../api/ispitiService';

const StudentIspiti = ({ studentId }) => {
  const [polaganja, setPolaganja] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      getPolaganjaByStudentId(studentId)
        .then((res) => {
          setPolaganja(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Greška pri dohvatanju ispita:", err);
          setLoading(false);
        });
    }
  }, [studentId]);

  if (loading) return <div>Učitavanje ocena i ispita...</div>;

  const polozeni = polaganja.filter(p => p.ocena && p.ocena > 5);
  const nepolozeni = polaganja.filter(p => !p.ocena || p.ocena <= 5);

  const proseks = polozeni.length > 0 
    ? (polozeni.reduce((acc, curr) => acc + curr.ocena, 0) / polozeni.length).toFixed(2)
    : '0.00';

  const ukupnoEspb = polozeni.reduce((acc, curr) => acc + (curr.espb || curr.predmet?.espb || 6), 0);

  return (
    <div>
      <h3>Ispiti i Ocene</h3>
      
      {/* Sumarni prikaz */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1, padding: '15px', backgroundColor: '#e7f1ff', borderRadius: '8px', textAlign: 'center' }}>
          <small>Prosečna ocena</small>
          <h2>{proseks}</h2>
        </div>
        <div style={{ flex: 1, padding: '15px', backgroundColor: '#e2f0d9', borderRadius: '8px', textAlign: 'center' }}>
          <small>Ukupno osvojeno ESPB</small>
          <h2>{ukupnoEspb} B</h2>
        </div>
      </div>

      {/* Tabela Položeni Ispiti */}
      <h4>Položeni ispiti ({polozeni.length})</h4>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Predmet</th>
            <th>Ispitni rok</th>
            <th>Ocena</th>
            <th>ESPB</th>
          </tr>
        </thead>
        <tbody>
          {polozeni.length > 0 ? polozeni.map(p => (
            <tr key={p.id}>
              <td>{p.predmetNaziv || p.predmet?.naziv || `Predmet #${p.predmetId}`}</td>
              <td>{p.ispitniRok || 'Redovni'}</td>
              <td><strong>{p.ocena}</strong></td>
              <td>{p.espb || 6}</td>
            </tr>
          )) : (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Nema položenih ispita.</td></tr>
          )}
        </tbody>
      </table>

      {/* Tabela Nepoloženi / Neprijavljeni */}
      <h4>Nepoloženi / Prijavljeni ispiti ({nepolozeni.length})</h4>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Predmet</th>
            <th>Ispitni rok</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {nepolozeni.length > 0 ? nepolozeni.map(p => (
            <tr key={p.id}>
              <td>{p.predmetNaziv || p.predmet?.naziv || `Predmet #${p.predmetId}`}</td>
              <td>{p.ispitniRok || 'Predstojeći'}</td>
              <td>{p.ocena === 5 ? 'Nije položio' : 'Prijavljen'}</td>
            </tr>
          )) : (
            <tr><td colSpan="3" style={{ textAlign: 'center' }}>Nema nepoloženih ili prijavljenih ispita.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentIspiti;
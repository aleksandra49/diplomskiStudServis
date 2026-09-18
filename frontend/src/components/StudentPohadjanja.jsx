import React, { useState, useEffect } from 'react';
import { getPohadjanjaByStudentId } from '../api/pohadjanjaService';

const StudentPohadjanja = ({ studentId }) => {
  const [pohadjanja, setPohadjanja] = useState([]);
  const [selectedPohadjanje, setSelectedPohadjanje] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      getPohadjanjaByStudentId(studentId)
        .then((res) => {
          setPohadjanja(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Greška pri učitavanju pohađanja:", err);
          setLoading(false);
        });
    }
  }, [studentId]);

  if (loading) return <div>Učitavanje predmeta...</div>;

  return (
    <div>
      <h3>Pohađanje predmeta</h3>

      {pohadjanja.length === 0 ? (
        <p>Trenutno nemate prijavljenih predmeta za pohađanje.</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Lista predmeta */}
          <div style={{ flex: 1 }}>
            <p><i>Kliknite na predmet za prikaz detalja:</i></p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {pohadjanja.map((item) => (
                <li
                  key={item.id}
                  onClick={() => setSelectedPohadjanje(item)}
                  style={{
                    padding: '12px',
                    margin: '8px 0',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: selectedPohadjanje?.id === item.id ? '#e7f1ff' : '#fff',
                    borderColor: selectedPohadjanje?.id === item.id ? '#007bff' : '#ccc'
                  }}
                >
                  <strong>{item.predmetNaziv || item.predmet?.naziv || `Predmet #${item.predmetId}`}</strong>
                </li>
              ))}
            </ul>
          </div>

          {/* Detalji o izabranom predmetu */}
          <div style={{ flex: 1, padding: '16px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}>
            {selectedPohadjanje ? (
              <div>
                <h4>Detalji o predmetu</h4>
                <hr />
                <p><strong>Naziv predmeta:</strong> {selectedPohadjanje.predmetNaziv || selectedPohadjanje.predmet?.naziv}</p>
                <p><strong>Profesor:</strong> {selectedPohadjanje.profesorImePrezime || selectedPohadjanje.predmet?.profesor || 'Nije dodeljen'}</p>
                <p><strong>ESPB bodovi:</strong> {selectedPohadjanje.espb || selectedPohadjanje.predmet?.espb || 6}</p>
                <p><strong>Semestar:</strong> {selectedPohadjanje.semestar || selectedPohadjanje.predmet?.semestar || 1}. semestar</p>
                <p><strong>Školska godina:</strong> {selectedPohadjanje.skolskaGodina || '2025/2026'}</p>
              </div>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>Izaberite predmet sa liste sa leve strane da vidite detalje.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPohadjanja;
import React, { useState, useEffect } from 'react';
import { getPohadjanjaByStudentId } from '../api/pohadjanjaService';
import { getProfesorZaPredmet } from '../api/predmetiService';

const StudentPohadjanja = ({ studentId }) => {
  const [pohadjanja, setPohadjanja] = useState([]);
  const [selectedPohadjanje, setSelectedPohadjanje] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nazivProfesora, setNazivProfesora] = useState('Nije dodeljen');
  const [loadingProfesor, setLoadingProfesor] = useState(false);

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

  // Funkcija kada se klikne na predmet
  const handleSelectPredmet = async (item) => {
    setSelectedPohadjanje(item);
    setNazivProfesora('Učitavanje...');
    setLoadingProfesor(true);

    const predmetId = item.predmetId || item.predmet?.id;
    if (predmetId) {
      try {
        const predavanja = await getProfesorZaPredmet(predmetId);
        // Nalazimo onog ko ima ulogu PROFESOR
        const profesor = Array.isArray(predavanja) 
          ? predavanja.find(p => p.ulogaNaPredmetu === 'PROFESOR') 
          : null;

        if (profesor && (profesor.nastavnikImePrezime || profesor.nastavnikIme)) {
          setNazivProfesora(profesor.nastavnikImePrezime || `${profesor.nastavnikIme} ${profesor.nastavnikPrezime}`);
        } else {
          setNazivProfesora('Nije dodeljen');
        }
      } catch (error) {
        console.error("Greška pri dobavljanju profesora:", error);
        setNazivProfesora('Nije dodeljen');
      } finally {
        setLoadingProfesor(false);
      }
    } else {
      setNazivProfesora('Nije dodeljen');
      setLoadingProfesor(false);
    }
  };

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
                  onClick={() => handleSelectPredmet(item)}
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
                <p><strong>Profesor:</strong> {loadingProfesor ? 'Učitavanje...' : nazivProfesora}</p>
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
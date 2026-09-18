import React, { useState, useEffect } from 'react';
import { getNastavnikByKorisnikId, getPredmetiByNastavnik } from '../api/nastavnikService';
import { getStudentiPoPredmetu } from '../api/pohadjanjaService';
import { getSvaPolaganja, unosOcene, getPolaganjaPoPredmetu } from '../api/ispitiService';

const NastavnikDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profil');
  const [nastavnik, setNastavnik] = useState(null);
  const [predmeti, setPredmeti] = useState([]);
  
  // Stanja za studente izabranog predmeta
  const [selectedPredmetId, setSelectedPredmetId] = useState(null);
  const [studentiPredmeta, setStudentiPredmeta] = useState([]);
  const [loadingStudenti, setLoadingStudenti] = useState(false);

  // Stanja za tab "Ispiti i ocene"
  const [selectedPredmetIspiti, setSelectedPredmetIspiti] = useState(null);
  const [prijaveStudenata, setPrijaveStudenata] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      getNastavnikByKorisnikId(user.id)
        .then((response) => {
          const nastavnikData = response.data;
          setNastavnik(nastavnikData);
          return getPredmetiByNastavnik(nastavnikData.id);
        })
        .then((predmetiResponse) => {
          setPredmeti(predmetiResponse.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Greška pri učitavanju:", err);
          setError("Nije moguće učitati podatke o nastavniku.");
          setLoading(false);
        });
    }
  }, [user]);

  // Funkcija koja učitava studente za selektovani predmet
  const handlePrikaziStudente = (predmetId) => {
    setSelectedPredmetId(predmetId);
    setLoadingStudenti(true);
    getStudentiPoPredmetu(predmetId)
      .then((res) => {
        setStudentiPredmeta(res.data);
        setLoadingStudenti(false);
      })
      .catch((err) => {
        console.error("Greška pri učitavanju studenata:", err);
        setLoadingStudenti(false);
      });
  };

  // Funkcija za učitavanje prijava studenata po predmetu (za tab Ispiti i ocene)
  const handleUcitajPrijaveZaPredmet = (predmetId) => {
    setSelectedPredmetIspiti(predmetId);
    
    getPolaganjaPoPredmetu(predmetId)
      .then((res) => {
        setPrijaveStudenata(res.data);
      })
      .catch((err) => {
        console.error("Greška pri učitavanju prijava ispita:", err);
        setPrijaveStudenata([]);
      });
  };

  // Funkcija za čuvanje ocene preko servisa
  const handleSacuvajOcenu = (prijavaId) => {
    const inputElement = document.getElementById(`ocena-${prijavaId}`);
    const unetaOcena = inputElement ? Number(inputElement.value) : '';
    
    if (!unetaOcena || unetaOcena < 5 || unetaOcena > 10) {
      alert("Molimo unesite validnu ocenu između 5 i 10.");
      return;
    }

    unosOcene(prijavaId, unetaOcena)
      .then(() => {
        alert(`Ocena ${unetaOcena} je uspešno sačuvana!`);
        // Opciono osveži podatke
        handleUcitajPrijaveZaPredmet(selectedPredmetIspiti);
      })
      .catch((err) => {
        console.error("Greška pri čuvanju ocene:", err);
        alert("Došlo je do greške prilikom čuvanja ocene.");
      });
  };

  if (loading) return <div style={{ padding: '20px' }}>Učitavanje podataka...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Navigacioni Meni / Tabovi */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        <button style={tabStyle(activeTab === 'profil')} onClick={() => setActiveTab('profil')}>Lični podaci</button>
        <button style={tabStyle(activeTab === 'predmeti')} onClick={() => setActiveTab('predmeti')}>Predmeti i studenti</button>
        <button style={tabStyle(activeTab === 'ispiti')} onClick={() => setActiveTab('ispiti')}>Ispiti i ocene</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {nastavnik && (
        <div>
          {activeTab === 'profil' && (
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3>Lični podaci nastavnika</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' }}>
                <p><strong>Ime:</strong> {nastavnik.ime}</p>
                <p><strong>Prezime:</strong> {nastavnik.prezime}</p>
                <p><strong>Email:</strong> {nastavnik.email}</p>
                <p><strong>Zvanje:</strong> {nastavnik.zvanje}</p>
              </div>
            </div>
          )}

          {activeTab === 'predmeti' && (
            <div>
              <h3>Predmeti koje predajem</h3>
              <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ textAlign: 'left' }}>Naziv predmeta</th>
                    <th style={{ textAlign: 'center' }}>ESPB</th>
                    <th style={{ textAlign: 'center' }}>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {predmeti.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', color: '#6c757d' }}>
                        Trenutno nemate dodeljenih predmeta.
                      </td>
                    </tr>
                  ) : (
                    predmeti.map((p) => (
                      <tr key={p.id}>
                        <td>{p.naziv}</td>
                        <td style={{ textAlign: 'center' }}>{p.espb}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => handlePrikaziStudente(p.id)}
                            style={{ 
                              padding: '6px 12px', 
                              backgroundColor: selectedPredmetId === p.id ? '#5a6268' : 'grey', 
                              color: '#fff', 
                              border: 'none', 
                              borderRadius: '4px', 
                              cursor: 'pointer' 
                            }}
                          >
                            {selectedPredmetId === p.id ? 'Sakupi / Osveži studente' : 'Prikaži studente'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Sekcija za prikaz studenata izabranog predmeta */}
              {selectedPredmetId && (
                <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
                  <h4>Studenti koji pohađaju izabrani predmet:</h4>
                  {loadingStudenti ? (
                    <p>Učitavam studente...</p>
                  ) : studentiPredmeta.length === 0 ? (
                    <p style={{ color: '#6c757d' }}>Nema upisanih studenata za ovaj predmet.</p>
                  ) : (
                    <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#e9ecef' }}>
                          <th>ID Pohađanja</th>
                          <th>Podaci o studentu (Indeks, Ime, Prezime)</th>
                          <th>Školska godina</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentiPredmeta.map((s) => (
                          <tr key={s.id}>
                            <td style={{ textAlign: 'center' }}>{s.id}</td>
                            <td style={{ textAlign: 'center' }}>{s.studentIndeksIme || `${s.student?.indeks || ''} - ${s.student?.ime || ''} ${s.student?.prezime || ''}`}</td>
                            <td style={{ textAlign: 'center' }}>{s.skolskaGodina}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ispiti' && (
            <div>
              <h3>Ispitni rokovi i prijave studenata</h3>
              <p>Izaberite predmet da vidite prijave ispita i unesete ocene:</p>
              
              {/* Lista predmeta sa dinamičkom promenom boje aktivnog dugmeta */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {predmeti.map((p) => {
                  const isSelected = selectedPredmetIspiti === p.id;
                  return (
                    <button 
                      key={p.id} 
                      onClick={() => handleUcitajPrijaveZaPredmet(p.id)}
                      style={{ 
                        padding: '8px 16px', 
                        backgroundColor: isSelected ? '#004085' : '#17a2b8', 
                        color: '#fff', 
                        border: isSelected ? '2px solid #000' : 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontWeight: isSelected ? 'bold' : 'normal'
                      }}
                    >
                      {p.naziv}
                    </button>
                  );
                })}
              </div>

              {/* Tabela sa prijavljenim studentima za izabrani predmet */}
              {selectedPredmetIspiti && (
                <div>
                  <h4>Prijavljeni studenti</h4>
                  <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ textAlign: 'center' }}>Indeks i Student</th>
                        <th style={{ textAlign: 'center' }}>Ispitni rok</th>
                        <th style={{ textAlign: 'center' }}>Unesi ocenu</th>
                        <th style={{ textAlign: 'center' }}>Status / Akcija</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prijaveStudenata.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: '#6c757d' }}>
                            Nema prijavljenih studenata za ovaj predmet.
                          </td>
                        </tr>
                      ) : (
                        prijaveStudenata.map((prijava) => (
                          <tr key={prijava.id}>
                            <td style={{ textAlign: 'center' }}>
                              {/* Ispravljeno: direktno čita studentIndeks */}
                              {prijava.studentIndeks || 'N/A'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {/* Ispravljeno: ispitniRok je string sa bekenda */}
                              {prijava.ispitniRok || 'N/A'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <input 
                                type="number" 
                                min="5" 
                                max="10" 
                                defaultValue={prijava.ocena || ''}
                                id={`ocena-${prijava.id}`}
                                style={{ width: '60px', textAlign: 'center', padding: '4px' }}
                              />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button 
                                onClick={() => handleSacuvajOcenu(prijava.id)}
                                style={{ padding: '6px 12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Sačuvaj ocenu
                              </button>
                              <span style={{ display: 'block', fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                {prijava.ocena ? 'Ocena uneta' : 'Čeka ocenu'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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

export default NastavnikDashboard;
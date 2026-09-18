import React, { useState, useEffect } from 'react';
import { getNaziviRokova, getPrijaveZaRok, prijavaIspita } from '../api/ispitiService'; // Prilagodi putanju do tvog servisa
import { getStudenti } from '../api/studentiService'; // Putanja do studenata
import { getPredmeti } from '../api/predmetiService'; // Putanja do predmeta

const AdminIspitniRokovi = () => {
  const [rokovi, setRokovi] = useState([]);
  const [izabraniRok, setIzabraniRok] = useState('');
  const [prijave, setPrijave] = useState([]);

  // Podaci za formu za dodavanje nove prijave (predmeta u rok)
  const [studenti, setStudenti] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedPredmet, setSelectedPredmet] = useState('');
  const [noviNazivRoka, setNoviNazivRoka] = useState('');

  useEffect(() => {
    ucitajRokoveIInicijalnePodatke();
  }, []);

  const ucitajRokoveIInicijalnePodatke = async () => {
    try {
      const resRokovi = await getNaziviRokova();
      setRokovi(resRokovi.data);
      if (resRokovi.data.length > 0) {
        setIzabraniRok(resRokovi.data[0]);
        ucitajPrijaveZaRok(resRokovi.data[0]);
      }

      const resStud = await getStudenti();
      setStudenti(resStud.data);
      if (resStud.data.length > 0) setSelectedStudent(resStud.data[0].id);

      const resPred = await getPredmeti();
      setPredmeti(resPred.data);
      if (resPred.data.length > 0) setSelectedPredmet(resPred.data[0].id);

    } catch (error) {
      console.error("Greška pri učitavanju podataka:", error);
    }
  };

  const ucitajPrijaveZaRok = async (rok) => {
    try {
      const res = await getPrijaveZaRok(rok);
      setPrijave(res.data);
    } catch (error) {
      console.error("Greška pri učitavanju prijava za rok:", error);
      setPrijave([]);
    }
  };

  const handlePromenaRoka = (e) => {
    const rok = e.target.value;
    setIzabraniRok(rok);
    ucitajPrijaveZaRok(rok);
  };

  const handleDodajPrijavu = async (e) => {
    e.preventDefault();
    const rokZaSlanje = noviNazivRoka.trim() !== '' ? noviNazivRoka : izabraniRok;
    
    if (!rokZaSlanje) {
      alert('Molimo unesite ili izaberite ispitni rok.');
      return;
    }

    try {
      await prijavaIspita({
        studentId: selectedStudent,
        predmetId: selectedPredmet,
        ispitniRok: rokZaSlanje
      });
      alert('Uspešno dodata prijava / predmet u ispitni rok!');
      setNoviNazivRoka('');
      ucitajRokoveIInicijalnePodatke();
      if (rokZaSlanje) {
        setIzabraniRok(rokZaSlanje);
        ucitajPrijaveZaRok(rokZaSlanje);
      }
    } catch (error) {
      console.error("Greška pri dodavanju prijave:", error);
      alert('Došlo je do greške (proverite da li student ima dovoljno sredstava na računu).');
    }
  };

  return (
    <div style={{ padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', marginTop: '20px' }}>
      <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Upravljanje ispitnim rokovima i prijavama</h3>

      {/* Forma za dodavanje predmeta / prijave u ispitni rok */}
      <div style={{ marginBottom: '25px', padding: '15px', background: '#fff', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Dodaj studenta / predmet u ispitni rok</h4>
        <form onSubmit={handleDodajPrijavu} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'end' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Student:</label>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} style={inputStyle}>
              {studenti.map(s => (
                <option key={s.id} value={s.id}>{s.brojIndeksa} - {s.ime} {s.prezime}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Predmet:</label>
            <select value={selectedPredmet} onChange={(e) => setSelectedPredmet(e.target.value)} style={inputStyle}>
              {predmeti.map(p => (
                <option key={p.id} value={p.id}>{p.naziv}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Naziv roka (postojeći ili novi):</label>
            <input 
              type="text" 
              value={noviNazivRoka} 
              onChange={(e) => setNoviNazivRoka(e.target.value)} 
              placeholder={izabraniRok || "npr. Januar 2027"} 
              style={inputStyle} 
            />
          </div>

          <button type="submit" style={btnPrimaryStyle}>Dodaj u rok</button>
        </form>
      </div>

      {/* Filtriranje i prikaz prijava po roku */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Izaberi ispitni rok za pregled:</label>
        <select value={izabraniRok} onChange={handlePromenaRoka} style={{ ...inputStyle, width: '250px' }}>
          {rokovi.map((rok, idx) => (
            <option key={idx} value={rok}>{rok}</option>
          ))}
        </select>
      </div>

      {/* Tabela prijavljenih studenata */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={thTdStyle}>Indeks</th>
              <th style={thTdStyle}>Student</th>
              <th style={thTdStyle}>Predmet</th>
              <th style={thTdStyle}>Datum prijave</th>
              <th style={thTdStyle}>Status</th>
              <th style={thTdStyle}>Ocena</th>
            </tr>
          </thead>
          <tbody>
            {prijave.length > 0 ? (
              prijave.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  
                  {(() => {
            const pronadjeniStudent = studenti.find(s => s.id === p.studentId);
                return (
                 <>
                    <td style={thTdStyle}>{pronadjeniStudent ? pronadjeniStudent.brojIndeksa : '-'}</td>
                    <td style={thTdStyle}>{pronadjeniStudent ? `${pronadjeniStudent.ime} ${pronadjeniStudent.prezime}` : `Student ID: ${p.studentId}`}</td>
                </>
                );
                })()}
                  <td style={thTdStyle}>{p.predmetNaziv}</td>
                  <td style={thTdStyle}>{p.datumPrijave}</td>
                  <td style={thTdStyle}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '12px', background: p.status === 'POLOŽIO' ? '#d4edda' : '#fff3cd', color: p.status === 'POLOŽIO' ? '#155724' : '#856404' }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={thTdStyle}>{p.ocena !== null ? p.ocena : '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '15px', color: '#666' }}>Nema prijavljenih studenata za ovaj ispitni rok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px',
  boxSizing: 'border-box'
};

const btnPrimaryStyle = {
  padding: '9px 15px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: '600',
  height: '38px'
};

const thTdStyle = {
  padding: '12px',
  fontSize: '14px',
  color: '#333'
};

export default AdminIspitniRokovi;
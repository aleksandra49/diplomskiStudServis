import React, { useState, useEffect } from 'react';
import { 
  getNastavnici, 
  dodajNastavnika, 
  obrisiNastavnika, 
  dodeliPredmetNastavniku, 
  getPredmetiZaNastavnika, 
  ukloniPredavanjeSaNastavnika 
} from '../api/nastavniciService';
import { getPredmeti } from '../api/predmetiService';

const AdminNastavnici = () => {
  const [nastavnici, setNastavnici] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [zvanje, setZvanje] = useState('Profesor');

  const [selectedNastavnik, setSelectedNastavnik] = useState('');
  const [selectedPredmet, setSelectedPredmet] = useState('');
  const [ulogaNaPredmetu, setUlogaNaPredmetu] = useState('PROFESOR');

  const [aktivniProfesorPredmeti, setAktivniProfesorPredmeti] = useState([]);
  const [prikazaniProfesor, setPrikazaniProfesor] = useState(null);

  useEffect(() => {
    ucitajPodatke();
  }, []);

  const ucitajPodatke = async () => {
    try {
      const resNastavnici = await getNastavnici();
      setNastavnici(resNastavnici.data);

      const resPredmeti = await getPredmeti();
      setPredmeti(resPredmeti.data);
      
      if (resNastavnici.data.length > 0) {
        setSelectedNastavnik(resNastavnici.data[0].id);
      }
      if (resPredmeti.data.length > 0) {
        setSelectedPredmet(resPredmeti.data[0].id);
      }
    } catch (error) {
      console.error("Greška pri učitavanju podataka:", error);
    }
  };

  const handleSubmitNastavnik = async (e) => {
    e.preventDefault();
    try {
      await dodajNastavnika({ ime, prezime, email, zvanje });
      setIme('');
      setPrezime('');
      setEmail('');
      ucitajPodatke();
      alert('Nastavnik uspešno dodat!');
    } catch (error) {
      console.error("Greška pri dodavanju nastavnika:", error);
      alert('Došlo je do greške.');
    }
  };

  const handleObrisi = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog nastavnika?')) {
      try {
        await obrisiNastavnika(id);
        ucitajPodatke();
      } catch (error) {
        console.error("Greška pri brisanju:", error);
      }
    }
  };

  const handleDodeliPredmet = async (e) => {
    e.preventDefault();
    try {
      await dodeliPredmetNastavniku({
        nastavnikId: selectedNastavnik,
        predmetId: selectedPredmet,
        ulogaNaPredmetu: ulogaNaPredmetu
      });
      alert('Predmet uspešno dodeljen nastavniku!');
      if (prikazaniProfesor && prikazaniProfesor.id == selectedNastavnik) {
        vidiPredmeteZaNastavnika(prikazaniProfesor);
      }
    } catch (error) {
      console.error("Greška pri dodeli predmeta:", error);
      alert('Greška pri dodeli predmeta.');
    }
  };

  const vidiPredmeteZaNastavnika = async (nastavnik) => {
    setPrikazaniProfesor(nastavnik);
    try {
      const res = await getPredmetiZaNastavnika(nastavnik.id);
      setAktivniProfesorPredmeti(res.data);
    } catch (error) {
      console.error("Greška pri dobijanju predmeta za nastavnika:", error);
      setAktivniProfesorPredmeti([]);
    }
  };

  // Nova funkcija za uklanjanje nastavnika sa predmeta
  const handleUkloniSaPredmeta = async (predavanjeId) => {
    if (window.confirm('Da li ste sigurni da želite da uklonite nastavnika sa ovog predmeta?')) {
      try {
        await ukloniPredavanjeSaNastavnika(predavanjeId);
        // Osveži listu predmeta za trenutno izabranog profesora
        vidiPredmeteZaNastavnika(prikazaniProfesor);
      } catch (error) {
        console.error("Greška pri uklanjanju sa predmeta:", error);
        alert('Došlo je do greške prilikom uklanjanja.');
      }
    }
  };

  return (
    <div style={{ padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Upravljanje nastavnicima i dodela predmeta</h3>

      {/* Forma za dodavanje novog nastavnika */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#fff', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Dodaj novog nastavnika</h4>
        <form onSubmit={handleSubmitNastavnik} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Ime:</label>
            <input type="text" value={ime} onChange={(e) => setIme(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Prezime:</label>
            <input type="text" value={prezime} onChange={(e) => setPrezime(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Zvanje:</label>
            <select value={zvanje} onChange={(e) => setZvanje(e.target.value)} style={inputStyle}>
              <option value="Profesor">Profesor</option>
              <option value="Asistent">Asistent</option>
              <option value="Redovni profesor">Redovni profesor</option>
              <option value="Vanredni profesor">Vanredni profesor</option>
            </select>
          </div>
          <button type="submit" style={btnPrimaryStyle}>Sačuvaj nastavnika</button>
        </form>
      </div>

      {/* Forma za dodelu predmeta */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#fff', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Dodeli predmet nastavniku</h4>
        <form onSubmit={handleDodeliPredmet} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Nastavnik:</label>
            <select value={selectedNastavnik} onChange={(e) => setSelectedNastavnik(e.target.value)} style={inputStyle}>
              {nastavnici.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.ime} {n.prezime} ({n.zvanje})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Predmet:</label>
            <select value={selectedPredmet} onChange={(e) => setSelectedPredmet(e.target.value)} style={inputStyle}>
              {predmeti.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.naziv}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Uloga na predmetu:</label>
            <select value={ulogaNaPredmetu} onChange={(e) => setUlogaNaPredmetu(e.target.value)} style={inputStyle}>
              <option value="PROFESOR">PROFESOR</option>
              <option value="ASISTENT">ASISTENT</option>
            </select>
          </div>
          <button type="submit" style={btnPrimaryStyle}>Dodeli predmet</button>
        </form>
      </div>

      {/* Tabela svih nastavnika */}
      <h4 style={{ color: '#333', marginBottom: '10px' }}>Lista nastavnika (klikni na ime za pregled predmeta)</h4>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={thTdStyle}>ID</th>
              <th style={thTdStyle}>Ime i prezime</th>
              <th style={thTdStyle}>Email</th>
              <th style={thTdStyle}>Zvanje</th>
              <th style={thTdStyle}>Korisnik ID</th>
              <th style={thTdStyle}>Akcija</th>
            </tr>
          </thead>
          <tbody>
            {nastavnici.map((n) => (
              <tr key={n.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={thTdStyle}>{n.id}</td>
                <td style={{ ...thTdStyle, color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => vidiPredmeteZaNastavnika(n)}>
                  {n.ime} {n.prezime}
                </td>
                <td style={thTdStyle}>{n.email}</td>
                <td style={thTdStyle}>{n.zvanje}</td>
                <td style={thTdStyle}>{n.korisnikId || n.korisnik?.id || 'N/A'}</td>
                <td style={thTdStyle}>
                  <button onClick={() => handleObrisi(n.id)} style={btnDangerStyle}>Obriši</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Prikaz predmeta za izabranog profesora u obliku tabele sa dugmetom za uklanjanje */}
      {prikazaniProfesor && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '6px', border: '1px solid #b8daff' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#004085' }}>
            Predmeti koje predaje: {prikazaniProfesor.ime} {prikazaniProfesor.prezime}
          </h4>
          {aktivniProfesorPredmeti.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: '#cfe2ff', textAlign: 'left', borderBottom: '2px solid #b8daff' }}>
                  <th style={thTdStyle}>R.br.</th>
                  <th style={thTdStyle}>Naziv predmeta</th>
                  <th style={thTdStyle}>Uloga</th>
                  <th style={thTdStyle}>Akcija</th>
                </tr>
              </thead>
              <tbody>
                {aktivniProfesorPredmeti.map((p, index) => (
                  <tr key={p.id || index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={thTdStyle}>{index + 1}</td>
                    <td style={thTdStyle}>{p.predmetNaziv || p.naziv}</td>
                    <td style={thTdStyle}><strong>{p.ulogaNaPredmetu}</strong></td>
                    <td style={thTdStyle}>
                      <button 
                        onClick={() => handleUkloniSaPredmeta(p.id)} 
                        style={btnDangerStyle}
                      >
                        Ukloni
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Ovaj nastavnik trenutno nema dodeljenih predmeta.</p>
          )}
        </div>
      )}
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
  fontWeight: '600'
};

const btnDangerStyle = {
  padding: '5px 10px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

const thTdStyle = {
  padding: '12px',
  fontSize: '14px',
  color: '#333'
};

export default AdminNastavnici;
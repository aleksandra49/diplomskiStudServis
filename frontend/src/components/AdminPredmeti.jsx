import React, { useState, useEffect } from 'react';
import { getPredmeti, dodajPredmet, obrisiPredmet, getNastavniciZaPredmet } from '../api/predmetiService';

const AdminPredmeti = () => {
  const [predmeti, setPredmeti] = useState([]);
  const [naziv, setNaziv] = useState('');
  const [espb, setEspb] = useState('6');
  const [godina, setGodina] = useState('1');

  // State za pretragu
  const [searchQuery, setSearchQuery] = useState('');

  const [prikazaniPredmet, setPrikazaniPredmet] = useState(null);
  const [nastavniciNaPredmetu, setNastavniciNaPredmetu] = useState([]);

  useEffect(() => {
    ucitajPredmete();
  }, []);

  const ucitajPredmete = async () => {
    try {
      const res = await getPredmeti();
      setPredmeti(res.data);
    } catch (error) {
      console.error("Greška pri učitavanju predmeta:", error);
    }
  };

  // Funkcija za pretragu predmeta po nazivu
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      ucitajPredmete();
      return;
    }

    try {
      const res = await getPredmeti();
      const filtered = res.data.filter(p => 
        p.naziv.toLowerCase().includes(query.toLowerCase())
      );
      setPredmeti(filtered);
    } catch (error) {
      console.error("Greška pri pretrazi predmeta:", error);
    }
  };

  const handleSubmitPredmet = async (e) => {
    e.preventDefault();
    try {
      await dodajPredmet({
        naziv,
        espb: parseInt(espb, 10),
        godina: parseInt(godina, 10)
      });
      setNaziv('');
      setEspb('6');
      setGodina('1');
      setSearchQuery('');
      ucitajPredmete();
      alert('Predmet uspešno dodat!');
    } catch (error) {
      console.error("Greška pri dodavanju predmeta:", error);
      alert('Došlo je do greške.');
    }
  };

  const handleObrisiPredmet = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj predmet?')) {
      try {
        await obrisiPredmet(id);
        ucitajPredmete();
        if (prikazaniPredmet && prikazaniPredmet.id === id) {
          setPrikazaniPredmet(null);
          setNastavniciNaPredmetu([]);
        }
      } catch (error) {
        console.error("Greška pri brisanju predmeta:", error);
        alert('Došlo je do greške pri brisanju.');
      }
    }
  };

  const vidiNastavnikeZaPredmet = async (predmet) => {
    setPrikazaniPredmet(predmet);
    try {
      const res = await getNastavniciZaPredmet(predmet.id);
      setNastavniciNaPredmetu(res.data);
    } catch (error) {
      console.error("Greška pri dobijanju nastavnika za predmet:", error);
      setNastavniciNaPredmetu([]);
    }
  };

  return (
    <div style={{ padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Upravljanje predmetima</h3>

      {/* Forma za dodavanje predmeta */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#fff', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Dodaj novi predmet</h4>
        <form onSubmit={handleSubmitPredmet} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Naziv predmeta:</label>
            <input type="text" value={naziv} onChange={(e) => setNaziv(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>ESPB:</label>
            <input type="number" min="1" max="30" value={espb} onChange={(e) => setEspb(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Godina:</label>
            <input type="number" min="1" max="6" value={godina} onChange={(e) => setGodina(e.target.value)} required style={inputStyle} />
          </div>
          <button type="submit" style={btnPrimaryStyle}>Sačuvaj predmet</button>
        </form>
      </div>

      {/* Sekcija za pretragu i tabela predmeta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ color: '#333', margin: 0 }}>Lista predmeta (klikni na naziv predmeta da vidiš ko ga predaje)</h4>
        <input 
          type="text" 
          placeholder="Pretraži po nazivu predmeta..." 
          value={searchQuery}
          onChange={handleSearch}
          style={{ padding: '8px 12px', width: '250px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={thTdStyle}>ID</th>
              <th style={thTdStyle}>Naziv predmeta</th>
              <th style={thTdStyle}>ESPB</th>
              <th style={thTdStyle}>Godina</th>
              <th style={thTdStyle}>Akcija</th>
            </tr>
          </thead>
          <tbody>
            {predmeti.length > 0 ? (
              predmeti.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={thTdStyle}>{p.id}</td>
                  <td style={{ ...thTdStyle, color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => vidiNastavnikeZaPredmet(p)}>
                    {p.naziv}
                  </td>
                  <td style={thTdStyle}>{p.espb}</td>
                  <td style={thTdStyle}>{p.godina}</td>
                  <td style={thTdStyle}>
                    <button onClick={() => handleObrisiPredmet(p.id)} style={btnDangerStyle}>Obriši</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '15px', color: '#666' }}>Nema pronađenih predmeta.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Prikaz nastavnika koji predaju izabrani predmet */}
      {prikazaniPredmet && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '6px', border: '1px solid #b8daff' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#004085' }}>
            Nastavnici koji predaju predmet: {prikazaniPredmet.naziv}
          </h4>
          {nastavniciNaPredmetu.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: '#cfe2ff', textAlign: 'left', borderBottom: '2px solid #b8daff' }}>
                  <th style={thTdStyle}>R.br.</th>
                  <th style={thTdStyle}>Ime i prezime nastavnika</th>
                  <th style={thTdStyle}>Zvanje</th>
                  <th style={thTdStyle}>Uloga</th>
                </tr>
              </thead>
              <tbody>
                {nastavniciNaPredmetu.map((n, index) => (
                  <tr key={n.id || index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={thTdStyle}>{index + 1}</td>
                    <td style={thTdStyle}>{n.nastavnikImePrezime || `${n.ime || ''} ${n.prezime || ''}`.trim() || 'N/A'}</td>
                    <td style={thTdStyle}>{n.zvanje || 'N/A'}</td>
                    <td style={thTdStyle}><strong>{n.ulogaNaPredmetu}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Trenutno nijedan nastavnik nije dodeljen ovom predmetu.</p>
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

export default AdminPredmeti;
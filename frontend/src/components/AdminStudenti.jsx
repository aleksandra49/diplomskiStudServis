import React, { useState, useEffect } from 'react';
import { 
  getStudenti, 
  dodajStudenta, 
  obrisiStudenta, 
  pretraziStudentePoIndeksu,
  dodeliPredmetStudentu, 
  getPredmetiZaStudenta, 
  ukloniPohadjanjeStudenta 
} from '../api/studentiService';
import { getPredmeti } from '../api/predmetiService';

const AdminStudenti = () => {
  const [studenti, setStudenti] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [brojIndeksa, setBrojIndeksa] = useState('');
  const [godinaStudija, setGodinaStudija] = useState('1');
  const [stanjeRacuna, setStanjeRacuna] = useState('0.0');
  
  // State za pretragu
  const [searchIndeks, setSearchIndeks] = useState('');

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedPredmet, setSelectedPredmet] = useState('');

  const [aktivniStudentPredmeti, setAktivniStudentPredmeti] = useState([]);
  const [prikazaniStudent, setPrikazaniStudent] = useState(null);

  useEffect(() => {
    ucitajPodatke();
  }, []);

  const ucitajPodatke = async () => {
    try {
      const resStudenti = await getStudenti();
      setStudenti(resStudenti.data);

      const resPredmeti = await getPredmeti();
      setPredmeti(resPredmeti.data);
      
      if (resStudenti.data.length > 0 && !selectedStudent) {
        setSelectedStudent(resStudenti.data[0].id);
      }
      if (resPredmeti.data.length > 0 && !selectedPredmet) {
        setSelectedPredmet(resPredmeti.data[0].id);
      }
    } catch (error) {
      console.error("Greška pri učitavanju podataka za studente:", error);
    }
  };

  // Funkcija za pretragu po indeksu
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchIndeks(query);

    if (query.trim() === "") {
      ucitajPodatke();
      return;
    }

    try {
      const res = await pretraziStudentePoIndeksu(query);
      setStudenti(res.data);
    } catch (error) {
      console.error("Greška pri pretrazi studenata:", error);
    }
  };

  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    try {
      const noviStudent = {
        ime,
        prezime,
        email,
        brojIndeksa,
        godinaStudija: parseInt(godinaStudija, 10),
        stanjeRacuna: parseFloat(stanjeRacuna) || 0.0
      };

      await dodajStudenta(noviStudent);
      setIme('');
      setPrezime('');
      setEmail('');
      setBrojIndeksa('');
      setGodinaStudija('1');
      setStanjeRacuna('0.0');
      setSearchIndeks('');
      ucitajPodatke();
      alert('Student uspešno dodat!');
    } catch (error) {
      console.error("Greška pri dodavanju studenta:", error);
      alert('Došlo je do greške. Proveri da li je broj indeksa jedinstven.');
    }
  };

  const handleObrisiStudenta = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog studenta?')) {
      try {
        await obrisiStudenta(id);
        ucitajPodatke();
        if (prikazaniStudent && prikazaniStudent.id === id) {
          setPrikazaniStudent(null);
          setAktivniStudentPredmeti([]);
        }
      } catch (error) {
        console.error("Greška pri brisanju studenta:", error);
        alert('Došlo je do greške pri brisanju studenta.');
      }
    }
  };

  const handleDodeliPredmet = async (e) => {
    e.preventDefault();
    try {
      await dodeliPredmetStudentu({
        studentId: selectedStudent,
        predmetId: selectedPredmet
      });
      alert('Predmet uspešno dodeljen studentu!');
      if (prikazaniStudent && String(prikazaniStudent.id) === String(selectedStudent)) {
        vidiPredmeteZaStudenta(prikazaniStudent);
      }
    } catch (error) {
      console.error("Greška pri dodeli predmeta studentu:", error);
      alert('Greška pri dodeli predmeta.');
    }
  };

  const vidiPredmeteZaStudenta = async (student) => {
    setPrikazaniStudent(student);
    try {
      const res = await getPredmetiZaStudenta(student.id);
      setAktivniStudentPredmeti(res.data);
    } catch (error) {
      console.error("Greška pri dobijanju predmeta za studenta:", error);
      setAktivniStudentPredmeti([]);
    }
  };

  const handleUkloniSaPredmeta = async (pohadjanjeId) => {
    if (window.confirm('Da li ste sigurni da želite da uklonite studenta sa ovog predmeta?')) {
      try {
        await ukloniPohadjanjeStudenta(pohadjanjeId);
        vidiPredmeteZaStudenta(prikazaniStudent);
      } catch (error) {
        console.error("Greška pri uklanjanju studenta sa predmeta:", error);
        alert('Došlo je do greške prilikom uklanjanja.');
      }
    }
  };

  return (
    <div style={{ padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Upravljanje studentima i pohađanje predmeta</h3>

      {/* Forma za dodavanje novog studenta */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#fff', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Dodaj novog studenta</h4>
        <form onSubmit={handleSubmitStudent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', alignItems: 'end' }}>
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
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Broj indeksa:</label>
            <input type="text" value={brojIndeksa} onChange={(e) => setBrojIndeksa(e.target.value)} required style={inputStyle} placeholder="npr. E1/2023" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Godina studija:</label>
            <input type="number" min="1" max="6" value={godinaStudija} onChange={(e) => setGodinaStudija(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Stanje računa:</label>
            <input type="number" step="0.01" value={stanjeRacuna} onChange={(e) => setStanjeRacuna(e.target.value)} style={inputStyle} />
          </div>
          <button type="submit" style={btnPrimaryStyle}>Sačuvaj studenta</button>
        </form>
      </div>

      {/* Forma za dodelu predmeta studentu (pohađanje) */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#fff', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Dodeli predmet studentu (Pohađanje)</h4>
        <form onSubmit={handleDodeliPredmet} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Student:</label>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} style={inputStyle}>
              {studenti.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.ime} {s.prezime} ({s.brojIndeksa})
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
          <button type="submit" style={btnPrimaryStyle}>Dodeli predmet</button>
        </form>
      </div>

      {/* Sekcija za pretragu i tabela studenata */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ color: '#333', margin: 0 }}>Lista studenata (klikni na ime za pregled profila i predmeta)</h4>
        <input 
          type="text" 
          placeholder="Pretraži po broju indeksa..." 
          value={searchIndeks}
          onChange={handleSearch}
          style={{ padding: '8px 12px', width: '250px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={thTdStyle}>ID</th>
              <th style={thTdStyle}>Ime i prezime</th>
              <th style={thTdStyle}>Broj indeksa</th>
              <th style={thTdStyle}>Email</th>
              <th style={thTdStyle}>Godina</th>
              <th style={thTdStyle}>Stanje</th>
              <th style={thTdStyle}>Akcija</th>
            </tr>
          </thead>
          <tbody>
            {studenti.length > 0 ? (
              studenti.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={thTdStyle}>{s.id}</td>
                  <td style={{ ...thTdStyle, color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => vidiPredmeteZaStudenta(s)}>
                    {s.ime} {s.prezime}
                  </td>
                  <td style={thTdStyle}>{s.brojIndeksa}</td>
                  <td style={thTdStyle}>{s.email}</td>
                  <td style={thTdStyle}>{s.godinaStudija}</td>
                  <td style={thTdStyle}>{s.stanjeRacuna} RSD</td>
                  <td style={thTdStyle}>
                    <button onClick={() => handleObrisiStudenta(s.id)} style={btnDangerStyle}>Obriši</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '15px', color: '#666' }}>Nema pronađenih studenata.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detaljan prikaz izabranog studenta (Profil + Predmeti) */}
      {prikazaniStudent && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e8f4fd', borderRadius: '6px', border: '1px solid #b8daff' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#004085' }}>
            Dosije studenta: {prikazaniStudent.ime} {prikazaniStudent.prezime} ({prikazaniStudent.brojIndeksa})
          </h4>

          {/* Lični podaci / Profil kartica sa svim informacijama */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #b8daff' }}>
            <div><strong>Ime i prezime:</strong> {prikazaniStudent.ime} {prikazaniStudent.prezime}</div>
            <div><strong>Broj indeksa:</strong> {prikazaniStudent.brojIndeksa}</div>
            <div><strong>Email:</strong> {prikazaniStudent.email}</div>
            <div><strong>Godina studija:</strong> {prikazaniStudent.godinaStudija}. godina</div>
            <div><strong>Stanje računa:</strong> {prikazaniStudent.stanjeRacuna} RSD</div>
          </div>

          <h5 style={{ margin: '0 0 10px 0', color: '#004085' }}>Predmeti koje student pohađa:</h5>
          {aktivniStudentPredmeti.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: '#cfe2ff', textAlign: 'left', borderBottom: '2px solid #b8daff' }}>
                  <th style={thTdStyle}>R.br.</th>
                  <th style={thTdStyle}>Naziv predmeta</th>
                  <th style={thTdStyle}>Akcija</th>
                </tr>
              </thead>
              <tbody>
                {aktivniStudentPredmeti.map((p, index) => (
                  <tr key={p.id || index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={thTdStyle}>{index + 1}</td>
                    <td style={thTdStyle}>{p.predmetNaziv || p.naziv}</td>
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
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Ovaj student trenutno ne pohađa nijedan predmet.</p>
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

export default AdminStudenti;
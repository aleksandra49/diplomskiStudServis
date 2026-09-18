import React, { useState, useEffect } from 'react';
import { getPohadjanjaByStudentId } from '../api/pohadjanjaService';
import { getPolaganjaByStudentId, prijavaIspita, odjavaIspita } from '../api/ispitiService';

const StudentPrijave = ({ studentId }) => {
  const [pohadjanja, setPohadjanja] = useState([]);
  const [prijavljeniIspiti, setPrijavljeniIspiti] = useState([]);
  const [ispitniRok, setIspitniRok] = useState('Januarski');
  const [loading, setLoading] = useState(true);
  const [poruka, setPoruka] = useState({ tip: '', tekst: '' });

  const CENA_ISPITA = 200;

  const ucitajPodatke = () => {
    setLoading(true);
    Promise.all([
      getPohadjanjaByStudentId(studentId),
      getPolaganjaByStudentId(studentId)
    ])
      .then(([pohadjanjaRes, polaganjaRes]) => {
        setPohadjanja(pohadjanjaRes.data);
        setPrijavljeniIspiti(polaganjaRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Greška pri učitavanju prijava:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (studentId) ucitajPodatke();
  }, [studentId]);

  const normalizujRok = (rokStr) => {
    if (!rokStr) return '';
    return rokStr.toLowerCase().replace('rok', '').trim();
  };

  const handlePrijava = (predmetId) => {
    setPoruka({ tip: '', tekst: '' });

    const prijavaDTO = {
      studentId: studentId,
      predmetId: predmetId,
      ispitniRok: ispitniRok
    };

    prijavaIspita(prijavaDTO)
      .then(() => {
        setPoruka({ tip: 'uspesno', tekst: `Ispit je uspešno prijavljen za ${ispitniRok} rok!` });
        ucitajPodatke();
      })
      .catch((err) => {
        console.error("Greška pri prijavi ispita:", err);
        setPoruka({ tip: 'greska', tekst: 'Došlo je do greške pri prijavi ispita.' });
      });
  };

  const handleOdjava = (polaganjeId) => {
    setPoruka({ tip: '', tekst: '' });

    odjavaIspita(polaganjeId)
      .then(() => {
        setPoruka({ tip: 'uspesno', tekst: 'Ispit je uspešno odjavljen!' });
        ucitajPodatke();
      })
      .catch((err) => {
        console.error("Greška pri odjavi ispita:", err);
        setPoruka({ tip: 'greska', tekst: 'Došlo je do greške pri odjavi ispita.' });
      });
  };

  if (loading) return <div>Učitavanje ponuđenih ispita...</div>;

  return (
    <div>
      <h3>Prijava i Odjava Ispita</h3>

      {poruka.tekst && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          borderRadius: '4px',
          backgroundColor: poruka.tip === 'uspesno' ? '#d4edda' : '#f8d7da',
          color: poruka.tip === 'uspesno' ? '#155724' : '#721c24'
        }}>
          {poruka.tekst}
        </div>
      )}

      {/* Izbor ispitnog roka */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
        <label htmlFor="rok-select"><strong>Aktivni ispitni rok: </strong></label>
        <select 
          id="rok-select"
          value={ispitniRok} 
          onChange={(e) => {
            setIspitniRok(e.target.value);
            setPoruka({ tip: '', tekst: '' });
          }}
          style={{ padding: '6px 12px', marginLeft: '10px' }}
        >
          <option value="Januarski">Januarski rok</option>
          <option value="Februarski">Februarski rok</option>
          <option value="Junski">Junski rok</option>
          <option value="Septembarski">Septembarski rok</option>
        </select>
      </div>

      {/* Tabela predmeta */}
      <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ textAlign: 'left' }}>Predmet</th>
            <th style={{ textAlign: 'left' }}>Profesor</th>
            <th style={{ textAlign: 'center' }}>ESPB</th>
            <th style={{ textAlign: 'center' }}>Cena prijave</th>
            <th style={{ textAlign: 'center' }}>Status / Akcija ({ispitniRok})</th>
          </tr>
        </thead>
        <tbody>
          {pohadjanja.map((p) => {
            const trenutniPredmetId = p.predmetId || p.predmet?.id;

            const svaPolaganja = prijavljeniIspiti.filter(
              item => (item.predmetId || item.predmet?.id) === trenutniPredmetId
            );

            const polozeno = svaPolaganja.find(
              item => item.ocena !== null && item.ocena !== undefined && Number(item.ocena) > 5
            );

            const prijavaZaAktivniRok = svaPolaganja.find(
              item => normalizujRok(item.ispitniRok || item.rok) === normalizujRok(ispitniRok) &&
                      (!item.ocena || Number(item.ocena) <= 5)
            );

            const prijavaZaDrugiRok = svaPolaganja.find(
              item => normalizujRok(item.ispitniRok || item.rok) !== normalizujRok(ispitniRok) &&
                      (!item.ocena || Number(item.ocena) <= 5)
            );

            const aktivnoPolaganje = prijavaZaAktivniRok || prijavaZaDrugiRok;

            return (
              <tr key={p.id}>
                <td>{p.predmetNaziv || p.predmet?.naziv || `Predmet #${trenutniPredmetId}`}</td>
                <td>{p.profesorImePrezime || p.predmet?.profesor || 'Nije naznačen'}</td>
                <td style={{ textAlign: 'center' }}>{p.espb || p.predmet?.espb || 6}</td>
                <td style={{ textAlign: 'center' }}>{CENA_ISPITA} RSD</td>
                <td style={{ textAlign: 'center' }}>
                  {polozeno ? (
                    <span style={{ color: '#4b5563', fontWeight: '500' }}>
                      Položen (Ocena: {polozeno.ocena})
                    </span>
                  ) : aktivnoPolaganje ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <span style={{ color: '#888888', fontWeight: 'normal' }}>
                        Prijavljen ({aktivnoPolaganje.ispitniRok || aktivnoPolaganje.rok})
                      </span>
                      {/* Dugme za odjavu u plavoj boji */}
                      <button
                        onClick={() => handleOdjava(aktivnoPolaganje.id)}
                        style={{
                          padding: '4px 12px',
                          backgroundColor: '#60a5fa',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 'normal'
                        }}
                      >
                        Odjavi
                      </button>
                    </div>
                  ) : (
                    /* Dugme za prijavu u plavoj boji */
                    <button
                      onClick={() => handlePrijava(trenutniPredmetId)}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#60a5fa',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'normal'
                      }}
                    >
                      Prijavi ispit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentPrijave;
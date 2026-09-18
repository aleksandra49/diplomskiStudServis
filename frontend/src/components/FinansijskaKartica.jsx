import React, { useState, useEffect } from 'react';
import { getTransakcijeByStudentId } from '../api/transakcijeService';
import UplataForma from './UplataForma';

const FinansijskaKartica = ({ studentId, stanjeRacuna, onUplataUspesna }) => {
  const [transakcije, setTransakcije] = useState([]);
  const [loading, setLoading] = useState(true);

  const FAKT_RACUN = '840-12345678-90';
  const POZIV_NA_BROJ = '97 12345 - BrojIndeksa';

  const ucitajTransakcije = () => {
    setLoading(true);
    getTransakcijeByStudentId(studentId)
      .then((res) => {
        setTransakcije(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Greška pri učitavanju transakcija:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (studentId) {
      ucitajTransakcije();
    }
  }, [studentId]);

  if (loading) return <div>Učitavanje finansijske kartice...</div>;

  return (
    <div>
      <h3>Finansijska kartica</h3>

      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#e9ecef', 
        borderRadius: '6px',
        border: '1px solid #ced4da'
      }}>
        <h4 style={{ margin: '0 0 10px 0', fontWeight: 'normal' }}>Instrukcije za uplatu:</h4>
        <p style={{ margin: '5px 0' }}>Račun fakulteta: {FAKT_RACUN}</p>
        <p style={{ margin: '5px 0' }}>Poziv na broj: {POZIV_NA_BROJ}</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ flex: 1, padding: '16px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
          <h4 style={{ margin: '0 0 10px 0', fontWeight: 'normal' }}>Trenutno stanje na računu:</h4>
          <span style={{ fontSize: '24px', fontWeight: 'normal' }}>
            {stanjeRacuna} RSD
          </span>
        </div>
        
        <div style={{ flex: 1 }}>
          <UplataForma studentId={studentId} onUplataUspesna={() => {
            ucitajTransakcije();
            if (onUplataUspesna) onUplataUspesna();
          }} />
        </div>
      </div>

      <h4>Istorija transakcija</h4>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ textAlign: 'left', fontWeight: 'bold' }}>Datum i vreme</th>
            <th style={{ textAlign: 'left', fontWeight: 'bold' }}>Opis</th>
            <th style={{ textAlign: 'center', fontWeight: 'bold' }}>Tip</th>
            <th style={{ textAlign: 'right', fontWeight: 'bold' }}>Iznos (RSD)</th>
          </tr>
        </thead>
        <tbody>
          {transakcije.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: '#6c757d' }}>
                Nema zabeleženih transakcija.
              </td>
            </tr>
          ) : (
            transakcije.map((t) => (
              <tr key={t.id}>
                <td>{t.datum ? t.datum.replace('T', ' ') : 'N/A'}</td>
                <td>{t.opis}</td>
                <td style={{ textAlign: 'center' }}>
                  <span>
                    {t.tip}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {t.iznos > 0 ? `+${t.iznos}` : t.iznos} RSD
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FinansijskaKartica;
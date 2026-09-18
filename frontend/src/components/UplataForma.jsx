import React, { useState } from 'react';
import { izvrsiUplatu } from '../api/transakcijeService';

const UplataForma = ({ studentId, onUplataUspesna }) => {
  const [iznos, setIznos] = useState('');
  const [opis, setOpis] = useState('');
  const [poruka, setPoruka] = useState('');
  const [greska, setGreska] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPoruka('');
    setGreska('');

    if (!iznos || Number(iznos) <= 0) {
      setGreska('Iznos mora biti veći od 0.');
      return;
    }

    try {
      await izvrsiUplatu({
        studentId: Number(studentId),
        iznos: parseFloat(iznos),
        opis: opis || 'Uplata na račun'
      });
      setPoruka('Uplata je uspešno proknjižena!');
      setIznos('');
      setOpis('');
      if (onUplataUspesna) onUplataUspesna();
    } catch (err) {
      setGreska('Greška pri obradi uplate.');
    }
  };

  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px' }}>
      <h3>Uplata na račun studenta</h3>
      {poruka && <p style={{ color: 'green' }} role="alert">{poruka}</p>}
      {greska && <p style={{ color: 'red' }} role="alert">{greska}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="iznos-input">Iznos (RSD):</label>
          <input
            id="iznos-input"
            type="number"
            value={iznos}
            onChange={(e) => setIznos(e.target.value)}
            placeholder="Unesite iznos"
          />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label htmlFor="opis-input">Opis / Svrha:</label>
          <input
            id="opis-input"
            type="text"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            placeholder="Npr. Uplata školarine"
          />
        </div>
        <button type="submit">Uplati</button>
      </form>
    </div>
  );
};

export default UplataForma;
import React, { useState, useEffect } from 'react';
import { getDokumentiPoStudentu } from '../api/dokumentiService';

const StudentDokumenti = ({ studentId }) => {
  const [dokumenti, setDokumenti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      getDokumentiPoStudentu(studentId)
        .then((res) => {
          setDokumenti(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Greška pri učitavanju dokumenata:", err);
          setLoading(false);
        });
    }
  }, [studentId]);

  if (loading) return <p>Učitavam dokumente...</p>;

  return (
    <div>
      <h3>Moji elektronski dokumenti i šabloni</h3>
      {dokumenti.length === 0 ? (
        <p style={{ color: '#6c757d' }}>Nemate pridruženih dokumenata.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Naziv dokumenta</th>
              <th>Tip</th>
              <th>Datum otpremanja</th>
              <th>Akcija</th>
            </tr>
          </thead>
          <tbody>
            {dokumenti.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.naziv}</td>
                <td style={{ textAlign: 'center' }}>{doc.tipDokumenta || 'N/A'}</td>
                <td style={{ textAlign: 'center' }}>{doc.datumOtpremanja || 'N/A'}</td>
                <td style={{ textAlign: 'center' }}>
                  {doc.urlDokumenta ? (
                    <a href={doc.urlDokumenta} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
                      Preuzmi
                    </a>
                  ) : (
                    'Nema fajla'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentDokumenti;
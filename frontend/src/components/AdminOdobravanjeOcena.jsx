import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOdobravanjeOcena = () => {
    const [prijave, setPrijave] = useState([]);
    const [loading, setLoading] = useState(true);

    // Funkcija koja učitava sve prijave ispita
    const fetchPrijave = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8081/api/ispiti');
            // Filtriramo samo one koje čekaju odobrenje (ili možeš prikazati sve pa filtrirati tabelarno)
            // Ovde uzimamo sve, a u tabeli ćemo istaći one sa statusom ČEKA_ODOBRENJE
            setPrijave(response.data);
        } catch (error) {
            console.error("Greška pri učitavanju ispita:", error);
            alert("Došlo je do greške prilikom učitavanja prijava.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrijave();
    }, []);

    // Funkcija za odobravanje ocene
    const odobriOcenu = async (id) => {
        try {
            await axios.put(`http://localhost:8081/api/ispiti/odobri/${id}`);
            alert('Ocena je uspešno odobrena i upisana!');
            fetchPrijave(); // Osveži listu
        } catch (error) {
            console.error("Greška pri odobravanju ocene:", error);
            alert("Došlo je do greške prilikom odobravanja ocene.");
        }
    };

    if (loading) {
        return <p>Učitavanje...</p>;
    }

    // Možemo filtrirati da vidimo samo one kojima treba odobrenje, ili prikazati sve sa statusom
    const prijaveZaOdobrenje = prijave.filter(p => p.status === 'ČEKA_ODOBRENJE');

    return (
        <div style={{ padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Odobravanje ocena</h3>
            <p style={{ color: '#666' }}>Pregled unetih ocena od strane profesora koje čekaju odobrenje studentske službe.</p>

            {prijaveZaOdobrenje.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#888' }}>Trenutno nema ocena koje čekaju odobrenje.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#fff' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f1f3f5', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Indeks</th>
                            <th style={{ padding: '12px' }}>Predmet</th>
                            <th style={{ padding: '12px' }}>Ispitni rok</th>
                            <th style={{ padding: '12px' }}>Bodovi</th>
                            <th style={{ padding: '12px' }}>Ocena</th>
                            <th style={{ padding: '12px' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prijaveZaOdobrenje.map((prijava) => (
                            <tr key={prijava.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                <td style={{ padding: '12px' }}>{prijava.studentIndeks}</td>
                                <td style={{ padding: '12px' }}>{prijava.predmetNaziv}</td>
                                <td style={{ padding: '12px' }}>{prijava.ispitniRok}</td>
                                <td style={{ padding: '12px' }}>{prijava.bodovi !== null ? prijava.bodovi : '-'}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{prijava.ocena !== null ? prijava.ocena : '-'}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ 
                                        padding: '4px 8px', 
                                        borderRadius: '4px', 
                                        backgroundColor: '#fff3cd', 
                                        color: '#856404',
                                        fontWeight: '600',
                                        fontSize: '12px'
                                    }}>
                                        {prijava.status}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => odobriOcenu(prijava.id)}
                                        style={{
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Odobri
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminOdobravanjeOcena;
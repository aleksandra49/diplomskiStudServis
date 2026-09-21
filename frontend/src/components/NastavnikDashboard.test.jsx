import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NastavnikDashboard from './NastavnikDashboard';
import { getNastavnikByKorisnikId, getPredmetiByNastavnik } from '../api/nastavnikService';
import { getStudentiPoPredmetu } from '../api/pohadjanjaService';
import { getPolaganjaPoPredmetu, unosOcene } from '../api/ispitiService';

// 1. Mockovanje svih potrebnih API servisa
jest.mock('../api/nastavnikService');
jest.mock('../api/pohadjanjaService');
jest.mock('../api/ispitiService');

describe('NastavnikDashboard Komponenta - Testovi pokrivenosti', () => {

  const mockUser = { id: 2, username: 'nastavnik_pera' };
  const mockNastavnikData = {
    id: 10,
    ime: 'Petar',
    prezime: 'Petrović',
    email: 'pera@ftn.rs',
    zvanje: 'Redovni profesor'
  };

  const mockPredmetiData = [
    { id: 101, naziv: 'Matematika 1', espb: 6 },
    { id: 102, naziv: 'Programiranje 1', espb: 8 }
  ];

  const mockStudentiData = [
    { id: 1, studentIndeksIme: 'E1/2023 - Jovan Jovanović', skolskaGodina: '2023/2024' }
  ];

  const mockPrijaveData = [
    { id: 50, studentIndeks: 'E1/2023 - Jovan', ispitniRok: 'Januarski', ocena: null }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Maskiramo window.alert da nam ne blokira testove i da možemo da ga testiramo
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Prikazuje poruku u toku učitavanja, a zatim uspešno ispisuje podatke nastavnika i tabove', async () => {
    getNastavnikByKorisnikId.mockResolvedValueOnce({ data: mockNastavnikData });
    getPredmetiByNastavnik.mockResolvedValueOnce({ data: mockPredmetiData });

    render(<NastavnikDashboard user={mockUser} />);

    expect(screen.getByText(/Učitavanje podataka.../i)).toBeInTheDocument();

    expect(await screen.findByText(/Lični podaci nastavnika/i)).toBeInTheDocument();
    expect(screen.getByText('Petar')).toBeInTheDocument();
    expect(screen.getByText('Petrović')).toBeInTheDocument();
    expect(screen.getByText('pera@ftn.rs')).toBeInTheDocument();
    expect(screen.getByText('Redovni profesor')).toBeInTheDocument();

    // Provera postojanja tabova
    expect(screen.getByRole('button', { name: /Lični podaci/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Predmeti i studenti/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ispiti i ocene/i })).toBeInTheDocument();
  });

  test('Prikazuje poruku o grešci ako API za nastavnika ne uspe', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getNastavnikByKorisnikId.mockRejectedValueOnce(new Error('API Error'));

    render(<NastavnikDashboard user={mockUser} />);

    const errorMsg = await screen.findByText(/Nije moguće učitati podatke o nastavniku./i);
    expect(errorMsg).toBeInTheDocument();
    spy.mockRestore();
  });

  test('Prikazuje praznu listu kada nastavnik nema dodeljenih predmeta', async () => {
    getNastavnikByKorisnikId.mockResolvedValueOnce({ data: mockNastavnikData });
    getPredmetiByNastavnik.mockResolvedValueOnce({ data: [] });

    render(<NastavnikDashboard user={mockUser} />);

    expect(await screen.findByText(/Lični podaci nastavnika/i)).toBeInTheDocument();

    // Prelazak na tab Predmeti
    fireEvent.click(screen.getByRole('button', { name: /Predmeti i studenti/i }));

    expect(screen.getByText(/Predmeti koje predajem/i)).toBeInTheDocument();
    expect(screen.getByText(/Trenutno nemate dodeljenih predmeta./i)).toBeInTheDocument();
  });

  test('Učitava i prikazuje studente za izabrani predmet', async () => {
    getNastavnikByKorisnikId.mockResolvedValueOnce({ data: mockNastavnikData });
    getPredmetiByNastavnik.mockResolvedValueOnce({ data: mockPredmetiData });
    getStudentiPoPredmetu.mockResolvedValueOnce({ data: mockStudentiData });

    render(<NastavnikDashboard user={mockUser} />);

    expect(await screen.findByText(/Lični podaci nastavnika/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Predmeti i studenti/i }));
    
    // Klik na dugme "Prikaži studente" za prvi predmet
    const prikaziButton = screen.getAllByRole('button', { name: /Prikaži studente/i })[0];
    fireEvent.click(prikaziButton);

    expect(await screen.findByText(/Studenti koji pohađaju izabrani predmet:/i)).toBeInTheDocument();
    expect(screen.getByText('E1/2023 - Jovan Jovanović')).toBeInTheDocument();
  });

  test('Prelazi na tab Ispiti i ocene, učitava prijave i uspešno čuva validnu ocenu', async () => {
    getNastavnikByKorisnikId.mockResolvedValueOnce({ data: mockNastavnikData });
    getPredmetiByNastavnik.mockResolvedValueOnce({ data: mockPredmetiData });
    getPolaganjaPoPredmetu.mockResolvedValue({ data: mockPrijaveData });
    unosOcene.mockResolvedValueOnce({});

    render(<NastavnikDashboard user={mockUser} />);

    expect(await screen.findByText(/Lični podaci nastavnika/i)).toBeInTheDocument();

    // Prelazak na tab Ispiti i ocene
    fireEvent.click(screen.getByRole('button', { name: /Ispiti i ocene/i }));

    expect(screen.getByText(/Ispitni rokovi i prijave studenata/i)).toBeInTheDocument();

    // Klik na predmet "Matematika 1"
    fireEvent.click(screen.getByRole('button', { name: 'Matematika 1' }));

    expect(await screen.findByText(/Prijavljeni studenti/i)).toBeInTheDocument();
    expect(screen.getByText('Januarski')).toBeInTheDocument();

    // Unos ocene u input i klik na Sačuvaj
    const inputOcena = screen.getByRole('spinbutton');
    fireEvent.change(inputOcena, { target: { value: '9' } });

    const sacuvajButton = screen.getByRole('button', { name: /Sačuvaj ocenu/i });
    fireEvent.click(sacuvajButton);

    await waitFor(() => {
      expect(unosOcene).toHaveBeenCalledWith(50, 9);
      expect(window.alert).toHaveBeenCalledWith('Ocena 9 je uspešno sačuvana!');
    });
  });

  test('Validacija odbija unos neispravne ocene (npr. manje od 5 ili veće od 10)', async () => {
    getNastavnikByKorisnikId.mockResolvedValueOnce({ data: mockNastavnikData });
    getPredmetiByNastavnik.mockResolvedValueOnce({ data: mockPredmetiData });
    getPolaganjaPoPredmetu.mockResolvedValueOnce({ data: mockPrijaveData });

    render(<NastavnikDashboard user={mockUser} />);

    expect(await screen.findByText(/Lični podaci nastavnika/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Ispiti i ocene/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Matematika 1' }));

    expect(await screen.findByText(/Prijavljeni studenti/i)).toBeInTheDocument();

    // Unos neispravne ocene (npr. 4)
    const inputOcena = screen.getByRole('spinbutton');
    fireEvent.change(inputOcena, { target: { value: '4' } });

    const sacuvajButton = screen.getByRole('button', { name: /Sačuvaj ocenu/i });
    fireEvent.click(sacuvajButton);

    expect(window.alert).toHaveBeenCalledWith('Molimo unesite validnu ocenu između 5 i 10.');
    expect(unosOcene).not.toHaveBeenCalled();
  });

});
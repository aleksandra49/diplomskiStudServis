import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Uvozimo komponente koje učestvuju u lancu
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AdminStudenti from '../components/AdminStudenti';

// Mockujemo axios da ne bi zavisio od pravog servera
jest.mock('axios');

// Mockujemo API servise koje koristi AdminStudenti komponenta
jest.mock('../api/studentiService', () => ({
  getStudenti: jest.fn(() => Promise.resolve({ data: [] })),
  dodajStudenta: jest.fn(() => Promise.resolve({ data: { id: 1, ime: 'Marko' } })),
  obrisiStudenta: jest.fn(() => Promise.resolve()),
  pretraziStudentePoIndeksu: jest.fn(() => Promise.resolve({ data: [] })),
  dodeliPredmetStudentu: jest.fn(() => Promise.resolve()),
  getPredmetiZaStudenta: jest.fn(() => Promise.resolve({ data: [] }))
}));

jest.mock('../api/predmetiService', () => ({
  getPredmeti: jest.fn(() => Promise.resolve({ data: [{ id: 1, naziv: 'Matematika' }] }))
}));

// Mockujemo Navbar da ne pravi problem ako ima svoje rute/kontekst
jest.mock('../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);

describe('Admin End-to-End / Integracioni Test', () => {
  
  test('Korisnik se uloguje kao admin, prelazi na dashboard, otvara studente i dodaje novog studenta', async () => {
    // 1. Mock uspešne prijave (Login API poziv)
    axios.post.mockResolvedValueOnce({
      data: { id: 1, username: 'admin', uloga: 'ADMIN' }
    });

    // Mockujemo window.alert da nam ne iskču pravi prozori tokom testa
    window.alert = jest.fn();

    // Renderujemo aplikaciju sa rutiranjem
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    );

    // --- KORAK 1: PRIJAVA (LOGIN) ---
    const usernameInput = screen.getByLabelText(/Korisničko ime:/i);
    const passwordInput = screen.getByLabelText(/Lozinka:/i);
    const loginButton = screen.getByRole('button', { name: /Prijavi se/i });

    // Unosimo podatke preko userEvent-a
    await userEvent.type(usernameInput, 'admin');
    await userEvent.type(passwordInput, 'admin123');
    await userEvent.click(loginButton);

    // Čekamo da se uspešno uloguje i pređe na Dashboard (pojaviće se Admin Panel naslov)
    expect(await screen.findByText(/Admin Panel \(Studentska služba\)/i)).toBeInTheDocument();

    // --- KORAK 2: KLIK NA TAB "STUDENTI" NA DASHBOARD-u ---
    const studentiTabButton = screen.getByRole('button', { name: /^Studenti$/i });
    await userEvent.click(studentiTabButton);

    // Proveravamo da li se otvorila forma za dodavanje studenta
    expect(await screen.findByText(/Dodaj novog studenta/i)).toBeInTheDocument();

    // --- KORAK 3: POPUNJAVANJE FORME I DODAVANJE STUDENTA ---
    const imeInput = screen.getByText(/^Ime:/i).nextElementSibling;
    const prezimeInput = screen.getByText(/^Prezime:/i).nextElementSibling;
    const emailInput = screen.getByText(/^Email:/i).nextElementSibling;
    const indeksInput = screen.getByText(/^Broj indeksa:/i).nextElementSibling;
    const godinaInput = screen.getByText(/^Godina studija:/i).nextElementSibling;
    const sacuvajButton = screen.getByRole('button', { name: /Sačuvaj studenta/i });

    await userEvent.type(imeInput, 'Petar');
    await userEvent.type(prezimeInput, 'Petrović');
    await userEvent.type(emailInput, 'petar@petrovic.com');
    await userEvent.type(indeksInput, 'E1/2026');
    await userEvent.clear(godinaInput);
    await userEvent.type(godinaInput, '2');

    // Klik na dugme za čuvanje
    await userEvent.click(sacuvajButton);

    // Proveravamo da li je pozvana poruka o uspehu (alert)
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Student uspešno dodat!');
    });
  });

});
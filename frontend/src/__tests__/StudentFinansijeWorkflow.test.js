import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Uvozimo stranice
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

// Mockujemo axios
jest.mock('axios');

// Mockujemo servis za studenta
jest.mock('../api/studentService', () => ({
  getStudentByKorisnikId: jest.fn(() => 
    Promise.resolve({ 
      data: { 
        id: 1, 
        ime: 'Marko', 
        prezime: 'Marković', 
        brojIndeksa: 'RA 12/2022', 
        email: 'marko@ftn.rs', 
        godinaStudija: 3, 
        stanjeRacuna: 500 
      } 
    })
  )
}));

// Mockujemo transakcioni servis sa svim funkcijama koje FinansijskaKartica koristi
jest.mock('../api/transakcijeService', () => ({
  izvrsiUplatu: jest.fn(() => Promise.resolve({ data: { success: true } })),
  getTransakcijeByStudentId: jest.fn(() => Promise.resolve({ data: [] }))
}));

// Mockujemo ostale student komponente da ne pucaju unutar Dashboard-a
jest.mock('../components/StudentPohadjanja', () => () => <div data-testid="pohadjanja">Pohadjanja</div>);
jest.mock('../components/StudentIspiti', () => () => <div data-testid="ispiti">Ispiti</div>);
jest.mock('../components/StudentPrijave', () => () => <div data-testid="prijave">Prijave</div>);
jest.mock('../components/StudentDokumenti', () => () => <div data-testid="dokumenti">Dokumenti</div>);

// Mockujemo Navbar koji ima dugme za odjavu
jest.mock('../components/Navbar', () => {
  return function DummyNavbar() {
    const handleLogout = () => {
      localStorage.removeItem('user');
      window.location.href = '/';
    };
    return (
      <div data-testid="navbar">
        <button onClick={handleLogout}>Odjavi se</button>
      </div>
    );
  };
});

describe('Student Workflow - Finansijska kartica i uplata', () => {

  test('Student se uloguje, uplati 1000 RSD za prijavu ispita, proveri uspeh i odjavi se', async () => {
    // 1. Mock uspešne prijave sa ulogom STUDENT
    axios.post.mockResolvedValueOnce({
      data: { id: 10, username: 'student', uloga: 'STUDENT' }
    });

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

    await userEvent.type(usernameInput, 'student');
    await userEvent.type(passwordInput, 'student123');
    await userEvent.click(loginButton);

    // Čekamo da se učitaju lični podaci studenta na dashboard-u
    expect(await screen.findByText(/Lični podaci studenta/i)).toBeInTheDocument();
    expect(screen.getByText(/RA 12\/2022/i)).toBeInTheDocument();

    // --- KORAK 2: KLIK NA TAB "Finansijska kartica" ---
    const finansijeTabButton = screen.getByRole('button', { name: /Finansijska kartica/i });
    await userEvent.click(finansijeTabButton);

    // Proveravamo da li se otvorila forma za uplatu
    expect(await screen.findByText(/Uplata na račun studenta/i)).toBeInTheDocument();

    // --- KORAK 3: UNOS IZNOSA I SVRHE UPLATE ---
    const iznosInput = screen.getByLabelText(/Iznos \(RSD\):/i);
    const opisInput = screen.getByLabelText(/Opis \/ Svrha:/i);
    const uplatiButton = screen.getByRole('button', { name: /Uplati/i });

    await userEvent.type(iznosInput, '1000');
    await userEvent.type(opisInput, 'Prijava ispita');
    await userEvent.click(uplatiButton);

    // --- KORAK 4: PROVERA DA JE UPLATA PROŠLA ---
    expect(await screen.findByRole('alert')).toHaveTextContent(/Uplata je uspešno proknjižena!/i);

    // --- KORAK 5: ODJAVA (LOGOUT) ---
    const logoutButton = screen.getByRole('button', { name: /Odjavi se/i });
    await userEvent.click(logoutButton);

    // Proveravamo da je korisnik obrisan iz lokala (odjavljen)
    expect(localStorage.getItem('user')).toBeNull();
  });

});
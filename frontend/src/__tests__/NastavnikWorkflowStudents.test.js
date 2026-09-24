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

// Mockujemo servis za nastavnika
jest.mock('../api/nastavnikService', () => ({
  getNastavnikByKorisnikId: jest.fn(() => 
    Promise.resolve({ 
      data: { id: 10, ime: 'Petar', prezime: 'Petrović', email: 'petar@ftn.rs', zvanje: 'Redovni profesor' } 
    })
  ),
  getPredmetiByNastavnik: jest.fn(() => 
    Promise.resolve({ 
      data: [{ id: 1, naziv: 'Matematika 1', espb: 6 }] 
    })
  )
}));

// Mockujemo servis za pohađanja (prikaz studenata po predmetu)
jest.mock('../api/pohadjanjaService', () => ({
  getStudentiPoPredmetu: jest.fn(() => 
    Promise.resolve({ 
      data: [
        { 
          id: 101, 
          studentIndeksIme: 'RA 1/2023 - Jovan Jovanović', 
          skolskaGodina: '2025/2026' 
        }
      ] 
    })
  )
}));

// Mockujemo ostale servise koji se učitavaju unutar NastavnikDashboard-a da ne pucaju
jest.mock('../api/ispitiService', () => ({
  getSvaPolaganja: jest.fn(() => Promise.resolve({ data: [] })),
  getPolaganjaPoPredmetu: jest.fn(() => Promise.resolve({ data: [] })),
  unosOcene: jest.fn(() => Promise.resolve())
}));

// Mockujemo Navbar da ne pravi probleme pri rutiranju
jest.mock('../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);

describe('Nastavnik Workflow - Pregled studenata po predmetu', () => {

  test('Nastavnik se uloguje, otvara tab predmeti i lista studente za izabrani predmet', async () => {
    // 1. Mock uspešne prijave sa ulogom PROFESOR
    axios.post.mockResolvedValueOnce({
      data: { id: 5, username: 'profesor', uloga: 'PROFESOR' }
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

    await userEvent.type(usernameInput, 'profesor');
    await userEvent.type(passwordInput, 'profesor123');
    await userEvent.click(loginButton);

    // Čekamo da se učitaju lični podaci nastavnika na dashboard-u (dokaz da je usresno ulogovan)
    expect(await screen.findByText(/Lični podaci nastavnika/i)).toBeInTheDocument();

    // --- KORAK 2: KLIK NA TAB "Predmeti i studenti" ---
    const predmetiTabButton = screen.getByRole('button', { name: /Predmeti i studenti/i });
    await userEvent.click(predmetiTabButton);

    // Proveravamo da li se prikazao predmet "Matematika 1" u tabeli
    expect(await screen.findByText(/Matematika 1/i)).toBeInTheDocument();

    // --- KORAK 3: KLIK NA DUGME "Prikaži studente" ZA PREDMET ---
    const prikaziStudenteButton = screen.getByRole('button', { name: /Prikaži studente/i });
    await userEvent.click(prikaziStudenteButton);

    // --- KORAK 4: PROVERA DA SU STUDENTI USPEŠNO IZLISTANI ---
    expect(await screen.findByText(/Studenti koji pohađaju izabrani predmet:/i)).toBeInTheDocument();
    expect(await screen.findByText(/RA 1\/2023 - Jovan Jovanović/i)).toBeInTheDocument();
    expect(screen.getByText(/2025\/2026/i)).toBeInTheDocument();
  });

});
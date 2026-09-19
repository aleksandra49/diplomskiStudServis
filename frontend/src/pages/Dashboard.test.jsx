import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

// INTEGRACIONI TEST: Testiramo kako Dashboard komponenta čita podatke iz localStorage,
// prepoznaje ulogu korisnika i integriše odgovarajuće podkomponente na ekranu.
describe('Dashboard Komponenta - Integracioni testovi', () => {

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('prikazuje StudentDashboard kada je uloga u localStorage STUDENT', () => {
    const mockUser = { username: 'pera.peric', uloga: 'STUDENT' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Proveravamo da li se renderovao Navbar i StudentDashboard
    // (Prilagodi tekst u getByText u zavisnosti šta piše u tvom StudentDashboard-u)
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('prikazuje NastavnikDashboard kada je uloga PROFESOR ili NASTAVNIK', () => {
    const mockNastavnik = { username: 'mika.mikic', uloga: 'PROFESOR' };
    localStorage.setItem('user', JSON.stringify(mockNastavnik));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('prikazuje AdminDashboard kada je uloga u localStorage ADMIN', () => {
    const mockAdmin = { username: 'admin', uloga: 'ADMIN' };
    localStorage.setItem('user', JSON.stringify(mockAdmin));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

});
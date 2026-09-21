import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Simuliramo (mockujemo) useNavigate iz react-router-dom da možemo da pratimo kuda nas aplikacija vodi
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Navbar Komponenta - Integracioni / UI testovi', () => {

  // Očišćavamo mock-ove i localStorage pre svakog testa
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('Ne prikazuje ništa u navigaciji ako korisnik nije ulogovan (ne nalazi se u localStorage)', () => {
    // Postavljamo da nema korisnika
    localStorage.removeItem('user');

    // Rerendujemo komponentu unutar BrowserRouter-a (obavezno zbog routera)
    const { container } = render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Validacija: Proveravamo da li je komponenta prazna (vraća null)
    expect(container.firstChild).toBeNull();
  });

  test('Prikazuje podatke ulogovanog korisnika (grb, ulogu, username) i dugme za odjavu', () => {
    // Pripremamo lažnog ulogovanog korisnika u localStorage
    const mockUser = { uloga: 'STUDENT', username: 'stefan123' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // 1. Validacija elemenata: Proveravamo da li se tekst i elementi nalaze na ekranu
    const tekstElement = screen.getByText(/Studentski Servis \(STUDENT: stefan123\)/i);
    const slikaGrb = screen.getByAltText(/Grb/i);
    const dugmeOdjava = screen.getByRole('button', { name: /Odjava/i });

    expect(tekstElement).toBeInTheDocument();
    expect(slikaGrb).toBeInTheDocument();
    expect(dugmeOdjava).toBeInTheDocument();
  });

  test('Briše korisnika iz localStorage i preusmerava na login stranicu kada se klikne na dugme Odjava', () => {
    const mockUser = { role: 'ADMIN', username: 'admin' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    // Proveravamo da je korisnik stvarno tu pre akcije
    expect(localStorage.getItem('user')).not.toBeNull();

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Nalazimo dugme za odjavu
    const dugmeOdjava = screen.getByRole('button', { name: /Odjava/i });

    // 2. Simulacija akcije (KLIK): Koristimo fireEvent da simuliramo klik mišem
    fireEvent.click(dugmeOdjava);

    // 3. Validacija rezultata akcije:
    // Da li je korisnik obrisan iz localStorage?
    expect(localStorage.getItem('user')).toBeNull();
    
    // Da li je pozvana navigacija ka '/login'?
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

});
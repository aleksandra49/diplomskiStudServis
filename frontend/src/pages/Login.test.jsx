import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

describe('Login Komponenta - Osnovni testovi', () => {

  // 1. Test da li se svi elementi uspešno renderuju na ekranu
  test('uspešno renderuje formu za prijavu, polja i dugme', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Proveravamo naslov
    expect(screen.getByText(/Prijava na Studentski Servis/i)).toBeInTheDocument();

    // Proveravamo polja preko njihovih ID-jeva (koje imaš definisane u kodu: id="username" i id="password")
    expect(screen.getByLabelText(/Korisničko ime:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lozinka:/i)).toBeInTheDocument();

    // Proveravamo dugme
    expect(screen.getByRole('button', { name: /Prijavi se/i })).toBeInTheDocument();
  });

  // 2. Test da li korisnik može da unosi tekst u polja
  test('dozvoljava unos u input polja za username i password', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/Korisničko ime:/i);
    const passwordInput = screen.getByLabelText(/Lozinka:/i);

    // Simuliramo kucanje
    fireEvent.change(usernameInput, { target: { value: 'pera.peric' } });
    fireEvent.change(passwordInput, { target: { value: 'sifra123' } });

    // Proveravamo da li su vrednosti upisane u inpute
    expect(usernameInput.value).toBe('pera.peric');
    expect(passwordInput.value).toBe('sifra123');
  });

});
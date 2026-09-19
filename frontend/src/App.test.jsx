import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// INTEGRACIONI TEST ZA RUTIRANJE: Testiramo glavnu App komponentu i navigaciju između stranica
describe('App Komponenta - Testovi rutiranja', () => {

  test('automatski preusmerava sa korene rute (/) na /login i prikazuje Login formu', () => {
    // Postavljamo istoriju brauzera na početnu putanju '/'
    window.history.pushState({}, 'Test page', '/');

    render(<App />);

    // Proveravamo da li se prikazuje naslov sa Login stranice
    expect(screen.getByText(/Prijava na Studentski Servis/i)).toBeInTheDocument();
  });

  test('prikazuje Login stranicu kada je ruta /login', () => {
    window.history.pushState({}, 'Test page', '/login');

    render(<App />);

    expect(screen.getByText(/Prijava na Studentski Servis/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Prijavi se/i })).toBeInTheDocument();
  });

});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';

// Mockujemo (lažiramo) podkomponente da testiramo samo AdminDashboard izolovano
jest.mock('./AdminPredmeti', () => () => <div data-testid="admin-predmeti-mock">Predmeti Komponenta</div>);
jest.mock('./AdminNastavnici', () => () => <div data-testid="admin-nastavnici-mock">Nastavnici Komponenta</div>);
jest.mock('./AdminStudenti', () => () => <div data-testid="admin-studenti-mock">Studenti Komponenta</div>);
jest.mock('./AdminIspitniRokovi', () => () => <div data-testid="admin-rokovi-mock">Rokovi Komponenta</div>);
jest.mock('./AdminOdobravanjeOcena', () => () => <div data-testid="admin-ocene-mock">Ocene Komponenta</div>);

describe('AdminDashboard Komponenta - Integracioni / UI testovi', () => {

  const mockAdmin = {
    id: 1,
    username: 'admin_pera',
    uloga: 'ADMIN'
  };

  test('Prikazuje naslov i inicijalno aktivni tab (Lični podaci) sa podacima administratora', () => {
    render(<AdminDashboard user={mockAdmin} />);

    // 1. Validacija elemenata na ekranu: Da li se nalazi naslov i podaci o korisniku
    expect(screen.getByText(/Admin Panel \(Studentska služba\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Podaci o administratoru/i)).toBeInTheDocument();
    
    // Proveravamo da li su prikazani tačni podaci prosleđenog korisnika
    expect(screen.getByText(/1/i)).toBeInTheDocument(); // ID
    expect(screen.getByText(/admin_pera/i)).toBeInTheDocument(); // Username
    
    // Preciznija pretraga za ulogu da izbegnemo višestruke elemente
    expect(screen.getByText(/Uloga:/i)).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  test('Prebacuje tabove i prikazuje odgovarajuću podkomponentu kada se klikne na odgovarajuće dugme', () => {
    render(<AdminDashboard user={mockAdmin} />);

    // Inicijalno je tab "Lični podaci", pa podkomponente za predmete ne bi trebalo da budu tu
    expect(screen.queryByTestId('admin-predmeti-mock')).not.toBeInTheDocument();

    // 2. Simulacija akcije (KLIK): Klikćemo na tab "Predmeti"
    const dugmePredmeti = screen.getByRole('button', { name: /Predmeti/i });
    fireEvent.click(dugmePredmeti);

    // 3. Validacija rezultata: Da li se sada prikazuje mokovana komponenta za predmete?
    expect(screen.getByTestId('admin-predmeti-mock')).toBeInTheDocument();

    // Klikćemo na tab "Nastavnici"
    const dugmeNastavnici = screen.getByRole('button', { name: /Nastavnici/i });
    fireEvent.click(dugmeNastavnici);

    expect(screen.getByTestId('admin-nastavnici-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-predmeti-mock')).not.toBeInTheDocument();

    // Klikćemo na tab "Studenti"
    const dugmeStudenti = screen.getByRole('button', { name: /Studenti/i });
    fireEvent.click(dugmeStudenti);
    expect(screen.getByTestId('admin-studenti-mock')).toBeInTheDocument();

    // Klikćemo na tab "Ispitni rokovi"
    const dugmeRokovi = screen.getByRole('button', { name: /Ispitni rokovi/i });
    fireEvent.click(dugmeRokovi);
    expect(screen.getByTestId('admin-rokovi-mock')).toBeInTheDocument();

    // Klikćemo na tab "Odobravanje ocena"
    const dugmeOcene = screen.getByRole('button', { name: /Odobravanje ocena/i });
    fireEvent.click(dugmeOcene);
    expect(screen.getByTestId('admin-ocene-mock')).toBeInTheDocument();
  });

});
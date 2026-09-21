import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StudentDashboard from './StudentDashboard';
import { getStudentByKorisnikId } from '../api/studentService';

// 1. Mockujemo API servis
jest.mock('../api/studentService');

// 2. Mockujemo podkomponente da bi test bio izolovan
jest.mock('./StudentPohadjanja', () => () => <div data-testid="pohadjanja-mock">Pohadjanja Komponenta</div>);
jest.mock('./StudentIspiti', () => () => <div data-testid="ispiti-mock">Ispiti Komponenta</div>);
jest.mock('./StudentPrijave', () => () => <div data-testid="prijave-mock">Prijave Komponenta</div>);
jest.mock('./FinansijskaKartica', () => () => <div data-testid="finansije-mock">Finansije Komponenta</div>);
jest.mock('./StudentDokumenti', () => () => <div data-testid="dokumenti-mock">Dokumenti Komponenta</div>);

describe('StudentDashboard Komponenta - Integracioni / UI testovi', () => {

  const mockUser = { id: 5, username: 'student_marko' };
  const mockStudentData = {
    id: 10,
    ime: 'Marko',
    prezime: 'Marković',
    brojIndeksa: 'E1/2023',
    email: 'marko.student@ftn.rs',
    godinaStudija: 3,
    stanjeRacuna: 1500
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Prikazuje poruku u toku učitavanja (loading state), a zatim uspešno ispisuje lične podatke studenta', async () => {
    getStudentByKorisnikId.mockResolvedValueOnce({ data: mockStudentData });

    render(<StudentDashboard user={mockUser} />);

    // Proveravamo loading
    expect(screen.getByText(/Učitavanje podataka.../i)).toBeInTheDocument();

    // Čekamo da podaci stignu
    expect(await screen.findByText(/Lični podaci studenta/i)).toBeInTheDocument();
    
    // Preciznije proveravamo podatke izbegavajući generalne regex poklapanja
    expect(screen.getByText('Marko')).toBeInTheDocument();
    expect(screen.getByText('Marković')).toBeInTheDocument();
    expect(screen.getByText('E1/2023')).toBeInTheDocument();
    expect(screen.getByText(/1500 RSD/i)).toBeInTheDocument();

    expect(getStudentByKorisnikId).toHaveBeenCalledWith(5);
  });

  test('Prikazuje poruku o grešci ako API poziv za dohvatanje studenta ne uspe', async () => {
    // Privremeno utišavamo console.error samo za ovaj test da nam ne zagušuje terminal
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    getStudentByKorisnikId.mockRejectedValueOnce(new Error('Network Error'));

    render(<StudentDashboard user={mockUser} />);

    const errorMessage = await screen.findByText(/Nije moguće učitati podatke o studentu./i);
    expect(errorMessage).toBeInTheDocument();

    spy.mockRestore(); // Vraćamo console.error u normalu
  });

  test('Prebacuje tabove i uspešno prikazuje odgovarajuće podkomponente za studenta', async () => {
    getStudentByKorisnikId.mockResolvedValueOnce({ data: mockStudentData });

    render(<StudentDashboard user={mockUser} />);

    expect(await screen.findByText(/Lični podaci studenta/i)).toBeInTheDocument();

    // Klikćemo redom na tabove
    fireEvent.click(screen.getByRole('button', { name: /Pohađanja/i }));
    expect(screen.getByTestId('pohadjanja-mock')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Ispiti i Ocene/i }));
    expect(screen.getByTestId('ispiti-mock')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Prijava \/ Odjava ispita/i }));
    expect(screen.getByTestId('prijave-mock')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Finansijska kartica/i }));
    expect(screen.getByTestId('finansije-mock')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Moji dokumenti/i }));
    expect(screen.getByTestId('dokumenti-mock')).toBeInTheDocument();
  });

});
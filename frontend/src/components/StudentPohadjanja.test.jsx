import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StudentPohadjanja from './StudentPohadjanja';
import { getPohadjanjaByStudentId } from '../api/pohadjanjaService';
import { getProfesorZaPredmet } from '../api/predmetiService';

// 1. Mockujemo servise
jest.mock('../api/pohadjanjaService', () => ({
  getPohadjanjaByStudentId: jest.fn(),
}));

jest.mock('../api/predmetiService', () => ({
  getProfesorZaPredmet: jest.fn(),
}));

describe('StudentPohadjanja - Testovi komponente', () => {
  const mockStudentId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('prikazuje poruku o učitavanju, a zatim uspešno prikazuje listu pohađanja', async () => {
    const mockPohadjanja = [
      { id: 1, predmetId: 10, predmetNaziv: 'Web programiranje', espb: 6, semestar: 5 },
      { id: 2, predmetId: 20, predmetNaziv: 'Baze podataka', espb: 7, semestar: 4 }
    ];

    getPohadjanjaByStudentId.mockResolvedValueOnce({ data: mockPohadjanja });

    render(<StudentPohadjanja studentId={mockStudentId} />);

    // Proveravamo inicijalni loading
    expect(screen.getByText(/učitavanje predmeta/i)).toBeInTheDocument();

    // Čekamo da se predmeti učitaju
    await waitFor(() => {
      expect(screen.queryByText(/učitavanje predmeta/i)).not.toBeInTheDocument();
    });

    // Proveravamo da li su predmeti prikazani na ekranu
    expect(screen.getByText('Web programiranje')).toBeInTheDocument();
    expect(screen.getByText('Baze podataka')).toBeInTheDocument();
  });

  test('prikazuje poruku kada student nema prijavljenih predmeta', async () => {
    getPohadjanjaByStudentId.mockResolvedValueOnce({ data: [] });

    render(<StudentPohadjanja studentId={mockStudentId} />);

    await waitFor(() => {
      expect(screen.queryByText(/učitavanje predmeta/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/trenutno nemate prijavljenih predmeta/i)).toBeInTheDocument();
  });

  test('prikazuje detalje predmeta i profesora nakon klika na predmet', async () => {
    const mockPohadjanja = [
      { id: 1, predmetId: 10, predmetNaziv: 'Web programiranje', espb: 6, semestar: 5 }
    ];

    const mockProfesorResponse = [
      { ulogaNaPredmetu: 'PROFESOR', nastavnikImePrezime: 'Dragan Milivojević' }
    ];

    getPohadjanjaByStudentId.mockResolvedValueOnce({ data: mockPohadjanja });
    getProfesorZaPredmet.mockResolvedValueOnce(mockProfesorResponse);

    render(<StudentPohadjanja studentId={mockStudentId} />);

    await waitFor(() => {
      expect(screen.getByText('Web programiranje')).toBeInTheDocument();
    });

    // Klikćemo na predmet koristeći userEvent
    const predmetItem = screen.getByText('Web programiranje');
    await userEvent.click(predmetItem);

    // Proveravamo poziv servisa za profesora
    expect(getProfesorZaPredmet).toHaveBeenCalledWith(10);

    // Čekamo da se ime profesora pojavi u detaljima
    await waitFor(() => {
      expect(screen.getByText('Dragan Milivojević')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument(); // ESPB
    });
  });

  test('postavlja "Nije dodeljen" ako nema profesora sa tom ulogom', async () => {
    const mockPohadjanja = [
      { id: 1, predmetId: 10, predmetNaziv: 'Matematika' }
    ];

    // Vraćamo praznu listu ili asistenta umesto profesora
    const mockProfesorResponse = [
      { ulogaNaPredmetu: 'ASISTENT', nastavnikImePrezime: 'Pera Perić' }
    ];

    getPohadjanjaByStudentId.mockResolvedValueOnce({ data: mockPohadjanja });
    getProfesorZaPredmet.mockResolvedValueOnce(mockProfesorResponse);

    render(<StudentPohadjanja studentId={mockStudentId} />);

    await waitFor(() => {
      expect(screen.getByText('Matematika')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Matematika'));

    await waitFor(() => {
      expect(screen.getByText('Nije dodeljen')).toBeInTheDocument();
    });
  });
});
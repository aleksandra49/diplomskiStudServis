import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StudentIspiti from './StudentIspiti';
import { getPolaganjaByStudentId } from '../api/ispitiService';

// 1. Mockujemo servis za ispite
jest.mock('../api/ispitiService', () => ({
  getPolaganjaByStudentId: jest.fn(),
}));

describe('StudentIspiti - Testovi komponente', () => {
  const mockStudentId = '789';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('prikazuje poruku o učitavanju, a zatim uspešno računa prosek, ESPB i prikazuje tabele', async () => {
    const mockPolaganja = [
      { id: 1, predmetNaziv: 'Matematika 1', ocena: 9, espb: 6, ispitniRok: 'Januarski' },
      { id: 2, predmetNaziv: 'Osnove Programiranja', ocena: 10, espb: 8, ispitniRok: 'Februarski' },
      { id: 3, predmetNaziv: 'Engleski 1', ocena: 5, ispitniRok: 'Junski' } // Nepoložen (ocena 5)
    ];

    getPolaganjaByStudentId.mockResolvedValueOnce({ data: mockPolaganja });

    render(<StudentIspiti studentId={mockStudentId} />);

    // Proveravamo početni loading
    expect(screen.getByText(/učitavanje ocena i ispita/i)).toBeInTheDocument();

    // Čekamo da se podaci učitaju
    await waitFor(() => {
      expect(screen.queryByText(/učitavanje ocena i ispita/i)).not.toBeInTheDocument();
    });

    // Proveravamo da li je izračunat ispravan prosek (9 i 10 -> prosek 9.50)
    expect(screen.getByText('9.50')).toBeInTheDocument();

    // Proveravamo zbir ESPB bodova (6 + 8 = 14)
    expect(screen.getByText('14 B')).toBeInTheDocument();

    // Proveravamo položene ispite
    expect(screen.getByText('Matematika 1')).toBeInTheDocument();
    expect(screen.getByText('Osnove Programiranja')).toBeInTheDocument();

    // Proveravamo nepoložene ispite
    expect(screen.getByText('Engleski 1')).toBeInTheDocument();
    expect(screen.getByText('Nije položio')).toBeInTheDocument();
  });

  test('prikazuje nula prosek i odgovarajuće poruke kada student nema ni jedan položen ispit', async () => {
    const mockPolaganja = [
      { id: 4, predmetNaziv: 'Internet mreze', ocena: null, ispitniRok: 'Septembarski' } // Prijavljen, nema ocenu
    ];

    getPolaganjaByStudentId.mockResolvedValueOnce({ data: mockPolaganja });

    render(<StudentIspiti studentId={mockStudentId} />);

    await waitFor(() => {
      expect(screen.queryByText(/učitavanje ocena i ispita/i)).not.toBeInTheDocument();
    });

    // Proveravamo podrazumevane vrednosti za prazno/početno stanje
    expect(screen.getByText('0.00')).toBeInTheDocument();
    expect(screen.getByText('0 B')).toBeInTheDocument();
    expect(screen.getByText('Nema položenih ispita.')).toBeInTheDocument();
    expect(screen.getByText('Internet mreze')).toBeInTheDocument();
    expect(screen.getByText('Prijavljen')).toBeInTheDocument();
  });

  test('hvata grešku sa servera i sklanja loading state', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getPolaganjaByStudentId.mockRejectedValueOnce(new Error('Greška u komunikaciji'));

    render(<StudentIspiti studentId={mockStudentId} />);

    await waitFor(() => {
      expect(screen.queryByText(/učitavanje ocena i ispita/i)).not.toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    // Pošto state ostaje prazan niz, prikazaće poruke da nema ispita
    expect(screen.getByText('Nema položenih ispita.')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminIspitniRokovi from './AdminIspitniRokovi';
import { getNaziviRokova, getPrijaveZaRok, prijavaIspita } from '../api/ispitiService';
import { getStudenti } from '../api/studentiService';
import { getPredmeti } from '../api/predmetiService';

jest.mock('../api/ispitiService', () => ({
  getNaziviRokova: jest.fn(),
  getPrijaveZaRok: jest.fn(),
  prijavaIspita: jest.fn(),
}));

jest.mock('../api/studentiService', () => ({
  getStudenti: jest.fn(),
}));

jest.mock('../api/predmetiService', () => ({
  getPredmeti: jest.fn(),
}));

window.alert = jest.fn();

describe('AdminIspitniRokovi - Testovi komponente', () => {
  const mockRokovi = ['Januarski', 'Februarski'];
  const mockStudenti = [
    { id: 1, brojIndeksa: '2023/001', ime: 'Ana', prezime: 'Anić' }
  ];
  const mockPredmeti = [
    { id: 10, naziv: 'Matematika' }
  ];
  const mockPrijave = [
    { id: 100, studentId: 1, predmetNaziv: 'Matematika', datumPrijave: '2026-01-10', status: 'POLOŽIO', ocena: 9 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('uspešno učitava inicijalne podatke i prikazuje tabelu prijava za prvi rok', async () => {
    getNaziviRokova.mockResolvedValueOnce({ data: mockRokovi });
    getPrijaveZaRok.mockResolvedValueOnce({ data: mockPrijave });
    getStudenti.mockResolvedValueOnce({ data: mockStudenti });
    getPredmeti.mockResolvedValueOnce({ data: mockPredmeti });

    render(<AdminIspitniRokovi />);

    await waitFor(() => {
      expect(screen.getByText('2023/001')).toBeInTheDocument();
      expect(screen.getByText('Ana Anić')).toBeInTheDocument();
      // Use getAllByText for 'Matematika' or target the table specifically to avoid ambiguity with the <select> option
      expect(screen.getAllByText('Matematika').length).toBeGreaterThan(0);
      expect(screen.getByText('POLOŽIO')).toBeInTheDocument();
    });

    expect(getNaziviRokova).toHaveBeenCalledTimes(1);
    expect(getPrijaveZaRok).toHaveBeenCalledWith('Januarski');
    expect(getStudenti).toHaveBeenCalledTimes(1);
    expect(getPredmeti).toHaveBeenCalledTimes(1);
  });

  test('prikazuje poruku kada nema prijavljenih studenata za izabrani rok', async () => {
    getNaziviRokova.mockResolvedValueOnce({ data: mockRokovi });
    getPrijaveZaRok.mockResolvedValueOnce({ data: [] });
    getStudenti.mockResolvedValueOnce({ data: mockStudenti });
    getPredmeti.mockResolvedValueOnce({ data: mockPredmeti });

    render(<AdminIspitniRokovi />);

    await waitFor(() => {
      expect(screen.getByText(/nema prijavljenih studenata za ovaj ispitni rok/i)).toBeInTheDocument();
    });
  });

  test('omogućava promenu izabranog ispitnog roka i učitava nove prijave', async () => {
    getNaziviRokova.mockResolvedValueOnce({ data: mockRokovi });
    getPrijaveZaRok
      .mockResolvedValueOnce({ data: mockPrijave }) 
      .mockResolvedValueOnce({ data: [] });          
    getStudenti.mockResolvedValueOnce({ data: mockStudenti });
    getPredmeti.mockResolvedValueOnce({ data: mockPredmeti });

    render(<AdminIspitniRokovi />);

    await waitFor(() => {
      expect(screen.getByText('POLOŽIO')).toBeInTheDocument();
    });

    // The third combobox (index 2) is the dropdown for selecting the exam period/rok
    const selects = screen.getAllByRole('combobox');
    const selectRok = selects[2]; 

    await waitFor(async () => {
      await userEvent.selectOptions(selectRok, 'Februarski');
    });

    expect(getPrijaveZaRok).toHaveBeenCalledWith('Februarski');
    
    await waitFor(() => {
      expect(screen.getByText(/nema prijavljenih studenata za ovaj ispitni rok/i)).toBeInTheDocument();
    });
  });

  test('uspešno dodaje novu prijavu preko forme', async () => {
    getNaziviRokova.mockResolvedValue({ data: mockRokovi });
    getPrijaveZaRok.mockResolvedValue({ data: [] });
    getStudenti.mockResolvedValue({ data: mockStudenti });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    prijavaIspita.mockResolvedValueOnce({});

    render(<AdminIspitniRokovi />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /dodaj u rok/i })).toBeInTheDocument();
    });

    const dugmeDodaj = screen.getByRole('button', { name: /dodaj u rok/i });
    await userEvent.click(dugmeDodaj);

    expect(prijavaIspita).toHaveBeenCalledWith({
      studentId: 1,      
      predmetId: 10,     
      ispitniRok: 'Januarski'
    });

    expect(window.alert).toHaveBeenCalledWith('Uspešno dodata prijava / predmet u ispitni rok!');
  });

  test('hvata grešku pri učitavanju inicijalnih podataka', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    getNaziviRokova.mockRejectedValueOnce(new Error('Server Error'));
    getStudenti.mockRejectedValueOnce(new Error('Server Error'));
    getPredmeti.mockRejectedValueOnce(new Error('Server Error'));

    render(<AdminIspitniRokovi />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
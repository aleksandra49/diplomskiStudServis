import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import AdminOdobravanjeOcena from './AdminOdobravanjeOcena';

// 1. Mockujemo axios i window.alert
jest.mock('axios');
window.alert = jest.fn();

describe('AdminOdobravanjeOcena - Testovi komponente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('prikazuje poruku o učitavanju, a zatim uspešno ispisuje prijave koje čekaju odobrenje', async () => {
    const mockPrijave = [
      { id: 1, studentIndeks: '123/2023', predmetNaziv: 'Matematika 1', ispitniRok: 'Januarski', bodovi: 85, ocena: 9, status: 'ČEKA_ODOBRENJE' },
      { id: 2, studentIndeks: '456/2023', predmetNaziv: 'Osnove programiranja', ispitniRok: 'Januarski', bodovi: 50, ocena: 6, status: 'ODOBRENO' } // Treba da bude filtrirano
    ];

    axios.get.mockResolvedValueOnce({ data: mockPrijave });

    render(<AdminOdobravanjeOcena />);

    // Proveravamo inicijalni loading
    expect(screen.getByText(/učitavanje.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/učitavanje.../i)).not.toBeInTheDocument();
    });

    // Prikazaće samo onaj sa statusom ČEKA_ODOBRENJE
    expect(screen.getByText('123/2023')).toBeInTheDocument();
    expect(screen.getByText('Matematika 1')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('ČEKA_ODOBRENJE')).toBeInTheDocument();

    // Drugi predmet sa statusom ODOBRENO ne treba da bude u tabeli za odobrenje
    expect(screen.queryByText('456/2023')).not.toBeInTheDocument();
  });

  test('prikazuje poruku kada nema ocena koje čekaju odobrenje', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<AdminOdobravanjeOcena />);

    await waitFor(() => {
      expect(screen.queryByText(/učitavanje.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/trenutno nema ocena koje čekaju odobrenje/i)).toBeInTheDocument();
  });

  test('omogućava uspešno odobravanje ocene klikom na dugme i osvežava listu', async () => {
    const mockPrijavePocetno = [
      { id: 10, studentIndeks: '789/2022', predmetNaziv: 'Programiranje', ispitniRok: 'Februarski', bodovi: 95, ocena: 10, status: 'ČEKA_ODOBRENJE' }
    ];

    // Prvi poziv vraća prijavu, drugi poziv (nakon odobrenja i ponovnog učitavanja) vraća praznu listu
    axios.get
      .mockResolvedValueOnce({ data: mockPrijavePocetno })
      .mockResolvedValueOnce({ data: [] });

    axios.put.mockResolvedValueOnce({});

    render(<AdminOdobravanjeOcena />);

    await waitFor(() => {
      expect(screen.getByText('Programiranje')).toBeInTheDocument();
    });

    const dugmeOdobri = screen.getByRole('button', { name: /odobri/i });
    await userEvent.click(dugmeOdobri);

    // Proveravamo da li je pozvan ispravan PUT endpoint
    expect(axios.put).toHaveBeenCalledWith('http://localhost:8081/api/ispiti/odobri/10');

    // Proveravamo da li se pojavila poruka (alert)
    expect(window.alert).toHaveBeenCalledWith('Ocena je uspešno odobrena i upisana!');

    // Proveravamo da li se lista osvežila i prikazala poruku da nema više prijava za odobrenje
    await waitFor(() => {
      expect(screen.getByText(/trenutno nema ocena koje čekaju odobrenje/i)).toBeInTheDocument();
    });
  });

  test('hvata grešku sa servera prilikom učitavanja', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(<AdminOdobravanjeOcena />);

    await waitFor(() => {
      expect(screen.queryByText(/učitavanje.../i)).not.toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Došlo je do greške prilikom učitavanja prijava.');

    consoleErrorSpy.mockRestore();
  });
});
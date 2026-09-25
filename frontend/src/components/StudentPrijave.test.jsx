import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StudentPrijave from './StudentPrijave';
import { getPohadjanjaByStudentId } from '../api/pohadjanjaService';
import { getPolaganjaByStudentId, prijavaIspita, odjavaIspita } from '../api/ispitiService';

// 1. Mockujemo servise
jest.mock('../api/pohadjanjaService', () => ({
  getPohadjanjaByStudentId: jest.fn(),
}));

jest.mock('../api/ispitiService', () => ({
  getPolaganjaByStudentId: jest.fn(),
  prijavaIspita: jest.fn(),
  odjavaIspita: jest.fn(),
}));

describe('StudentPrijave - Testovi komponente', () => {
  const mockStudentId = '321';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('prikazuje poruku o učitavanju, a zatim uspešno prikazuje listu predmeta i status prijava', async () => {
    const mockPohadjanja = [
      { id: 1, predmetId: 10, predmetNaziv: 'Internet mreze' }
    ];
    const mockPolaganja = [];

    getPohadjanjaByStudentId.mockResolvedValueOnce({ data: mockPohadjanja });
    getPolaganjaByStudentId.mockResolvedValueOnce({ data: mockPolaganja });

    render(<StudentPrijave studentId={mockStudentId} />);

    expect(screen.getByText(/učitavanje ponuđenih ispita/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/učitavanje ponuđenih ispita/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Internet mreze')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /prijavi ispit/i })).toBeInTheDocument();
  });

  test('omogućava uspešnu prijavu ispita klikom na dugme', async () => {
    const mockPohadjanja = [
      { id: 1, predmetId: 15, predmetNaziv: 'Baze podataka 2' }
    ];

    // Prvi poziv (inicijalni učitaj) vraća prazno, drugi poziv (nakon uspešne prijave) vraća prijavljen ispit
    getPohadjanjaByStudentId.mockResolvedValue({ data: mockPohadjanja });
    getPolaganjaByStudentId
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [{ id: 100, predmetId: 15, ispitniRok: 'Januarski', ocena: null }] });

    prijavaIspita.mockResolvedValueOnce({});

    render(<StudentPrijave studentId={mockStudentId} />);

    await waitFor(() => {
      expect(screen.getByText('Baze podataka 2')).toBeInTheDocument();
    });

    const dugmePrijavi = screen.getByRole('button', { name: /prijavi ispit/i });
    await userEvent.click(dugmePrijavi);

    // Proveravamo da li je pozvan servis sa ispravnim podacima
    expect(prijavaIspita).toHaveBeenCalledWith({
      studentId: mockStudentId,
      predmetId: 15,
      ispitniRok: 'Januarski'
    });

    // Proveravamo poruku o uspehu
    await waitFor(() => {
      expect(screen.getByText(/ispit je uspešno prijavljen za januarski rok/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /odjavi/i })).toBeInTheDocument();
    });
  });

  test('omogućava uspešnu odjavu već prijavljenog ispita', async () => {
    const mockPohadjanja = [
      { id: 1, predmetId: 20, predmetNaziv: 'Osnove racunara' }
    ];
    const mockPolaganja = [
      { id: 200, predmetId: 20, ispitniRok: 'Januarski', ocena: null }
    ];

    getPohadjanjaByStudentId.mockResolvedValue({ data: mockPohadjanja });
    getPolaganjaByStudentId
      .mockResolvedValueOnce({ data: mockPolaganja })
      .mockResolvedValueOnce({ data: [] }); // Nakon odjave lista je prazna

    odjavaIspita.mockResolvedValueOnce({});

    render(<StudentPrijave studentId={mockStudentId} />);

    await waitFor(() => {
      expect(screen.getByText('Osnove racunara')).toBeInTheDocument();
    });

    const dugmeOdjavi = screen.getByRole('button', { name: /odjavi/i });
    await userEvent.click(dugmeOdjavi);

    expect(odjavaIspita).toHaveBeenCalledWith(200);

    await waitFor(() => {
      expect(screen.getByText(/ispit je uspešno odjavljen/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /prijavi ispit/i })).toBeInTheDocument();
    });
  });

  test('dozvoljava promenu ispitnog roka preko padajućeg menija', async () => {
    getPohadjanjaByStudentId.mockResolvedValueOnce({ data: [] });
    getPolaganjaByStudentId.mockResolvedValueOnce({ data: [] });

    render(<StudentPrijave studentId={mockStudentId} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/aktivni ispitni rok/i)).toBeInTheDocument();
    });

    const selectRok = screen.getByLabelText(/aktivni ispitni rok/i);
    
    // Menjamo rok na "Junski"
    await userEvent.selectOptions(selectRok, 'Junski');

    expect(selectRok.value).toBe('Junski');
  });
});
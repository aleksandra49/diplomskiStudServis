import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StudentDokumenti from './StudentDokumenti';
import { getDokumentiPoStudentu } from '../api/dokumentiService';

// 1. Mockovanje API servisa za dokumente
jest.mock('../api/dokumentiService');

describe('StudentDokumenti Komponenta - Testovi pokrivenosti', () => {

  const mockStudentId = 10;

  const mockDokumentiData = [
    {
      id: 1,
      naziv: 'Potvrda o studiranju',
      tipDokumenta: 'Uverenje',
      datumOtpremanja: '2026-09-01',
      urlDokumenta: 'https://example.com/potvrda.pdf'
    },
    {
      id: 2,
      naziv: 'Skripta iz matematike',
      tipDokumenta: 'Materijal',
      datumOtpremanja: null,
      urlDokumenta: null
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Prikazuje poruku u toku učitavanja, a zatim uspešno ispisuje listu dokumenata i linkove', async () => {
    getDokumentiPoStudentu.mockResolvedValueOnce({ data: mockDokumentiData });

    render(<StudentDokumenti studentId={mockStudentId} />);

    // Proveravamo stanje učitavanja
    expect(screen.getByText(/Učitavam dokumente.../i)).toBeInTheDocument();

    // Čekamo da se podaci učitaju i da se naslov pojavi
    expect(await screen.findByText(/Moji elektronski dokumenti i šabloni/i)).toBeInTheDocument();

    // Proveravamo da li su dokumenti izlistani
    expect(screen.getByText('Potvrda o studiranju')).toBeInTheDocument();
    expect(screen.getByText('Uverenje')).toBeInTheDocument();
    expect(screen.getByText('2026-09-01')).toBeInTheDocument();

    // Proveravamo link za preuzimanje prvog dokumenta
    const downloadLink = screen.getByRole('link', { name: /Preuzmi/i });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('href', 'https://example.com/potvrda.pdf');
    expect(downloadLink).toHaveAttribute('target', '_blank');

    // Proveravamo drugi dokument koji nema URL (treba da piše 'Nema fajla')
    expect(screen.getByText('Skripta iz matematike')).toBeInTheDocument();
    expect(screen.getByText('Nema fajla')).toBeInTheDocument();

    expect(getDokumentiPoStudentu).toHaveBeenCalledWith(10);
  });

  test('Prikazuje poruku da nema dokumenata kada je lista prazna', async () => {
    getDokumentiPoStudentu.mockResolvedValueOnce({ data: [] });

    render(<StudentDokumenti studentId={mockStudentId} />);

    expect(await screen.findByText(/Nemate pridruženih dokumenata./i)).toBeInTheDocument();
  });

  test('Završava učitavanje i ne ruši se ako API poziv završi sa greškom', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getDokumentiPoStudentu.mockRejectedValueOnce(new Error('Network Error'));

    render(<StudentDokumenti studentId={mockStudentId} />);

    // Komponenta u catch bloku postavlja loading na false, pa tekst učitavanja nestaje
    await waitFor(() => {
      expect(screen.queryByText(/Učitavam dokumente.../i)).not.toBeInTheDocument();
    });

    // Pošto nema fallback poruke za grešku u komponenti, ostaće prikazan naslov sa praznom listom
    expect(screen.getByText(/Moji elektronski dokumenti i šabloni/i)).toBeInTheDocument();
    expect(screen.getByText(/Nemate pridruženih dokumenata./i)).toBeInTheDocument();

    spy.mockRestore();
  });

});
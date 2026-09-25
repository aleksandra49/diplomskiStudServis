import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FinansijskaKartica from './FinansijskaKartica';
import { getTransakcijeByStudentId } from '../api/transakcijeService';

// 1. Mockujemo servis za transakcije kako bismo simulirali različite odgovore back-enda
jest.mock('../api/transakcijeService', () => ({
  getTransakcijeByStudentId: jest.fn(),
}));

// 2. Mockujemo UplataForma komponentu da bismo mogli izolovano da testiramo FinansijskuKarticu
// ali i da simuliramo uspešnu uplatu i poziv callback-a (integracioni aspekt)
jest.mock('./UplataForma', () => ({ onUplataUspesna }) => (
  <div data-testid="uplata-forma">
    <button onClick={onUplataUspesna} data-testid="simuliraj-uplatu-btn">
      Simuliraj uplatu
    </button>
  </div>
));

describe('FinansijskaKartica - Testovi komponente', () => {
  const mockStudentId = '456';
  const mockStanje = '12500.50';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('prikazuje poruku o učitavanju (loading), a zatim uspešno učitava i prikazuje transakcije', async () => {
    const mockTransakcije = [
      { id: 1, datum: '2026-09-18T12:30:00', opis: 'Uplata skolarine', tip: 'Uplata', iznos: 10000 },
      { id: 2, datum: '2026-09-19T09:15:00', opis: 'Izdavanje uverenja', tip: 'Zaduzenje', iznos: -500 }
    ];

    getTransakcijeByStudentId.mockResolvedValueOnce({ data: mockTransakcije });

    render(<FinansijskaKartica studentId={mockStudentId} stanjeRacuna={mockStanje} />);

    // Provera da li se kreće sa stanjem učitavanja
    expect(screen.getByText(/učitavanje finansijske kartice/i)).toBeInTheDocument();

    // Provera da li se šalje odgovarajući zahtev sa ispravnim podacima (studentId)
    expect(getTransakcijeByStudentId).toHaveBeenCalledWith(mockStudentId);

    // Čekamo da se podaci učitaju i da loading nestane
    await waitFor(() => {
      expect(screen.queryByText(/učitavanje finansijske kartice/i)).not.toBeInTheDocument();
    });

    // Proveravamo da li aplikacija ispravno prikazuje prosleđeno stanje računa
    expect(screen.getByText('12500.50 RSD')).toBeInTheDocument();

    // Proveravamo da li se instrukcije za uplatu ispravno prikazuju
    expect(screen.getByText(/Račun fakulteta: 840-12345678-90/i)).toBeInTheDocument();

    // Proveravamo da li su transakcije uspešno izrenderovane u tabeli
    expect(screen.getByText('Uplata skolarine')).toBeInTheDocument();
    expect(screen.getByText('+10000 RSD')).toBeInTheDocument();
    expect(screen.getByText('Izdavanje uverenja')).toBeInTheDocument();
    expect(screen.getByText('-500 RSD')).toBeInTheDocument();
    
    // Proveravamo formatiranje datuma (zamena 'T' sa razmakom)
    expect(screen.getByText('2026-09-18 12:30:00')).toBeInTheDocument();
  });

  test('prikazuje poruku kada nema zabeleženih transakcija (prazna lista)', async () => {
    // Simuliramo odgovor sa praznim nizom
    getTransakcijeByStudentId.mockResolvedValueOnce({ data: [] });

    render(<FinansijskaKartica studentId={mockStudentId} stanjeRacuna="0.00" />);

    await waitFor(() => {
      expect(screen.queryByText(/učitavanje finansijske kartice/i)).not.toBeInTheDocument();
    });

    // Provera prikaza poruke za praznu tabelu
    expect(screen.getByText('Nema zabeleženih transakcija.')).toBeInTheDocument();
  });

  test('ispravno obrađuje grešku sa back-enda ukoliko padne učitavanje transakcija', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getTransakcijeByStudentId.mockRejectedValueOnce(new Error('Greška servera'));

    render(<FinansijskaKartica studentId={mockStudentId} stanjeRacuna="1000" />);

    await waitFor(() => {
      expect(screen.queryByText(/učitavanje finansijske kartice/i)).not.toBeInTheDocument();
    });

    // Proveravamo da li je greška uhvaćena i zabeležena u konzoli, a aplikacija ostala stabilna (prikazuje praznu tabelu)
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(screen.getByText('Nema zabeleženih transakcija.')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  test('osvežava (ponovo učitava) transakcije nakon uspešne uplate preko forme', async () => {
    const mockInitialTransakcije = [];
    const mockUpdatedTransakcije = [
      { id: 10, datum: '2026-09-19T14:00:00', opis: 'Nova uplata', tip: 'Uplata', iznos: 3000 }
    ];

    // Prvi poziv vraća praznu listu, drugi poziv (nakon uplate) vraća novu transakciju
    getTransakcijeByStudentId
      .mockResolvedValueOnce({ data: mockInitialTransakcije })
      .mockResolvedValueOnce({ data: mockUpdatedTransakcije });

    const mockOnUplataUspesna = jest.fn();

    render(
      <FinansijskaKartica 
        studentId={mockStudentId} 
        stanjeRacuna="1000" 
        onUplataUspesna={mockOnUplataUspesna} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Nema zabeleženih transakcija.')).toBeInTheDocument();
    });

    // Simuliramo klik na uspešnu uplatu u formi
    const dugmeUplata = screen.getByTestId('simuliraj-uplatu-btn');
    await userEvent.click(dugmeUplata);

    // Proveravamo da li je API pozvan ponovo da osveži podatke
    expect(getTransakcijeByStudentId).toHaveBeenCalledTimes(2);

    // Proveravamo da li je prosleđeni spoljni callback prop uspešno izvršen
    expect(mockOnUplataUspesna).toHaveBeenCalled();

    // Proveravamo da li se nova transakcija sada prikazuje
    await waitFor(() => {
      expect(screen.getByText('Nova uplata')).toBeInTheDocument();
      expect(screen.getByText('+3000 RSD')).toBeInTheDocument();
    });
  });
});
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AdminPredmeti from './AdminPredmeti';
import { getPredmeti, dodajPredmet, obrisiPredmet, getNastavniciZaPredmet } from '../api/predmetiService';
import { toast } from 'react-toastify';

// Mockovanje servisa i toast-a
jest.mock('../api/predmetiService');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const mockPredmeti = [
  { id: 1, naziv: 'Matematika 1', espb: 6, semestar: 1 },
  { id: 2, naziv: 'Osnove programiranja', espb: 6, semestar: 2 },
];

const mockNastavnici = [
  { id: 1, ime: 'Petar', prezime: 'Petrović', zvanje: 'Redovni profesor', ulogaNaPredmetu: 'Predavanja' },
];

describe('AdminPredmeti Component - Comprehensive Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Sakriva ružne console.error izlaze u konzoli tokom testiranja grešaka
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  // 1. HAPPY PATH: Inicijalno učitavanje
  test('učitava i prikazuje listu predmeta pri montiranju', async () => {
    getPredmeti.mockResolvedValueOnce({ data: mockPredmeti });

    render(<AdminPredmeti />);

    expect(screen.getByText(/upravljanje predmetima/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Matematika 1')).toBeInTheDocument();
      expect(screen.getByText('Osnove programiranja')).toBeInTheDocument();
    });
  });

  // 2. ERROR PATH: Greška pri učitavanju predmeta
  test('prikazuje toast grešku ako učitavanje predmeta ne uspe', async () => {
    getPredmeti.mockRejectedValueOnce(new Error('Network Error'));

    render(<AdminPredmeti />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Greška pri učitavanju predmeta.');
    });
  });

  // 3. PRETRAGA: Filtriranje predmeta i scenario kada nema rezultata
  test('omogućava pretragu predmeta i prikazuje poruku ako nema pronađenih predmeta', async () => {
    getPredmeti.mockResolvedValue({ data: mockPredmeti });

    render(<AdminPredmeti />);

    await waitFor(() => {
      expect(screen.getByText('Matematika 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/pretraži po nazivu predmeta/i);
    
    // Pretraga postojećeg
    await userEvent.type(searchInput, 'Mat');
    expect(screen.getByText('Matematika 1')).toBeInTheDocument();
    expect(screen.queryByText('Osnove programiranja')).not.toBeInTheDocument();

    // Pretraga nepostojećeg (prazna tabela / "Nema pronađenih predmeta")
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'NepostojeciPredmet');

    await waitFor(() => {
      expect(screen.getByText(/nema pronađenih predmeta/i)).toBeInTheDocument();
    });

    // Brisanje pretrage vraća celu listu (prazan string u pretrazi okida ucitajPredmete)
    await userEvent.clear(searchInput);
    await waitFor(() => {
      expect(screen.getByText('Matematika 1')).toBeInTheDocument();
      expect(screen.getByText('Osnove programiranja')).toBeInTheDocument();
    });
  });

  // 4. PRETRAGA ERROR: Greška pri pretrazi
  test('hvata grešku u konzoli ako pretraga/getPredmeti baci izuzetak', async () => {
    getPredmeti.mockResolvedValueOnce({ data: mockPredmeti }); // Za inicijalni render
    render(<AdminPredmeti />);

    await waitFor(() => {
      expect(screen.getByText('Matematika 1')).toBeInTheDocument();
    });

    // Sledeći poziv getPredmeti unutar handleSearch baca grešku
    getPredmeti.mockRejectedValueOnce(new Error('Search error'));
    const searchInput = screen.getByPlaceholderText(/pretraži po nazivu predmeta/i);
    await userEvent.type(searchInput, 'Test');

    // Čekamo da se asinhroni poziv završi i proveravamo da je funkcija pozvana više puta
    await waitFor(() => {
      expect(getPredmeti.mock.calls.length).toBeGreaterThan(1);
    });
  });

  // 5. DODAVANJE PREDMETA (Happy Path)
  test('uspešno dodaje novi predmet i resetuje formu', async () => {
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    dodajPredmet.mockResolvedValueOnce({ data: { id: 3, naziv: 'Engleski 1', espb: 5, semestar: 1 } });

    render(<AdminPredmeti />);

    await waitFor(() => {
      expect(screen.getByText('Matematika 1')).toBeInTheDocument();
    });

    const nazivInput = screen.getByPlaceholderText(/npr. matematika/i);
    const submitBtn = screen.getByRole('button', { name: /sačuvaj predmet/i });

    await userEvent.type(nazivInput, 'Engleski 1');
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(dodajPredmet).toHaveBeenCalledWith({
        naziv: 'Engleski 1',
        espb: 6,
        semestar: 1,
      });
      expect(toast.success).toHaveBeenCalledWith('Predmet uspešno dodat!');
    });
  });

  // 6. DODAVANJE PREDMETA (Error Path)
  test('prikazuje toast grešku ako dodavanje predmeta ne uspe', async () => {
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    dodajPredmet.mockRejectedValueOnce(new Error('Add failed'));

    render(<AdminPredmeti />);

    await waitFor(() => {
      expect(screen.getByText('Matematika 1')).toBeInTheDocument();
    });

    // Popunjavamo obavezna polja da bi forma mogla da se submituje
    const nazivInput = screen.getByPlaceholderText(/npr. matematika/i);
    await userEvent.type(nazivInput, 'Engleski 1');

    const submitBtn = screen.getByRole('button', { name: /sačuvaj predmet/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Došlo je do greške pri dodavanju predmeta.');
    });
  });

  // 7. BRISANJE PREDMETA (Korisnik odustaje preko window.confirm)
  test('ne briše predmet ako korisnik otkaže window.confirm', async () => {
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    window.confirm = jest.fn().mockReturnValue(false);

    render(<AdminPredmeti />);

    await waitFor(() => {
      expect(screen.getByText('Matematika 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /obriši/i });
    await userEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(obrisiPredmet).not.toHaveBeenCalled();
  });

  // 8. BRISANJE PREDMETA (Uspešno brisanje, uključujući i resetovanje trenutno prikazanog predmeta)
  test('uspešno briše predmet i čisti prikazane nastavnike ako je obrisani predmet bio selektovan', async () => {
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    getNastavniciZaPredmet.mockResolvedValueOnce({ data: mockNastavnici });
    obrisiPredmet.mockResolvedValueOnce({});
    window.confirm = jest.fn().mockReturnValue(true);

    render(<AdminPredmeti />);

    await waitFor(() => {
      expect(screen.getByText('Matematika 1')).toBeInTheDocument();
    });

    // Prvo selektujemo Matematiku (id: 1) da popunimo `prikazaniPredmet`
    await userEvent.click(screen.getByText('Matematika 1'));
    await waitFor(() => {
      expect(screen.getByText(/nastavnici koji predaju predmet: matematika/i)).toBeInTheDocument();
    });

    // Sada brišemo predmet sa id: 1
    const deleteButtons = screen.getAllByRole('button', { name: /obriši/i });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(obrisiPredmet).toHaveBeenCalledWith(1);
      expect(toast.info).toHaveBeenCalledWith('Predmet je uspešno obrisan.');
      // Proveravamo da li je sekcija sa nastavnicima uklonjena (prikazaniPredmet postavljen na null)
      expect(screen.queryByText(/nastavnici koji predaju predmet:/i)).not.toBeInTheDocument();
    });
  });

  // 9. BRISANJE PREDMETA (Error Path)
  test('prikazuje toast grešku ako brisanje predmeta ne uspe', async () => {
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    obrisiPredmet.mockRejectedValueOnce(new Error('Delete failed'));
    window.confirm = jest.fn().mockReturnValue(true);

    render(<AdminPredmeti />);

    await waitFor(() => {
      expect(screen.getByText('Matematika 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /obriši/i });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Došlo je do greške pri brisanju.');
    });
  });

  // 10. PRIKAZ NASTAVNIKA ZA PREDMET (Prazna lista i Fallback na N/A)
  test('prikazuje poruku da nema nastavnika i obračunava N/A vrednosti za formatiranje imena/zvanja', async () => {
    const mockNastavniciPraznoIliBezPodataka = [
      { id: 1, ulogaNaPredmetu: 'Vežbe' } // Nema ime, prezime, zvanje, ni nastavnikImePrezime
    ];
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    getNastavniciZaPredmet.mockResolvedValueOnce({ data: mockNastavniciPraznoIliBezPodataka });

    render(<AdminPredmeti />);

    await waitFor(() => {
      expect(screen.getByText('Matematika 1')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Matematika 1'));

    await waitFor(() => {
      // Koristimo getAllByText pošto se 'N/A' javlja i za ime i za zvanje
      const naElements = screen.getAllByText('N/A');
      expect(naElements.length).toBeGreaterThanOrEqual(1);
    });

    // Testiramo i slučaj kada je lista nastavnika potpuno prazna
    getNastavniciZaPredmet.mockResolvedValueOnce({ data: [] });
    await userEvent.click(screen.getByText('Osnove programiranja'));

    await waitFor(() => {
      expect(screen.getByText(/trenutno nijedan nastavnik nije dodeljen ovom predmetu/i)).toBeInTheDocument();
    });
  });
});
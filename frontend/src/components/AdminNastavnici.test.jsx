import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AdminNastavnici from './AdminNastavnici';
import { 
  getNastavnici, 
  dodajNastavnika, 
  obrisiNastavnika, 
  dodeliPredmetNastavniku, 
  getPredmetiZaNastavnika, 
  kloniPredavanjeSaNastavnika, 
  ukloniPredavanjeSaNastavnika 
} from '../api/nastavniciService';
import { getPredmeti } from '../api/predmetiService';

// Mockovanje servisa
jest.mock('../api/nastavniciService');
jest.mock('../api/predmetiService');

const mockNastavnici = [
  { id: 1, ime: 'Petar', prezime: 'Petrović', email: 'petar@mail.com', zvanje: 'Profesor', korisnikId: 10 },
  { id: 2, ime: 'Ana', prezime: 'Anić', email: 'ana@mail.com', zvanje: 'Asistent', korisnikId: 11 },
];

const mockPredmeti = [
  { id: 1, naziv: 'Matematika' },
  { id: 2, naziv: 'Fizika' },
];

const mockPredmetiNastavnika = [
  { id: 100, predmetNaziv: 'Matematika', ulogaNaPredmetu: 'PROFESOR' }
];

describe('AdminNastavnici Component - Comprehensive Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Sakriva console.error izlaze tokom testiranja grešaka
    window.alert = jest.fn(); // Mockovanje alert-a da ne blokira testove
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  // 1. HAPPY PATH: Inicijalno učitavanje
  test('učitava i prikazuje listu nastavnika i predmeta pri montiranju', async () => {
    getNastavnici.mockResolvedValueOnce({ data: mockNastavnici });
    getPredmeti.mockResolvedValueOnce({ data: mockPredmeti });

    render(<AdminNastavnici />);

    expect(screen.getByText(/upravljanje nastavnicima i dodela predmeta/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Petar Petrović')).toBeInTheDocument();
      expect(screen.getByText('Ana Anić')).toBeInTheDocument();
    });
  });

  // 2. ERROR PATH: Greška pri učitavanju podataka
  test('hvata grešku u konzoli ako učitavanje podataka ne uspe', async () => {
    getNastavnici.mockRejectedValueOnce(new Error('Network Error'));
    getPredmeti.mockResolvedValueOnce({ data: mockPredmeti });

    render(<AdminNastavnici />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  // 3. PRETRAGA: Filtriranje nastavnika
  test('omogućava pretragu nastavnika po imenu ili prezimenu', async () => {
    getNastavnici.mockResolvedValue({ data: mockNastavnici });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });

    render(<AdminNastavnici />);

    await waitFor(() => {
      expect(screen.getByText('Petar Petrović')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/pretraži po imenu ili prezimenu/i);
    
    // Pretraga postojećeg
    await userEvent.type(searchInput, 'Petar');
    expect(screen.getByText('Petar Petrović')).toBeInTheDocument();
    expect(screen.queryByText('Ana Anić')).not.toBeInTheDocument();

    // Brisanje pretrage vraća celu listu
    await userEvent.clear(searchInput);
    await waitFor(() => {
      expect(screen.getByText('Petar Petrović')).toBeInTheDocument();
      expect(screen.getByText('Ana Anić')).toBeInTheDocument();
    });
  });

  // 4. DODAVANJE NASTAVNIKA (Happy Path)
  test('uspešno dodaje novog nastavnika i osvežava listu', async () => {
    getNastavnici.mockResolvedValue({ data: mockNastavnici });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    dodajNastavnika.mockResolvedValueOnce({ data: { id: 3 } });

    render(<AdminNastavnici />);

    await waitFor(() => {
      expect(screen.getByText('Petar Petrović')).toBeInTheDocument();
    });

    // Korišćenje role/textbox umesto getByLabelText da se izbegnu problemi sa eksplicitnim htmlFor vezama
    const textboxes = screen.getAllByRole('textbox');
    const imeInput = textboxes[0];
    const prezimeInput = textboxes[1];
    const emailInput = textboxes[2];
    const submitBtn = screen.getByRole('button', { name: /sačuvaj nastavnika/i });

    await userEvent.type(imeInput, 'Milan');
    await userEvent.type(prezimeInput, 'Milanović');
    await userEvent.type(emailInput, 'milan@mail.com');
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(dodajNastavnika).toHaveBeenCalledWith({
        ime: 'Milan',
        prezime: 'Milanović',
        email: 'milan@mail.com',
        zvanje: 'Profesor',
      });
      expect(window.alert).toHaveBeenCalledWith('Nastavnik uspešno dodat!');
    });
  });

  // 5. DODELA PREDMETA NASTAVNIKU
  test('uspešno dodeljuje predmet izabranom nastavniku', async () => {
    getNastavnici.mockResolvedValue({ data: mockNastavnici });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    dodeliPredmetNastavniku.mockResolvedValueOnce({});
    getPredmetiZaNastavnika.mockResolvedValue({ data: mockPredmetiNastavnika });

    render(<AdminNastavnici />);

    await waitFor(() => {
      expect(screen.getByText('Petar Petrović')).toBeInTheDocument();
    });

    // Klik na dugme "Dodeli predmet"
    const dodeliBtn = screen.getByRole('button', { name: /dodeli predmet/i });
    await userEvent.click(dodeliBtn);

    await waitFor(() => {
      expect(dodeliPredmetNastavniku).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Predmet uspešno dodeljen nastavniku!');
    });
  });

  // 6. PRIKAZ PROFILA I PREDMETA NASTAVNIKA
  test('prikazuje dosije nastavnika i njegove predmete kada se klikne na ime', async () => {
    getNastavnici.mockResolvedValue({ data: mockNastavnici });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    getPredmetiZaNastavnika.mockResolvedValueOnce({ data: mockPredmetiNastavnika });

    render(<AdminNastavnici />);

    await waitFor(() => {
      expect(screen.getByText('Petar Petrović')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Petar Petrović'));

    await waitFor(() => {
      const dosijeHeader = screen.getByText(/dosije nastavnika: petar petrović/i);
      expect(dosijeHeader).toBeInTheDocument();
      
      // Proveravamo da se 'Matematika' nalazi unutar sekcije dosijea da bismo izbegli konflikt sa opcijama u select elementu
      const dosijeContainer = dosijeHeader.closest('div') || document.body;
      expect(within(dosijeContainer).getByText('Matematika')).toBeInTheDocument();
    });
  });

  // 7. BRISANJE NASTAVNIKA (Korisnik odustaje)
  test('ne briše nastavnika ako korisnik otkaže window.confirm', async () => {
    getNastavnici.mockResolvedValue({ data: mockNastavnici });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    window.confirm = jest.fn().mockReturnValue(false);

    render(<AdminNastavnici />);

    await waitFor(() => {
      expect(screen.getByText('Petar Petrović')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /obriši/i });
    await userEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(obrisiNastavnika).not.toHaveBeenCalled();
  });

  // 8. BRISANJE NASTAVNIKA (Uspešno)
  test('uspešno briše nastavnika i čisti selektovani profil ako je bio prikazan', async () => {
    getNastavnici.mockResolvedValue({ data: mockNastavnici });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    getPredmetiZaNastavnika.mockResolvedValueOnce({ data: mockPredmetiNastavnika });
    obrisiNastavnika.mockResolvedValueOnce({});
    window.confirm = jest.fn().mockReturnValue(true);

    render(<AdminNastavnici />);

    await waitFor(() => {
      expect(screen.getByText('Petar Petrović')).toBeInTheDocument();
    });

    // Prvo selektujemo profesora da se prikaže dosije
    await userEvent.click(screen.getByText('Petar Petrović'));
    await waitFor(() => {
      expect(screen.getByText(/dosije nastavnika: petar petrović/i)).toBeInTheDocument();
    });

    // Brisanje prvog nastavnika
    const deleteButtons = screen.getAllByRole('button', { name: /obriši/i });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(obrisiNastavnika).toHaveBeenCalledWith(1);
      expect(screen.queryByText(/dosije nastavnika:/i)).not.toBeInTheDocument();
    });
  });

  // 9. UKLANJANJE PREDAVANJA SA NASTAVNIKA
  test('uspešno uklanja predmet sa nastavnika nakon potvrde', async () => {
    getNastavnici.mockResolvedValue({ data: mockNastavnici });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    getPredmetiZaNastavnika.mockResolvedValue({ data: mockPredmetiNastavnika });
    ukloniPredavanjeSaNastavnika.mockResolvedValueOnce({});
    window.confirm = jest.fn().mockReturnValue(true);

    render(<AdminNastavnici />);

    await waitFor(() => {
      expect(screen.getByText('Petar Petrović')).toBeInTheDocument();
    });

    // Otvaramo profil nastavnika
    await userEvent.click(screen.getByText('Petar Petrović'));
    
    await waitFor(() => {
      const dosijeHeader = screen.getByText(/dosije nastavnika: petar petrović/i);
      expect(dosijeHeader).toBeInTheDocument();
    });

    // Klik na dugme "Ukloni" u tabeli predmeta
    const ukloniBtn = screen.getByRole('button', { name: /ukloni/i });
    await userEvent.click(ukloniBtn);

    await waitFor(() => {
      expect(ukloniPredavanjeSaNastavnika).toHaveBeenCalledWith(100);
    });
  });
});
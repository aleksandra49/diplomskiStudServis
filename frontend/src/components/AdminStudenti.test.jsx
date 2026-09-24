import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AdminStudenti from './AdminStudenti';
import { 
  getStudenti, 
  dodajStudenta, 
  obrisiStudenta, 
  pretraziStudentePoIndeksu,
  dodeliPredmetStudentu, 
  getPredmetiZaStudenta, 
  ukloniPohadjanjeStudenta 
} from '../api/studentiService';
import { getPredmeti } from '../api/predmetiService';

// Mockovanje servisa
jest.mock('../api/studentiService');
jest.mock('../api/predmetiService');

const mockStudenti = [
  { id: 1, ime: 'Marko', prezime: 'Marković', email: 'marko@mail.com', brojIndeksa: 'E1/2023', godinaStudija: 1, stanjeRacuna: 0.0 },
  { id: 2, ime: 'Jovana', prezime: 'Jović', email: 'jovana@mail.com', brojIndeksa: 'E2/2023', godinaStudija: 2, stanjeRacuna: 1500.0 },
];

const mockPredmeti = [
  { id: 1, naziv: 'Matematika 1' },
  { id: 2, naziv: 'Osnove programiranja' },
];

const mockPredmetiStudenta = [
  { id: 200, predmetNaziv: 'Matematika 1' }
];

describe('AdminStudenti Component - Comprehensive Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Sakriva console.error izlaze
    window.alert = jest.fn(); // Mockovanje alert-a
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  // 1. HAPPY PATH: Inicijalno učitavanje
  test('učitava i prikazuje listu studenata i predmeta pri montiranju', async () => {
    getStudenti.mockResolvedValueOnce({ data: mockStudenti });
    getPredmeti.mockResolvedValueOnce({ data: mockPredmeti });

    render(<AdminStudenti />);

    expect(screen.getByText(/upravljanje studentima i pohađanje predmeta/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Marko Marković')).toBeInTheDocument();
      expect(screen.getByText('Jovana Jović')).toBeInTheDocument();
    });
  });

  // 2. ERROR PATH: Greška pri učitavanju podataka
  test('hvata grešku u konzoli ako učitavanje podataka ne uspe', async () => {
    getStudenti.mockRejectedValueOnce(new Error('Network Error'));
    getPredmeti.mockResolvedValueOnce({ data: mockPredmeti });

    render(<AdminStudenti />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  // 3. PRETRAGA: Filtriranje studenata po indeksu
  test('omogućava pretragu studenata po broju indeksa', async () => {
    getStudenti.mockResolvedValue({ data: mockStudenti });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    pretraziStudentePoIndeksu.mockResolvedValueOnce({ data: [mockStudenti[0]] });

    render(<AdminStudenti />);

    await waitFor(() => {
      expect(screen.getByText('Marko Marković')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/pretraži po broju indeksa/i);
    
    await userEvent.type(searchInput, 'E1/2023');

    await waitFor(() => {
      expect(pretraziStudentePoIndeksu).toHaveBeenCalledWith('E1/2023');
      expect(screen.getByText('Marko Marković')).toBeInTheDocument();
      expect(screen.queryByText('Jovana Jović')).not.toBeInTheDocument();
    });
  });

  // 4. DODAVANJE STUDENTA (Happy Path)
  test('uspešno dodaje novog studenta i osvežava listu', async () => {
    getStudenti.mockResolvedValue({ data: mockStudenti });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    dodajStudenta.mockResolvedValueOnce({ data: { id: 3 } });

    render(<AdminStudenti />);

    await waitFor(() => {
      expect(screen.getByText('Marko Marković')).toBeInTheDocument();
    });

    const textboxes = screen.getAllByRole('textbox');
    const imeInput = textboxes[0];
    const prezimeInput = textboxes[1];
    const emailInput = textboxes[2];
    const indeksInput = textboxes[3];
    const submitBtn = screen.getByRole('button', { name: /sačuvaj studenta/i });

    await userEvent.type(imeInput, 'Stefan');
    await userEvent.type(prezimeInput, 'Stefanović');
    await userEvent.type(emailInput, 'stefan@mail.com');
    await userEvent.type(indeksInput, 'E3/2023');
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(dodajStudenta).toHaveBeenCalledWith({
        ime: 'Stefan',
        prezime: 'Stefanović',
        email: 'stefan@mail.com',
        brojIndeksa: 'E3/2023',
        godinaStudija: 1,
        stanjeRacuna: 0.0,
      });
      expect(window.alert).toHaveBeenCalledWith('Student uspešno dodat!');
    });
  });

  // 5. DODELA PREDMETA STUDENTU
  test('uspešno dodeljuje predmet izabranom studentu', async () => {
    getStudenti.mockResolvedValue({ data: mockStudenti });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    dodeliPredmetStudentu.mockResolvedValueOnce({});
    getPredmetiZaStudenta.mockResolvedValue({ data: mockPredmetiStudenta });

    render(<AdminStudenti />);

    await waitFor(() => {
      expect(screen.getByText('Marko Marković')).toBeInTheDocument();
    });

    const dodeliBtn = screen.getByRole('button', { name: /dodeli predmet/i });
    await userEvent.click(dodeliBtn);

    await waitFor(() => {
      expect(dodeliPredmetStudentu).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Predmet uspešno dodeljen studentu!');
    });
  });

  // 6. PRIKAZ PROFILA I PREDMETA STUDENTA
  test('prikazuje dosije studenta i njegove predmete kada se klikne na ime', async () => {
    getStudenti.mockResolvedValue({ data: mockStudenti });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    getPredmetiZaStudenta.mockResolvedValueOnce({ data: mockPredmetiStudenta });

    render(<AdminStudenti />);

    await waitFor(() => {
      expect(screen.getByText('Marko Marković')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Marko Marković'));

    await waitFor(() => {
      const dosijeHeader = screen.getByText(/dosije studenta: marko marković/i);
      expect(dosijeHeader).toBeInTheDocument();
      
      const dosijeContainer = dosijeHeader.closest('div') || document.body;
      expect(within(dosijeContainer).getByText('Matematika 1')).toBeInTheDocument();
    });
  });

  // 7. BRISANJE STUDENTA (Korisnik odustaje)
  test('ne briše studenta ako korisnik otkaže window.confirm', async () => {
    getStudenti.mockResolvedValue({ data: mockStudenti });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    window.confirm = jest.fn().mockReturnValue(false);

    render(<AdminStudenti />);

    await waitFor(() => {
      expect(screen.getByText('Marko Marković')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /obriši/i });
    await userEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(obrisiStudenta).not.toHaveBeenCalled();
  });

  // 8. UKLANJANJE POHAĐANJA SA STUDENTA
  test('uspešno uklanja pohađanje predmeta sa studenta nakon potvrde', async () => {
    getStudenti.mockResolvedValue({ data: mockStudenti });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    getPredmetiZaStudenta.mockResolvedValue({ data: mockPredmetiStudenta });
    ukloniPohadjanjeStudenta.mockResolvedValueOnce({});
    window.confirm = jest.fn().mockReturnValue(true);

    render(<AdminStudenti />);

    await waitFor(() => {
      expect(screen.getByText('Marko Marković')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Marko Marković'));
    
    await waitFor(() => {
      const dosijeHeader = screen.getByText(/dosije studenta: marko marković/i);
      expect(dosijeHeader).toBeInTheDocument();
    });

    const ukloniBtn = screen.getByRole('button', { name: /ukloni/i });
    await userEvent.click(ukloniBtn);

    await waitFor(() => {
      expect(ukloniPohadjanjeStudenta).toHaveBeenCalledWith(200);
    });
  });

  //9. provera da li pokusvamo da dodamo studenta sa istim indeksom
  test('prikazuje poruku o grešci ako dodavanje studenta ne uspe', async () => {
    getStudenti.mockResolvedValue({ data: mockStudenti });
    getPredmeti.mockResolvedValue({ data: mockPredmeti });
    dodajStudenta.mockRejectedValueOnce(new Error('Duplicate index'));

    render(<AdminStudenti />);

    await waitFor(() => {
      expect(screen.getByText('Marko Marković')).toBeInTheDocument();
    });

    const textboxes = screen.getAllByRole('textbox');
    const imeInput = textboxes[0];
    const prezimeInput = textboxes[1];
    const emailInput = textboxes[2];
    const indeksInput = textboxes[3];
    const submitBtn = screen.getByRole('button', { name: /sačuvaj studenta/i });

    // Unos podataka
    await userEvent.type(imeInput, 'Petar');
    await userEvent.type(prezimeInput, 'Perić');
    await userEvent.type(emailInput, 'petar@mail.com');
    await userEvent.type(indeksInput, 'E1/2023'); // Simuliramo duplikat ili pogrešan podatak
    await userEvent.click(submitBtn);

    // Proveravamo da li je pozvan alert sa porukom o grešci iz komponente
    await waitFor(() => {
      expect(dodajStudenta).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        'Došlo je do greške. Proveri da li je broj indeksa jedinstven.'
      );
    });
  });
});
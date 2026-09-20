import axiosInstance from './axiosInstance';
import { getNastavnikByKorisnikId, getPredmetiByNastavnik } from './nastavnikService'; 

// ==========================================
// JEDINIČNI (UNIT) TESTOVI
// ==========================================
// Zašto su ovo jedinični testovi?
// Zato što testiramo isključivo pojedinačne funkcije iz API servisa izolovano od komponenti 
// i korisničkog interfejsa. Proveravamo da li funkcije ispravno formiraju složene URL putanje 
// sa prosleđenim ID-jevima i šalju odgovarajuće GET zahteve ka Axios-u.
// ==========================================

jest.mock('./axiosInstance');

describe('Nastavnici Servis (Dodatne funkcije) - Unit testovi', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getNastavnikByKorisnikId šalje GET zahtev sa ID-jem korisnika', async () => {
    const korisnikId = 15;
    const mockNastavnik = { id: 3, korisnikId: 15, ime: 'Petar Petrović' };
    axiosInstance.get.mockResolvedValueOnce({ data: mockNastavnik });

    const result = await getNastavnikByKorisnikId(korisnikId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/nastavnici/korisnik/${korisnikId}`);
    expect(result.data).toEqual(mockNastavnik);
  });

  test('getPredmetiByNastavnik šalje GET zahtev sa ID-jem nastavnika za listu predmeta', async () => {
    const nastavnikId = 3;
    const mockPredmeti = [{ id: 101, naziv: 'Baze podataka' }];
    axiosInstance.get.mockResolvedValueOnce({ data: mockPredmeti });

    const result = await getPredmetiByNastavnik(nastavnikId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/nastavnici/${nastavnikId}/predmeti`);
    expect(result.data).toEqual(mockPredmeti);
  });

});
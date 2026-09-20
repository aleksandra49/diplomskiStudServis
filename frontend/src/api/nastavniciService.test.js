import axiosInstance from './axiosInstance';
import {
  getNastavnici,
  dodajNastavnika,
  obrisiNastavnika,
  dodeliPredmetNastavniku,
  getPredmetiZaNastavnika,
  ukloniPredavanjeSaNastavnika
} from './nastavniciService'; 

// ==========================================
// JEDINIČNI (UNIT) TESTOVI
// ==========================================
// Zašto su ovo jedinični testovi?
// Zato što testiramo izolovane funkcije iz API servisa za rad sa nastavnicima i predavanjima.
// Potpuno su odvojene od React komponenti i grafičkog interfejsa. Ovde testiramo samo 
// ispravnost formiranja URL putanja i slanje GET, POST i DELETE zahteva ka Axios-u.
// ==========================================

jest.mock('./axiosInstance');

describe('Nastavnici Service - Unit testovi', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getNastavnici šalje GET zahtev za dobijanje liste svih nastavnika', async () => {
    const mockNastavnici = [{ id: 1, ime: 'Jovan Jovanović' }];
    axiosInstance.get.mockResolvedValueOnce({ data: mockNastavnici });

    const result = await getNastavnici();

    expect(axiosInstance.get).toHaveBeenCalledWith('/nastavnici');
    expect(result.data).toEqual(mockNastavnici);
  });

  test('dodajNastavnika šalje POST zahtev sa podacima novog nastavnika', async () => {
    const noviNastavnik = { ime: 'Ana', prezime: 'Anić', email: 'ana@uni.rs' };
    axiosInstance.post.mockResolvedValueOnce({ data: { id: 5, ...noviNastavnik } });

    await dodajNastavnika(noviNastavnik);

    expect(axiosInstance.post).toHaveBeenCalledWith('/nastavnici', noviNastavnik);
  });

  test('obrisiNastavnika šalje DELETE zahtev sa ID-jem nastavnika', async () => {
    const nastavnikId = 2;
    axiosInstance.delete.mockResolvedValueOnce({ data: 'Obrisano' });

    await obrisiNastavnika(nastavnikId);

    expect(axiosInstance.delete).toHaveBeenCalledWith(`/nastavnici/${nastavnikId}`);
  });

  test('dodeliPredmetNastavniku šalje POST zahtev sa podacima o predavanju', async () => {
    const podaciPredavanja = { nastavnikId: 3, predmetId: 10 };
    axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });

    await dodeliPredmetNastavniku(podaciPredavanja);

    expect(axiosInstance.post).toHaveBeenCalledWith('/predavanja', podaciPredavanja);
  });

  test('getPredmetiZaNastavnika šalje GET zahtev sa ID-jem nastavnika', async () => {
    const nastavnikId = 3;
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getPredmetiZaNastavnika(nastavnikId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/predavanja/nastavnik/${nastavnikId}`);
  });

  test('ukloniPredavanjeSaNastavnika šalje DELETE zahtev sa ID-jem predavanja', async () => {
    const predavanjeId = 7;
    axiosInstance.delete.mockResolvedValueOnce({ data: 'Uklonjeno' });

    await ukloniPredavanjeSaNastavnika(predavanjeId);

    expect(axiosInstance.delete).toHaveBeenCalledWith(`/predavanja/${predavanjeId}`);
  });

});
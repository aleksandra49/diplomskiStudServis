import axiosInstance from './axiosInstance';
import {
  getPredmeti,
  dodajPredmet,
  obrisiPredmet,
  getNastavniciZaPredmet,
  getProfesorZaPredmet
} from './predmetiService'; // Prilagodi putanju do tvog fajla (npr. ./predmetiService)

// ==========================================
// JEDINIČNI (UNIT) TESTOVI
// ==========================================
// Zašto su ovo jedinični testovi?
// Zato što testiramo isključivo funkcije iz API servisa za predmete, izolovano od bilo kakvih 
// komponenti ili korisničkog interfejsa. Proveravamo ispravnost slanja GET, POST i DELETE zahteva, 
// prosleđivanje ID-jeva, kao i transformaciju podataka (npr. vraćanje response.data).
// ==========================================

jest.mock('./axiosInstance');

describe('Predmeti Service - Unit testovi', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getPredmeti šalje GET zahtev za sve predmete', async () => {
    const mockPredmeti = [{ id: 1, naziv: 'Matematika' }];
    axiosInstance.get.mockResolvedValueOnce({ data: mockPredmeti });

    const result = await getPredmeti();

    expect(axiosInstance.get).toHaveBeenCalledWith('/predmeti');
    expect(result.data).toEqual(mockPredmeti);
  });

  test('dodajPredmet šalje POST zahtev sa podacima novog predmeta', async () => {
    const noviPredmet = { naziv: 'Matematika', semestar: 'I', espb: 6 };
    axiosInstance.post.mockResolvedValueOnce({ data: { id: 10, ...noviPredmet } });

    await dodajPredmet(noviPredmet);

    expect(axiosInstance.post).toHaveBeenCalledWith('/predmeti', noviPredmet);
  });

  test('obrisiPredmet šalje DELETE zahtev sa ID-jem predmeta', async () => {
    const predmetId = 4;
    axiosInstance.delete.mockResolvedValueOnce({ data: 'Obrisano' });

    await obrisiPredmet(predmetId);

    expect(axiosInstance.delete).toHaveBeenCalledWith(`/predmeti/${predmetId}`);
  });

  test('getNastavniciZaPredmet šalje GET zahtev sa ID-jem predmeta', async () => {
    const predmetId = 2;
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getNastavniciZaPredmet(predmetId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/predavanja/predmet/${predmetId}`);
  });

  test('getProfesorZaPredmet vraća direktno response.data', async () => {
    const predmetId = 5;
    const mockProfesor = { id: 1, ime: 'Milan Milanović' };
    axiosInstance.get.mockResolvedValueOnce({ data: mockProfesor });

    const data = await getProfesorZaPredmet(predmetId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/predavanja/predmet/${predmetId}`);
    expect(data).toEqual(mockProfesor);
  });

});
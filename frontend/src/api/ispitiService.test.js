import axiosInstance from './axiosInstance';
import {
  getIspiti,
  getIspitiByStudent,
  prijavaIspita,
  unosOcene,
  odjavaIspita,
  getPrijaveByPredmet,
  getNaziviRokova,
  getPrijaveZaRok
} from './ispitiService';

// ==========================================
// JEDINIČNI (UNIT) TESTOVI
// ==========================================
// Zašto su ovo jedinični testovi?
// Zato što testiramo isključivo funkcije unutar API servisa za ispite, izolovano od bilo kakvih 
// vizuelnih komponenti ili formi. Proveravamo ispravnost slanja GET, POST, PUT i DELETE zahteva, 
// prosleđivanje parametara, kao i transformaciju podataka (npr. encodeURIComponent).
// ==========================================

jest.mock('./axiosInstance');

describe('Ispiti Service - Unit testovi', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getIspiti šalje GET zahtev za sve ispite', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [{ id: 1, naziv: 'Matematika' }] });

    const result = await getIspiti();

    expect(axiosInstance.get).toHaveBeenCalledWith('/ispiti');
    expect(result.data.length).toBe(1);
  });

  test('prijavaIspita šalje POST zahtev sa podacima prijave', async () => {
    const prijavaData = { studentId: 1, ispitId: 5 };
    axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });

    await prijavaIspita(prijavaData);

    expect(axiosInstance.post).toHaveBeenCalledWith('/ispiti/prijava', prijavaData);
  });

  test('unosOcene šalje PUT zahtev sa ID-jem polaganja, ocenom i podrazumevanim bodovima', async () => {
    axiosInstance.put.mockResolvedValueOnce({ data: { updated: true } });

    // Testiramo sa prosleđenom ocenom (bodovi koriste default vrednost 51)
    await unosOcene(12, 9);

    expect(axiosInstance.put).toHaveBeenCalledWith('/ispiti/ocena', {
      polaganjeIspitaId: 12,
      ocena: 9,
      bodovi: 51
    });
  });

  test('odjavaIspita šalje DELETE zahtev sa ID-jem polaganja', async () => {
    const polaganjeId = 42;
    axiosInstance.delete.mockResolvedValueOnce({ data: 'Obrisano' });

    await odjavaIspita(polaganjeId);

    expect(axiosInstance.delete).toHaveBeenCalledWith(`/ispiti/${polaganjeId}`);
  });

  test('getPrijaveZaRok ispravno enkoduje naziv roka sa razmacima u URL', async () => {
    const nazivRoka = 'Januarski rok 2026';
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getPrijaveZaRok(nazivRoka);

    // Proveravamo da li je encodeURIComponent odradio posao (razmaci postaju %20)
    expect(axiosInstance.get).toHaveBeenCalledWith(`/ispiti/rok/Januarski%20rok%202026`);
  });

});
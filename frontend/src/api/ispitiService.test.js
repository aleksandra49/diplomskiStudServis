import axiosInstance from '../api/axiosInstance';
import {
  getIspiti,
  getIspitiByStudent,
  prijavaIspita,
  unosOcene,
  odjavaIspita,
  getPrijaveByPredmet,
  getSvaPolaganja,
  getNaziviRokova,
  getPrijaveZaRok
} from '../api/ispitiService';

// ==========================================
// JEDINIČNI (UNIT) TESTOVI ZA ISPITI SERVICE
// ==========================================
// Testiramo isključivo funkcije unutar API servisa za ispite, izolovano od komponenti.
// Proveravamo ispravnost slanja GET, POST, PUT i DELETE zahteva, prosleđivanje 
// parametara i enkodovanje URL-ova.
// ==========================================

jest.mock('../api/axiosInstance');

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

  test('getIspitiByStudent šalje GET zahtev sa ID-jem studenta', async () => {
    const studentId = 5;
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getIspitiByStudent(studentId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/ispiti/student/${studentId}`);
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

  test('getPrijaveByPredmet šalje GET zahtev sa ID-jem predmeta', async () => {
    const predmetId = 3;
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getPrijaveByPredmet(predmetId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/ispiti/predmet/${predmetId}`);
  });

  test('getSvaPolaganja šalje GET zahtev za sva polaganja', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getSvaPolaganja();

    expect(axiosInstance.get).toHaveBeenCalledWith('/ispiti');
  });

  test('getNaziviRokova šalje GET zahtev za nazive rokova', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: ['Januar', 'Februar'] });

    const result = await getNaziviRokova();

    expect(axiosInstance.get).toHaveBeenCalledWith('/ispiti/rokovi/nazivi');
    expect(result.data.length).toBe(2);
  });

  test('getPrijaveZaRok ispravno enkoduje naziv roka sa razmacima u URL', async () => {
    const nazivRoka = 'Januarski rok 2026';
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getPrijaveZaRok(nazivRoka);

    // Proveravamo da li je encodeURIComponent odradio posao (razmaci postaju %20)
    expect(axiosInstance.get).toHaveBeenCalledWith(`/ispiti/rok/Januarski%20rok%202026`);
  });

});
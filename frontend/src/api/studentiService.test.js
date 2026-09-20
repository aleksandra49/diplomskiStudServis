import axiosInstance from './axiosInstance';
import axios from 'axios';
import {
  getStudenti,
  dodajStudenta,
  obrisiStudenta,
  pretraziStudentePoIndeksu,
  dodeliPredmetStudentu,
  getPredmetiZaStudenta,
  ukloniPohadjanjeStudenta
} from './studentiService'; // Prilagodi putanju do tvog fajla

// ==========================================
// JEDINIČNI (UNIT) TESTOVI
// ==========================================
// Zašto su ovo jedinični testovi?
// Zato što testiramo isključivo funkcije iz API servisa za studente i njihova pohađanja, 
// izolovano od bilo kakvih vizuelnih komponenti ili formi. Proveravamo ispravnost slanja GET, 
// POST i DELETE zahteva, kao i ispravno prosleđivanje parametara i pretragu po indeksu.
// ==========================================

jest.mock('./axiosInstance');

describe('Studenti Service - Unit testovi', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getStudenti šalje GET zahtev za listu svih studenata', async () => {
    const mockStudenti = [{ id: 1, ime: 'Stefan Stefanović' }];
    axiosInstance.get.mockResolvedValueOnce({ data: mockStudenti });

    const result = await getStudenti();

    expect(axiosInstance.get).toHaveBeenCalledWith('/studenti');
    expect(result.data).toEqual(mockStudenti);
  });

  test('dodajStudenta šalje POST zahtev sa podacima novog studenta', async () => {
    const noviStudent = { ime: 'Milica', prezime: 'Milić', indeks: '2023/0012' };
    axiosInstance.post.mockResolvedValueOnce({ data: { id: 7, ...noviStudent } });

    await dodajStudenta(noviStudent);

    expect(axiosInstance.post).toHaveBeenCalledWith('/studenti', noviStudent);
  });

  test('obrisiStudenta šalje DELETE zahtev sa ID-jem studenta', async () => {
    const studentId = 3;
    axiosInstance.delete.mockResolvedValueOnce({ data: 'Obrisano' });

    await obrisiStudenta(studentId);

    expect(axiosInstance.delete).toHaveBeenCalledWith(`/studenti/${studentId}`);
  });

  test('pretraziStudentePoIndeksu šalje GET zahtev sa prosleđenim brojem indeksa', async () => {
    const indeks = '2023/0012';
    const mockStudent = { id: 7, indeks: '2023/0012', ime: 'Milica' };
    axiosInstance.get.mockResolvedValueOnce({ data: mockStudent });

    const result = await pretraziStudentePoIndeksu(indeks);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/studenti/pretraga/${indeks}`);
    expect(result.data).toEqual(mockStudent);
  });

  test('dodeliPredmetStudentu šalje POST zahtev sa podacima o pohađanju', async () => {
    const podaci = { studentId: 2, predmetId: 5 };
    axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });

    await dodeliPredmetStudentu(podaci);

    expect(axiosInstance.post).toHaveBeenCalledWith('/pohadjanja', podaci);
  });

  test('getPredmetiZaStudenta šalje GET zahtev sa ID-jem studenta', async () => {
    const studentId = 2;
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    await getPredmetiZaStudenta(studentId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/pohadjanja/student/${studentId}`);
  });

  test('ukloniPohadjanjeStudenta šalje DELETE zahtev sa ID-jem pohađanja', async () => {
    const pohadjanjeId = 9;
    axiosInstance.delete.mockResolvedValueOnce({ data: 'Uklonjeno' });

    await ukloniPohadjanjeStudenta(pohadjanjeId);

    expect(axiosInstance.delete).toHaveBeenCalledWith(`/pohadjanja/${pohadjanjeId}`);
  });

});
import axiosInstance from './axiosInstance';
import { getPohadjanjaByStudentId, getStudentiPoPredmetu } from './pohadjanjaService'; // Prilagodi putanju do tvog fajla

// ==========================================
// JEDINIČNI (UNIT) TESTOVI
// ==========================================
// Zašto su ovo jedinični testovi?
// Zato što testiramo izolovane funkcije API servisa za pohađanja, nezavisno od bilo kakvog UI-ja 
// ili komponenti. Proveravamo ispravnost formiranja URL putanja i slanja GET zahteva ka Axios-u.
// ==========================================

jest.mock('./axiosInstance');

describe('Pohadjanja Service - Unit testovi', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getPohadjanjaByStudentId šalje GET zahtev sa ID-jem studenta', async () => {
    const studentId = 8;
    const mockPohadjanja = [{ id: 1, predmetNaziv: 'Internet mreze' }];
    axiosInstance.get.mockResolvedValueOnce({ data: mockPohadjanja });

    const result = await getPohadjanjaByStudentId(studentId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/pohadjanja/student/${studentId}`);
    expect(result.data).toEqual(mockPohadjanja);
  });

  test('getStudentiPoPredmetu šalje GET zahtev sa ID-jem predmeta', async () => {
    const predmetId = 12;
    const mockStudenti = [{ id: 5, ime: 'Marko Marković' }];
    axiosInstance.get.mockResolvedValueOnce({ data: mockStudenti });

    const result = await getStudentiPoPredmetu(predmetId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/pohadjanja/predmet/${predmetId}`);
    expect(result.data).toEqual(mockStudenti);
  });

});
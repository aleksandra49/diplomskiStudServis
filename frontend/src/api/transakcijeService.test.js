import axiosInstance from './axiosInstance';
import {
  getTransakcijeByStudent,
  izvrsiUplatu,
  getTransakcijeByStudentId
} from './transakcijeService'; // Prilagodi putanju do tvog fajla

// ==========================================
// JEDINIČNI (UNIT) TESTOVI
// ==========================================
// Zašto su ovo jedinični testovi?
// Zato što testiramo isključivo funkcije iz API servisa za finansije i transakcije, 
// potpuno izolovano od grafičkog interfejsa, formi ili tabela. Proveravamo ispravnost 
// slanja GET i POST zahteva, kao i ispravno prosleđivanje parametara za uplate.
// ==========================================

jest.mock('./axiosInstance');

describe('Transakcije Service - Unit testovi', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getTransakcijeByStudent šalje GET zahtev sa ID-jem studenta', async () => {
    const studentId = 10;
    const mockTransakcije = [{ id: 1, iznos: 5000, svrha: 'Skolarina' }];
    axiosInstance.get.mockResolvedValueOnce({ data: mockTransakcije });

    const result = await getTransakcijeByStudent(studentId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/transakcije/student/${studentId}`);
    expect(result.data).toEqual(mockTransakcije);
  });

  test('izvrsiUplatu šalje POST zahtev sa podacima uplate', async () => {
    const uplataData = { studentId: 10, iznos: 3000, svrha: 'Overa semestra' };
    axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });

    await izvrsiUplatu(uplataData);

    expect(axiosInstance.post).toHaveBeenCalledWith('/transakcije/uplata', uplataData);
  });

  test('getTransakcijeByStudentId šalje GET zahtev sa ID-jem studenta (alternativna funkcija)', async () => {
    const studentId = 10;
    const mockTransakcije = [{ id: 1, iznos: 5000, svrha: 'Skolarina' }];
    axiosInstance.get.mockResolvedValueOnce({ data: mockTransakcije });

    const result = await getTransakcijeByStudentId(studentId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/transakcije/student/${studentId}`);
    expect(result.data).toEqual(mockTransakcije);
  });

});
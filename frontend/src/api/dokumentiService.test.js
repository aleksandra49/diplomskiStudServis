import axiosInstance from './axiosInstance';
import { getDokumentiPoStudentu, dodajDokument, obrisiDokument } from './dokumentiService'; 

// ==========================================
// JEDINIČNI (UNIT) TESTOVI
// ==========================================
// Zašto su ovo jedinični testovi?
// Zato što testiramo isključivo jednu po jednu izolovanu funkciju iz servisnog sloja (API Service),
// potpuno odvojeno od grafičkog interfejsa (UI), formi, dugmadi i React komponenti.
// Ovde proveravamo samo logiku komunikacije: da li funkcije šalju tačan URL i prave parametre ka Axios-u.
// ==========================================




// Mockujemo axiosInstance da ne bi zaista išao na server
jest.mock('./axiosInstance');

describe('Dokumenti Service - Unit testovi', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getDokumentiPoStudentu šalje ispravan GET zahtev sa prosleđenim ID-jem studenta', async () => {
    const studentId = 5;
    const mockData = [{ id: 1, naziv: 'Uverenje' }];
    
    // Simuliramo uspešan odgovor servera
    axiosInstance.get.mockResolvedValueOnce({ data: mockData });

    const result = await getDokumentiPoStudentu(studentId);

    // Proveravamo da li je pozvan tačan URL
    expect(axiosInstance.get).toHaveBeenCalledWith(`/dokumenti/student/${studentId}`);
    expect(result.data).toEqual(mockData);
  });

  test('dodajDokument šalje ispravan POST zahtev sa podacima dokumenta', async () => {
    const noviDokument = { naziv: 'Indeks', tip: 'PDF' };
    axiosInstance.post.mockResolvedValueOnce({ data: { id: 10, ...noviDokument } });

    await dodajDokument(noviDokument);

    // Proveravamo da li je prosleđen tačan URL i telo zahteva
    expect(axiosInstance.post).toHaveBeenCalledWith('/dokumenti', noviDokument);
  });

  test('obrisiDokument šalje ispravan DELETE zahtev sa ID-jem dokumenta', async () => {
    const dokumentId = 3;
    axiosInstance.delete.mockResolvedValueOnce({ data: 'Obrisano' });

    await obrisiDokument(dokumentId);

    // Proveravamo da li je pozvan tačan DELETE URL sa ID-jem
    expect(axiosInstance.delete).toHaveBeenCalledWith(`/dokumenti/${dokumentId}`);
  });

});
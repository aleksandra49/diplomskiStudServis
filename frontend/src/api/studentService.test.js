import axiosInstance from './axiosInstance';
import axios from 'axios';
import { getStudentByKorisnikId, getProfesorZaPredmet } from './studentService'; // Prilagodi putanju do tvog fajla

// ==========================================
// JEDINIČNI (UNIT) TESTOVI
// ==========================================
// Zašto su ovo jedinični testovi?
// Zato što testiramo izolovane funkcije iz API servisa nezavisno od bilo kakvih komponenti 
// ili interfejsa. Proveravamo ispravnost slanja GET zahteva za dohvatanje studenta preko 
// korisničkog ID-ja, kao i funkciju koja komunicira sa spoljnim/hardkodovanim URL-om.
// ==========================================



// Mockujemo axiosInstance pošto se u modulu koristi default eksport (axios.create). 
// Sa __esModule: true i default objektom govorimo Jest-u da umesto prave mreže 
// i prave instance vrati lažni (mock) objekat sa funkcijama (get, post, put, delete) 
// kako bismo mogli kontrolisano da testiramo zahteve bez slanja na server.

jest.mock('./axiosInstance', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('./axiosInstance');
jest.mock('axios'); // Mockujemo i globalni axios pošto se koristi u drugoj funkciji

describe('Studenti Service (Dodatne funkcije) - Unit testovi', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getStudentByKorisnikId šalje GET zahtev sa ID-jem korisnika', async () => {
    const korisnikId = 12;
    const mockStudent = { id: 4, korisnikId: 12, ime: 'Jovana Jovanović' };
    axiosInstance.get.mockResolvedValueOnce({ data: mockStudent });

    const result = await getStudentByKorisnikId(korisnikId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/studenti/korisnik/${korisnikId}`);
    expect(result.data).toEqual(mockStudent);
  });

  test('getProfesorZaPredmet šalje GET zahtev na hardkodovani URL i vraća response.data', async () => {
    const predmetId = 7;
    const mockProfesor = { id: 2, ime: 'Dragan Draganović' };
    
    // Pošto funkcija koristi globalni axios, mockujemo његов get metod
    axios.get.mockResolvedValueOnce({ data: mockProfesor });

    const data = await getProfesorZaPredmet(predmetId);

    expect(axios.get).toHaveBeenCalledWith(`http://localhost:8081/api/predavanja-predmeta/predmet/${predmetId}`);
    expect(data).toEqual(mockProfesor);
  });

});
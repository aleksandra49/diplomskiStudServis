import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';

// Mockujemo axios da ne bi zavisio od stvarnog back-end servera tokom unit testova
jest.mock('axios');

// Mockujemo react-router-dom-ov useNavigate da bismo mogli da pratimo preusmeravanje
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Komponenta - Kompletan testスイート (Suite)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // 1. Test renderovanja elemenata, forme i slike (grba)
  test('uspešno renderuje formu, polja, dugme i grb', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Proveravamo sliku (grb) preko alt atributa
    const grbImage = screen.getByAltText(/Grb/i);
    expect(grbImage).toBeInTheDocument();
    expect(grbImage).toHaveAttribute('src', 'https://serbiagbc.rs/wp-content/uploads/2020/06/FTN-Logo.png');

    // Proveravamo naslov i polja
    expect(screen.getByText(/Prijava na Studentski Servis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Korisničko ime:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lozinka:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Prijavi se/i })).toBeInTheDocument();
  });

  // 2. Test unosa teksta u polja
  test('dozvoljava unos u input polja za username i password', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/Korisničko ime:/i);
    const passwordInput = screen.getByLabelText(/Lozinka:/i);

    fireEvent.change(usernameInput, { target: { value: 'pera.peric' } });
    fireEvent.change(passwordInput, { target: { value: 'sifra123' } });

    expect(usernameInput.value).toBe('pera.peric');
    expect(passwordInput.value).toBe('sifra123');
  });

  // 3. HTTP TEST: Uspešna prijava i komunikacija sa serverom
  test('šalje ispravne HTTP podatke na server, čuva u localStorage i preusmerava pri uspešnoj prijavi', async () => {
    // Simuliramo uspešan odgovor servera
    const mockResponseData = { token: 'fake-jwt-token', username: 'pera.peric' };
    axios.post.mockResolvedValueOnce({ data: mockResponseData });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Unosimo podatke
    fireEvent.change(screen.getByLabelText(/Korisničko ime:/i), { target: { value: 'pera.peric' } });
    fireEvent.change(screen.getByLabelText(/Lozinka:/i), { target: { value: 'sifra123' } });

    // Klikćemo na dugme za prijavu
    fireEvent.click(screen.getByRole('button', { name: /Prijavi se/i }));

    // Čekamo da se asinhroni poziv završi
    await waitFor(() => {
      // Proveravamo da li je Axios pozvao pravu putanju sa pravim HTTP telom (payload-om)
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8081/api/auth/login', {
        username: 'pera.peric',
        password: 'sifra123',
      });
    });

    // Proveravamo da li su podaci sačuvani u localStorage
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponseData));

    // Proveravamo da li je korisnik preusmeren na /dashboard
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  // 4. HTTP TEST: Neuspešna prijava i prikaz greške sa servera
  test('prikazuje poruku o grešci kada server vrati neuspešan odgovor', async () => {
    // Simuliramo grešku sa servera (npr. pogrešni kredencijali)
    axios.post.mockRejectedValueOnce({
      response: {
        data: 'Pogrešno korisničko ime ili lozinka.',
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Korisničko ime:/i), { target: { value: 'pogresan' } });
    fireEvent.change(screen.getByLabelText(/Lozinka:/i), { target: { value: 'pogresna' } });

    fireEvent.click(screen.getByRole('button', { name: /Prijavi se/i }));

    // Čekamo da se poruka o grešci pojavi na ekranu
    const errorMessage = await screen.findByText(/Pogrešno korisničko ime ili lozinka./i);
    expect(errorMessage).toBeInTheDocument();
    //necemo staviti da pise smao red vec da bude rgb vrednost, jer jdsom konvertuje ali ovako cemo da olaksamo da ne puca
    //expect(errorMessage).toHaveStyle('color: red');
    expect(errorMessage).toHaveStyle('color: rgb(255, 0, 0)');
  });


  // 5. TEST VALIDACIJE: Provera da li polja imaju obavezan (required) atribut
  test('polja za korisničko ime i lozinku imaju required atribut', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/Korisničko ime:/i);
    const passwordInput = screen.getByLabelText(/Lozinka:/i);

    expect(usernameInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  // 6. TEST VALIDACIJE: Sprečavanje slanja zahteva ako su polja prazna
  test('ne šalje HTTP zahtev ka serveru ako su polja prazna', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Klikćemo na dugme bez unosa ikakvih podataka
    fireEvent.click(screen.getByRole('button', { name: /Prijavi se/i }));

    // Proveravamo da axios.post NIJE pozvan uopšte
    expect(axios.post).not.toHaveBeenCalled();
  });

});

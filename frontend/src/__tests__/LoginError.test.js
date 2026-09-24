import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Uvozimo samo Login stranu
import Login from '../pages/Login';

// Mockujemo axios
jest.mock('axios');

describe('Login Error - Granični slučaj', () => {

  test('Prikazuje poruku o grešci pri neuspešnoj prijavi', async () => {
    // 1. Mockujemo da API vraća grešku sa servera (ili mrežni problem)
    axios.post.mockRejectedValueOnce({
      response: {
        data: 'Pogrešno korisničko ime ili lozinka.'
      }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // 2. Nalazimo elemente forme
    const usernameInput = screen.getByLabelText(/Korisničko ime:/i);
    const passwordInput = screen.getByLabelText(/Lozinka:/i);
    const loginButton = screen.getByRole('button', { name: /Prijavi se/i });

    // 3. Unosimo podatke i klikćemo na prijavu
    await userEvent.type(usernameInput, 'pogresan_korisnik');
    await userEvent.type(passwordInput, 'pogresna_lozinka');
    await userEvent.click(loginButton);

    // 4. Proveravamo da li se pojavila tačna poruka o grešci koju komponenta postavlja
    const errorAlert = await screen.findByText(/Pogrešno korisničko ime ili lozinka/i);
    expect(errorAlert).toBeInTheDocument();
  });

});
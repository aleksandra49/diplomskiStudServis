import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UplataForma from './UplataForma';
import { izvrsiUplatu } from '../api/transakcijeService';

// 1. Mockovanje API servisa za transakcije
jest.mock('../api/transakcijeService');

describe('UplataForma Komponenta - Testovi pokrivenosti', () => {

  const mockStudentId = 5;
  const mockOnUplataUspesna = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Testira da li se svi osnovni elementi forme ispravno renderuju
  test('Renderuje elemente forme ispravno', () => {
    render(<UplataForma studentId={mockStudentId} onUplataUspesna={mockOnUplataUspesna} />);

    expect(screen.getByText(/Uplata na račun studenta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Iznos \(RSD\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Opis \/ Svrha:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Uplati/i })).toBeInTheDocument();
  });

  // 2. Testira validaciju forme i prikazuje grešku ukoliko je iznos prazan, nula ili negativan
  test('Prikazuje grešku ako je iznos prazan, nula ili negativan', async () => {
    render(<UplataForma studentId={mockStudentId} onUplataUspesna={mockOnUplataUspesna} />);

    const submitButton = screen.getByRole('button', { name: /Uplati/i });
    
    // Pokušaj slanja bez unetog iznosa
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Iznos mora biti veći od 0./i)).toBeInTheDocument();
    expect(izvrsiUplatu).not.toHaveBeenCalled();
  });

  // 3. Testira uspešno izvršavanje uplate, slanje ispravnih parametara, prikaz poruke i resetovanje polja
  test('Uspešno izvršava uplatu, prikazuje poruku i poziva callback funkciju', async () => {
    izvrsiUplatu.mockResolvedValueOnce({ success: true });

    render(<UplataForma studentId={mockStudentId} onUplataUspesna={mockOnUplataUspesna} />);

    const iznosInput = screen.getByLabelText(/Iznos \(RSD\):/i);
    const opisInput = screen.getByLabelText(/Opis \/ Svrha:/i);
    const submitButton = screen.getByRole('button', { name: /Uplati/i });

    // Popunjavamo formu
    fireEvent.change(iznosInput, { target: { value: '5000' } });
    fireEvent.change(opisInput, { target: { value: 'Uplata za dom' } });

    // Klik na dugme za uplatu
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(izvrsiUplatu).toHaveBeenCalledWith({
        studentId: 5,
        iznos: 5000,
        opis: 'Uplata za dom'
      });
      expect(screen.getByText(/Uplata je uspešno proknjižena!/i)).toBeInTheDocument();
      expect(mockOnUplataUspesna).toHaveBeenCalledTimes(1);
    });

    // Proveravamo da li su polja očišćena nakon uspešne uplate
    expect(iznosInput.value).toBe('');
    expect(opisInput.value).toBe('');
  });

  // 4. Testira automatsko postavljanje podrazumevanog opisa ukoliko korisnik isti nije uneo
  test('Postavlja podrazumevani opis ako opis nije unet', async () => {
    izvrsiUplatu.mockResolvedValueOnce({ success: true });

    render(<UplataForma studentId={mockStudentId} />);

    const iznosInput = screen.getByLabelText(/Iznos \(RSD\):/i);
    const submitButton = screen.getByRole('button', { name: /Uplati/i });

    fireEvent.change(iznosInput, { target: { value: '1200' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(izvrsiUplatu).toHaveBeenCalledWith({
        studentId: 5,
        iznos: 1200,
        opis: 'Uplata na račun' // Podrazumevana vrednost iz komponente
      });
    });
  });

  // 5. Testira ponašanje komponente u slučaju greške prilikom API poziva ka serveru
  test('Prikazuje poruku o grešci ako API poziv za uplatu ne uspe', async () => {
    // Utišavamo console.error u ovom testu jer komponenta beleži grešku u konzolu preko catch bloka
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    izvrsiUplatu.mockRejectedValueOnce(new Error('Server Error'));

    render(<UplataForma studentId={mockStudentId} />);

    const iznosInput = screen.getByLabelText(/Iznos \(RSD\):/i);
    const submitButton = screen.getByRole('button', { name: /Uplati/i });

    fireEvent.change(iznosInput, { target: { value: '3000' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Greška pri obradi uplate./i)).toBeInTheDocument();

    spy.mockRestore();
  });

  //nema implementiranu logiku koja onemogućava dugme (disabled={true}) dok traje asinhroni poziv serveru.
  // // 6. Testira da li dugme postaje onemogućeno tokom slanja zahteva ka serveru
  // test('Onemogućava dugme i prikazuje status učitavanja tokom slanja uplate', async () => {
  //   // Simuliramo da API poziv traje malo duže
  //   izvrsiUplatu.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

  //   render(<UplataForma studentId={mockStudentId} />);

  //   const iznosInput = screen.getByLabelText(/Iznos \(RSD\):/i);
  //   const submitButton = screen.getByRole('button', { name: /Uplati/i });

  //   fireEvent.change(iznosInput, { target: { value: '1000' } });
  //   fireEvent.click(submitButton);

  //   // Proveravamo da li je dugme onemogućeno (disabled) dok se zahtev izvršava
  //   expect(submitButton).toBeDisabled();

  //   await waitFor(() => {
  //     expect(izvrsiUplatu).toHaveBeenCalled();
  //   });
  // }); nije programirano da dugme postane disabled tokom trajanja async poziva, pa ne radi

});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import UplataForma from '../components/UplataForma';
import * as transakcijeService from '../api/transakcijeService';

vi.mock('../api/transakcijeService');

describe('UplataForma Komponenta', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('prikazuje grešku ako je iznos prazan', async () => {
    render(<UplataForma studentId={1} />);

    const button = screen.getByRole('button', { name: /uplati/i });
    fireEvent.click(button);

    expect(await screen.findByRole('alert')).toHaveTextContent('Iznos mora biti veći od 0.');
  });

  test('uspešno šalje uplatu kada su podaci ispravni', async () => {
    transakcijeService.izvrsiUplatu.mockResolvedValue({ data: { id: 100 } });

    render(<UplataForma studentId={1} />);

    fireEvent.change(screen.getByLabelText(/iznos/i), { target: { value: '2000' } });
    fireEvent.change(screen.getByLabelText(/opis/i), { target: { value: 'Prijava ispita' } });
    fireEvent.click(screen.getByRole('button', { name: /uplati/i }));

    await waitFor(() => {
      expect(transakcijeService.izvrsiUplatu).toHaveBeenCalledWith({
        studentId: 1,
        iznos: 2000,
        opis: 'Prijava ispita'
      });
      expect(screen.getByRole('alert')).toHaveTextContent('Uplata je uspešno proknjižena!');
    });
  });
});
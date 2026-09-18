import axiosInstance from './axiosInstance';

export const getNastavnikByKorisnikId = (korisnikId) => {
  return axiosInstance.get(`/nastavnici/korisnik/${korisnikId}`);
};

export const getPredmetiByNastavnik = (nastavnikId) => {
  return axiosInstance.get(`/nastavnici/${nastavnikId}/predmeti`);
};
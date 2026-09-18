import axiosInstance from './axiosInstance';

export const getNastavnici = () => {
  return axiosInstance.get('/nastavnici');
};

export const dodajNastavnika = (nastavnikData) => {
  return axiosInstance.post('/nastavnici', nastavnikData);
};

export const obrisiNastavnika = (id) => {
  return axiosInstance.delete(`/nastavnici/${id}`);
};

export const dodeliPredmetNastavniku = (podaci) => {
  return axiosInstance.post('/predavanja', podaci);
};

export const getPredmetiZaNastavnika = (nastavnikId) => {
  return axiosInstance.get(`/predavanja/nastavnik/${nastavnikId}`);
};
export const ukloniPredavanjeSaNastavnika = (id) => {
  return axiosInstance.delete(`/predavanja/${id}`);
};
import axiosInstance from './axiosInstance';

export const getStudenti = () => {
  return axiosInstance.get('/studenti');
};

export const dodajStudenta = (studentData) => {
  return axiosInstance.post('/studenti', studentData);
};

export const obrisiStudenta = (id) => {
  return axiosInstance.delete(`/studenti/${id}`);
};

// Nova funkcija za pretragu po indeksu
export const pretraziStudentePoIndeksu = (indeks) => {
  return axiosInstance.get(`/studenti/pretraga/${indeks}`);
};

export const dodeliPredmetStudentu = (podaci) => {
  return axiosInstance.post('/pohadjanja', podaci);
};

export const getPredmetiZaStudenta = (studentId) => {
  return axiosInstance.get(`/pohadjanja/student/${studentId}`);
};

export const ukloniPohadjanjeStudenta = (id) => {
  return axiosInstance.delete(`/pohadjanja/${id}`);
};
import axiosInstance from './axiosInstance';

export const getPredmeti = () => {
  return axiosInstance.get('/predmeti');
};

export const dodajPredmet = (predmetData) => {
  return axiosInstance.post('/predmeti', predmetData);
};

export const obrisiPredmet = (id) => {
  return axiosInstance.delete(`/predmeti/${id}`);
};

export const getNastavniciZaPredmet = (predmetId) => {
  return axiosInstance.get(`/predavanja/predmet/${predmetId}`);
};
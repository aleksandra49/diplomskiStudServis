import axiosInstance from './axiosInstance';

export const getStudentByKorisnikId = (korisnikId) => {
  return axiosInstance.get(`/studenti/korisnik/${korisnikId}`);
};
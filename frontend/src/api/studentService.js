import axiosInstance from './axiosInstance';
import axios from 'axios';

export const getStudentByKorisnikId = (korisnikId) => {
  return axiosInstance.get(`/studenti/korisnik/${korisnikId}`);
};

export const getProfesorZaPredmet = async (predmetId) => {
    const response = await axios.get(`http://localhost:8081/api/predavanja-predmeta/predmet/${predmetId}`);
    return response.data; 
};
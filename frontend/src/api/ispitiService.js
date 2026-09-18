import axiosInstance from './axiosInstance';

export const getIspiti = () => axiosInstance.get('/ispiti');
export const getIspitiByStudent = (studentId) => axiosInstance.get(`/ispiti/student/${studentId}`);
export const prijavaIspita = (prijavaDTO) => axiosInstance.post('/ispiti/prijava', prijavaDTO);
//export const unosOcene = (unosOceneDTO) => axiosInstance.put('/ispiti/ocena', unosOceneDTO);
export const unosOcene = (polaganjeIspitaId, ocena, bodovi = 51) => {
  return axiosInstance.put(`/ispiti/ocena`, {
    polaganjeIspitaId,
    ocena,
    bodovi
  });
};

export const getPolaganjaByStudentId = (studentId) => {
  return axiosInstance.get(`/ispiti/student/${studentId}`);
};

export const odjavaIspita = (polaganjeId) => {
  return axiosInstance.delete(`/ispiti/${polaganjeId}`);
};

export const getPrijaveByPredmet = (predmetId) => {
  return axiosInstance.get(`/ispiti/predmet/${predmetId}`); 
};

export const getSvaPolaganja = () => {
  return axiosInstance.get('/ispiti');
};
export const getPolaganjaPoPredmetu = (predmetId) => {
  return axiosInstance.get(`/ispiti/predmet/${predmetId}`);
};

export const getNaziviRokova = () => {
  return axiosInstance.get('/ispiti/rokovi/nazivi');
};

export const getPrijaveZaRok = (nazivRoka) => {
  return axiosInstance.get(`/ispiti/rok/${encodeURIComponent(nazivRoka)}`);
};


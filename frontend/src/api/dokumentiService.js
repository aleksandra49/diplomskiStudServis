import axiosInstance from './axiosInstance';

export const getDokumentiPoStudentu = (studentId) => {
  return axiosInstance.get(`/dokumenti/student/${studentId}`);
};

export const dodajDokument = (dokumentData) => {
  return axiosInstance.post('/dokumenti', dokumentData);
};

export const obrisiDokument = (id) => {
  return axiosInstance.delete(`/dokumenti/${id}`);
};
import axiosInstance from './axiosInstance';

export const getPohadjanjaByStudentId = (studentId) => {
  return axiosInstance.get(`/pohadjanja/student/${studentId}`);
};

export const getStudentiPoPredmetu = (predmetId) => {
  return axiosInstance.get(`/pohadjanja/predmet/${predmetId}`);
};
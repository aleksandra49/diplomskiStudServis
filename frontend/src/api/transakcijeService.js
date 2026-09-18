import axiosInstance from './axiosInstance';

export const getTransakcijeByStudent = (studentId) => axiosInstance.get(`/transakcije/student/${studentId}`);
export const izvrsiUplatu = (uplataDTO) => axiosInstance.post('/transakcije/uplata', uplataDTO);

export const getTransakcijeByStudentId = (studentId) => {
  return axiosInstance.get(`/transakcije/student/${studentId}`);
};


import axiosInstance from "../api/axios";

export const getProfile = async () => {
  try {
    const res = await axiosInstance.get('/users/me');
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки профиля';
  }
};

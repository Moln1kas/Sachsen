import axiosInstance from "../api/axios";
import User from "../types/user.type";

export const getProfile = async (): Promise<User> => {
  try {
    const res = await axiosInstance.get('/users/me');
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки профиля';
  }
};

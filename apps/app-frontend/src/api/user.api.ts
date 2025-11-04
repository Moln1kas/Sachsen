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

export const findUserByUsername = async (username: string): Promise<User> => {
  try {
    const res = await axiosInstance.get(`/users/${username}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка получения профиля данного пользователя';
  }
};

export const getUserStatus = async (id: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.get(`/users/${id}/status`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки статуса пользователя';
  }
};

import axiosInstance from "../../axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getUsers = async (page: number, limit: number = 10) => {
  try {
    const res = await axiosInstance.get(`${API_URL}/admin/users?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки пользователей.';
  }
}

export const banUser = async (userId: number) => {
  try {
    const res = await axiosInstance.post(`${API_URL}/admin/users/${userId}/ban`);
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Не удалось забанить игрока.'
  }
}

export const unbanUser = async (userId: number) => {
  try {
    const res = await axiosInstance.post(`${API_URL}/admin/users/${userId}/unban`);
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Не удалось разбанить игрока.'
  }
}
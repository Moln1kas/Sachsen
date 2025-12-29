import axios from "axios";
import axiosInstance from "./axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getBlogs = async (page: number, limit: number = 10) => {
  try {
    const res = await axios.get(`${API_URL}/blogs?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки блогов.';
  }
}

export const createBlog = async (title: string, text: string, categoryId: number, isImportant: boolean) => {
  try {
    const res = await axiosInstance.post(`${API_URL}/blogs`, {
      title,
      text,
      categoryId,
      isImportant
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Ошибка создания записи.'
  }
}
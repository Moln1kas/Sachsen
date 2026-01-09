import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getBlogs = async (page: number, limit: number = 10) => {
  try {
    const res = await axios.get(`${API_URL}/blogs?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки блогов.';
  }
}

export const getBlogsCategories = async () => {
  try {
    const res = await axios.get(`${API_URL}/blogs/categories`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки категорий.';
  }
}
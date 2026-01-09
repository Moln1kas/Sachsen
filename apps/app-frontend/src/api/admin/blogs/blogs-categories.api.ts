import axiosInstance from "../../axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createBlogCategory = async (title: string) => {
  try {
    const res = await axiosInstance.post(`${API_URL}/admin/blogs/categories`, {
      title,
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Ошибка создания категории.'
  }
}
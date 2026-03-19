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

export const deleteBlogCategory = async (id: number) => {
  try {
    const res = await axiosInstance.delete(`${API_URL}/admin/blogs/categories/${id}`);
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Ошибка при удалении категории.';
  }
}
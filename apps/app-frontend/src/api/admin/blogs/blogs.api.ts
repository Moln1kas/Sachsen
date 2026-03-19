import axiosInstance from "../../axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createBlog = async (title: string, text: string, categoryId: number, isImportant: boolean) => {
  try {
    const res = await axiosInstance.post(`${API_URL}/admin/blogs`, {
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

export const updateBlog = async (id: number, data: { title?: string, text?: string, categoryId?: number, isImportant?: boolean }) => {
  const res = await axiosInstance.patch(`${API_URL}/admin/blogs/${id}`, data);
  return res.data;
}

export const deleteBlog = async (id: number) => {
  const res = await axiosInstance.delete(`${API_URL}/admin/blogs/${id}`);
  return res.data;
}
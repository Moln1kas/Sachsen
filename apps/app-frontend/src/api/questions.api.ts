import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getQustions = async () => {
  try {
    const res = await axios.get(`${API_URL}/questions`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки вопросов анкеты.';
  }
}
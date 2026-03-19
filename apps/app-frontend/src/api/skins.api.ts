import axios from "axios";
import axiosInstance from "./axios";

const API_URL = import.meta.env.VITE_API_URL;

export const uploadUserSkin = async (skin: any) => {
  const formData = new FormData();
  formData.append('file', skin);

  try {
    const res = await axiosInstance.post(`${API_URL}/skins/upload`, formData);
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Ошибка загрузки скина.'
  }
}

export const getUserSkinHash = async (username: string) => {
  try {
    const res = await axios.get(`${API_URL}/skins/${username}.json`);
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Ошибка получения хэша скина.'
  }
}

export const getUserSkin = async (skinHash: string) => {
  return `${API_URL}/skins/textures/${skinHash}`;
}
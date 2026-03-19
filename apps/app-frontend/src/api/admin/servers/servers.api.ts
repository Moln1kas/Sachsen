import { NewServer } from "../../../types/server.type";
import axiosInstance from "../../axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createServer = async (data: NewServer) => {
  try {
    const res = await axiosInstance.post(`${API_URL}/admin/servers`, {
      name: data.name,
      description: data.description,
      serverAddress: data.serverAddress,
      minecraftVersionHash: data.minecraftVersionHash,
      minecraftVersion: data.minecraftVersion,
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Ошибка создания сервера.'
  }
}

export const updateServer = async (id: number, data: any) => {
  const res = await axiosInstance.patch(`${API_URL}/admin/servers/${id}`, data);
  return res.data;
}

export const deleteServer = async (id: number) => {
  const res = await axiosInstance.delete(`${API_URL}/admin/servers/${id}`);
  return res.data;
}
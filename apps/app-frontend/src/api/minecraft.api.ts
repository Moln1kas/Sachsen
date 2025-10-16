import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const MC_SERVER_ID = import.meta.env.VITE_MC_SERVER_ID; // В будущем сделаю какой-нибудь store, в котором можно будет выбрать нужный сервер из списка.
const METADATA_URL = 'https://piston-meta.mojang.com/v1/packages/c0a7097e9a593f1a7d744304a55b350b7b95e944/1.20.1.json';
const FABRIC_URL = 'https://meta.fabricmc.net/v2/versions/installer';
const FABRIC_LOADER_URL = 'https://meta.fabricmc.net/v2/versions/loader/';

export const getMinecraftMetadata = async () => {
  try {
    const res = await axios.get(`${METADATA_URL}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки метаданных.';
  }
}

export const getFabricMetadata = async () => {
  try {
    const res = await axios.get(`${FABRIC_URL}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки метаданных.';
  }
}

export const getFabricLoaderData = async (game_version: string) => {
  try {
    const res = await axios.get(`${FABRIC_LOADER_URL}/${game_version}`);
    return res.data[0];
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки метаданных.';
  }
}

export const getMinecraftMods = async () => {
  try {
    const res = await axios.get(`${API_URL}/servers/${MC_SERVER_ID}/mods`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки списка модов.';
  }
}
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const MODRINTH_API_URL = 'https://api.modrinth.com/v2';
const METADATA_URL = 'https://piston-meta.mojang.com/v1/packages';
const FABRIC_URL = 'https://meta.fabricmc.net/v2/versions/installer';
const FABRIC_LOADER_URL = 'https://meta.fabricmc.net/v2/versions/loader';

export const getMinecraftMetadata = async (
  minecraftVersionHash: string,
  minecraftVersion: string,
) => {
  try {
    const res = await axios.get(
      `${METADATA_URL}/${minecraftVersionHash}/${minecraftVersion}.json`
    );
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
  if (!game_version) {
    console.warn("game_version отсутсвует.");
    return null;
  }

  try {
    const res = await axios.get(`${FABRIC_LOADER_URL}/${game_version}`);
    return res.data[0];
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки метаданных.';
  }
}

export const getMinecraftMods = async (serverId: number) => {
  try {
    const res = await axios.get(`${API_URL}/servers/${serverId}/mods`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки списка модов.';
  }
}

export const getMinecraftServerList = async () => {
  try {
    const res = await axios.get(`${API_URL}/servers`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки списка серверов.';
  }
}

export const getMinecraftServer = async (serverId: number) => {
  try {
    const res = await axios.get(`${API_URL}/servers/${serverId}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки сервера.';
  }
}

export const getModrinthModVersion = async (
  modrinthModId: string,
  modrinthModVersionId: string,
) => {
  try {
    const res = await axios.get(
      `${MODRINTH_API_URL}/project/${modrinthModId}/version/${modrinthModVersionId}`
    );
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки версии мода.';
  }
}

export const getMinecraftServerStatus = async (address: string) => {
  try {
    const res = await axios.get(
      `https://api.mcsrvstat.us/3/${address}`
    );
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка загрузки статуса сервера.';
  }
}
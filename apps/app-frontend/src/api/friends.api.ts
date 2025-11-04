import axiosInstance from "./axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createFriendRequest = async (friendId: number) => {
  try {
    const res = await axiosInstance.post(`${API_URL}/friends/request`, {
      friendId
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Ошибка отправки заявки на дружбу.'
  }
}

export const acceptFriendRequest = async (friendId: number) => {
  try {
    const res = await axiosInstance.post(`${API_URL}/friends/accept`, {
      friendId
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Ошибка принятия заявки на дружбу.'
  }
}

export const removeUserFromFriends = async (friendId: number) => {
  try {
    const res = await axiosInstance.delete(`${API_URL}/friends/remove`, {
      data: { friendId }
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Ошибка принятия заявки на дружбу.'
  }
}

export const rejectFriendRequest = async (friendId: number) => {
  try {
    const res = await axiosInstance.post(`${API_URL}/friends/reject`, {
      friendId
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Ошибка отклонения заявки на дружбу.'
  }
}

export const getUserFriendsRequests = async () => {
  try {
    const res = await axiosInstance.get(`${API_URL}/friends/requests`);
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Ошибка получения списка запросов в друзья пользователя.'
  }
}

export const getUserFriends = async (userId: number) => {
  try {
    const res = await axiosInstance.get(`${API_URL}/friends/${userId}`);
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Ошибка получения списка друзей пользователя.'
  }
}
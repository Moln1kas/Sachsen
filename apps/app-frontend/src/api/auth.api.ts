import axios from "axios";
import Answer from "../types/answer";

const API_URL = import.meta.env.VITE_API_URL;

export const signIn = async (email: string, password: string) => {
  try {
    const res = await axios.post(`${API_URL}/auth/sign-in`, { email, password });
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка входа';
  }
};

export const signUp = async (
  email: string, 
  username: string, 
  password: string,
  answers: Answer[],
) => {
  try {
    const res = await axios.post(`${API_URL}/auth/sign-up`, { email, username, password, answers });
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка регистрации';
  }
}

export const refreshTokens = async (refreshToken: string) => {
  const res = await axios.post(`${API_URL}/auth/refresh`, {}, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    }
  });
  return res.data;
}

export const logout = async (refreshToken: string) => {
  const res = await axios.post(`${API_URL}/auth/logout`, {}, {
    headers: {
      Authorization: `Bearer ${refreshToken}`
    }
  })
  return res.data;
}
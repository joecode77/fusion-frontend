import axios from "axios";
import { AuthCredentials, RegisterCredentials } from "../types";

const API_BASE = import.meta.env.VITE_API_URL;

export const loginUser = async (
  credentials: AuthCredentials
): Promise<boolean> => {
  try {
    const { data } = await axios.post(`${API_BASE}/auth/login`, credentials);
    localStorage.setItem("token", data.token);
    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

export const registerUser = async (
  credentials: RegisterCredentials
): Promise<boolean> => {
  try {
    await axios.post(`${API_BASE}/auth/register`, credentials);
    return true;
  } catch (error) {
    console.error("Registration failed:", error);
    return false;
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem("token");
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

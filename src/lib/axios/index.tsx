import axios from "axios";

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function getToken(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") ?? "";
  }
  return "";
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

baseApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      removeToken();
      const currentPath = window.location.pathname;
      if (currentPath !== "/") {
        window.location.href = `/?from=${currentPath}`;
      }
      throw new Error("Sesi login Anda telah berakhir");
    }
    return Promise.reject(error);
  }
);

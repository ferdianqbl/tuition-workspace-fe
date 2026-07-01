import axios from "axios";

export const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/") {
        window.location.href = `/?from=${currentPath}`;
      }
      throw new Error("Your login session has expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);

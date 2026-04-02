import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) return Promise.reject(error);

    isRefreshing = true;

    try {
      await refreshApi.post("/auth/refresh");
      await new Promise(r => setTimeout(r, 50)); // wait for cookie
      return api(originalRequest);
    } catch {
      //window.location.replace("/unauthorized");
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;

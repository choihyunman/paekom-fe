import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    // 에러 메시지 통일
    const status = err?.response?.status;
    const data = err?.response?.data;
    const msg = data?.message || data?.error || err.message || "API Error";
    return Promise.reject(new Error(`${status ?? ""} ${msg}`.trim()));
  }
);

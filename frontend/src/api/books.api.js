import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api/book",
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    // ONLY logout on explicit 401
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // NEVER logout on 404
    return Promise.reject(err);
  }
);


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getAllBooks = () => API.get("/");
export const getBookById = (id) => API.get(`/${id}`);


export const startReading = (id) =>
  API.post(`/${id}/start`);

export const logSession = (id, data) =>
  API.post(`/${id}/session`, data);

export const getReadingState = (id) =>
  API.get(`/${id}/state`);

export const getMySessions = (id) =>
  API.get(`/${id}/sessions`);

export const getCurrentlyReading = () =>
  API.get("/reading");

export const getCompletedBooks = () =>
  API.get("/finished");

export const createBook = (data) =>
  API.post("/", data);

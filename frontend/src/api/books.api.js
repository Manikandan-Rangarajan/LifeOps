import api from "./axios"; // adjust path if needed

// Base: /api/book

export const getAllBooks = () => api.get("/book");

export const getBookById = (id) =>
  api.get(`/book/${id}`);

export const createBook = (data) =>
  api.post("/book", data);

export const startReading = (id) =>
  api.post(`/book/${id}/start`);

export const logSession = (id, data) =>
  api.post(`/book/${id}/session`, data);

export const getReadingState = (id) =>
  api.get(`/book/${id}/state`);

export const getMySessions = (id) =>
  api.get(`/book/${id}/sessions`);

export const getCurrentlyReading = () =>
  api.get("/book/reading");

export const getCompletedBooks = () =>
  api.get("/book/finished");

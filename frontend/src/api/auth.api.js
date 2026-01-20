import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/", // adjust if needed
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

export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/", data);

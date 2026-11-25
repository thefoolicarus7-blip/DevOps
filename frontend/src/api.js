import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api" });

// pull the server's message out of a failed request
export const errorMessage = (error) =>
  error?.response?.data?.message ||
  "Couldn't reach the server. Check that the backend is running on port 8000.";

export default api;

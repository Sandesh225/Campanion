// src/services/axiosInstance.ts

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.100.150:3000/api",
  timeout: 10000,
});

export default axiosInstance;

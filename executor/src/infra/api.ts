import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

export const api = axios.create({
  baseURL: process.env.BACKEND_URL!,
});

api.interceptors.request.use((config) => {
  const token = process.env.BACKEND_TOKEN!;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
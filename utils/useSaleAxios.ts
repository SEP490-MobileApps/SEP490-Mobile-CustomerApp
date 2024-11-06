// utils/useSaleAxios.ts
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useState, useRef } from "react";

const useSaleAxios = () => {
  const [error, setError] = useState<string>("");
  const controllerRef = useRef<AbortController | null>(null);

  const axiosInstance = axios.create({
    baseURL: "https://ewmhsale.azurewebsites.net/api",
  });

  axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  type Method = "GET" | "POST" | "PUT" | "DELETE";

  interface FetchDataParams {
    url: string;
    method: Method;
    data?: object;
    params?: object;
    header?: object;
  }

  const fetchData = async ({
    url,
    method,
    data = {},
    params = {},
    header = {},
  }: FetchDataParams) => {
    // Hủy bỏ yêu cầu trước đó (nếu có) trước khi tạo yêu cầu mới
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController(); // Tạo mới controller

    const accessToken = await SecureStore.getItemAsync("accessToken");

    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        signal: controllerRef.current.signal,
        headers: {
          ...header,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return result.data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.warn("Request cancelled", error.message);
      } else {
        setError(error.response ? error.response.data : error.message);
      }
      return null;
    }
  };

  return { fetchData, error };
};

export default useSaleAxios;

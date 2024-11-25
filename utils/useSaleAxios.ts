// utils/useSaleAxios.ts
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useState, useRef, useEffect } from "react";

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

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const fetchData = async ({
    url,
    method,
    data = {},
    params = {},
    header = {},
  }: {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    data?: object;
    params?: object;
    header?: object;
  }) => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    const accessToken = await SecureStore.getItemAsync("accessToken");

    try {
      console.log("Request URL:", url);
      console.log("Request Data:", data);
      console.log("Request Method:", method);
      console.log("Request Params:", params);

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
      // console.log("Response Data:", result.data);
      return result.data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Request was cancelled");
      } else {
        setError(error.response ? error.response.data : error.message);
        console.error("Error Response:", error.response?.data || error.message);
      }
      return null;
    }
  };

  return { fetchData, error };
};

export default useSaleAxios;

import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { Box, useToast } from 'native-base';
import { Text, View } from 'react-native';
import LottieView from "lottie-react-native";

const useRequestAxios = () => {
  const [error, setError] = useState<string>("");
  const controllerRef = useRef<AbortController | null>(null);
  const toast = useToast();

  const axiosInstance = axios.create({
    baseURL: "https://ewmhrequest.azurewebsites.net/api",
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
    showErrorAlert = true
  }: {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    data?: object;
    params?: object;
    header?: object;
    showErrorAlert?: boolean;
  }) => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    const accessToken = await SecureStore.getItemAsync("accessToken");

    try {
      // console.log("Request URL:", url);
      // console.log("Request Data:", data);
      // console.log("Request Method:", method);
      // console.log("Request Params:", params);

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
        console.log("Request was cancelled");
      } else {
        setError(error.response ? error.response.data : error.message);
        const errorMessage = error.response?.data || error.message;

        if (showErrorAlert) {
          toast.show({
            duration: 1600,
            placement: 'top',
            render: () => {
              return <Box
                borderTopColor='#dc2626'
                borderTopWidth={5} bg="#fecaca"
                alignSelf='center'
                px="2"
                py="1"
                rounded="sm"
                mb={5}
                style={{ flexDirection: 'column', width: '98%', justifyContent: 'center' }}
              >
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fecaca',
                  marginHorizontal: 30,
                  flexDirection: 'row'
                }}>
                  <LottieView
                    source={require('@/assets/animations/error.json')}
                    autoPlay
                    loop
                    style={{ width: 52, height: 52 }}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#112D4E',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}>
                    {errorMessage}
                  </Text>
                </View>
              </Box>;
            }
          });
        }
      }
      return null;
    }
  };

  return { fetchData, error };
};

export default useRequestAxios;

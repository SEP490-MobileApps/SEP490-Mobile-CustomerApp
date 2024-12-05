import useAxios from "@/utils/useAuthAxios";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { useGlobalState } from "../contexts/GlobalProvider";

export function useAuth() {
  const { fetchData } = useAxios();
  const { setLoadingLogin, setUserInfo } = useGlobalState();

  const handleLogin = async (emailOrPhone: string, password: string) => {
    setLoadingLogin(true);

    try {
      const response = await fetchData({
        url: "/account/1",
        method: "POST",
        data: { email_Or_Phone: emailOrPhone, password },
      });

      if (!response) {
        return false;
      }

      const { at, rt } = response;
      const decoded = jwtDecode(at) as any;

      if (decoded.role !== "CUSTOMER") {
        Alert.alert("Không có quyền truy cập", "Tài khoản này không phải là khách hàng.");
        return false;
      }

      await SecureStore.setItemAsync("accessToken", at);
      await SecureStore.setItemAsync("refreshToken", rt);
      await SecureStore.setItemAsync("accountId", decoded.accountId);

      setUserInfo(decoded);
      return true;

    } catch (err) {
      Alert.alert("Lỗi hệ thống", "Không thể kết nối tới máy chủ.");
      return false;
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleLogout = async () => {
    setLoadingLogin(true);
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      await fetchData({
        url: "/account/12",
        method: "POST",
        header: { Authorization: `Bearer ${accessToken}` },
      });

      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("accountId");

      setUserInfo(null);
      router.replace("/(auth)");
    } catch (err) {
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleRegister = async (data: {
    cmT_CCCD: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    dateOfBirth: string;
    areaId: string;
    roomIds: string[];
  }) => {
    try {
      const response = await fetchData({
        url: "/account/15",
        method: "POST",
        data,
      });

      return response ? true : false;
    } catch (error) {
      return false;
    }
  };

  const fetchApartments = async () => {
    try {
      const response = await fetchData({
        url: "/apartment/5",
        method: "GET",
        params: { PageIndex: 1, PageSize: 8 },
      });

      if (Array.isArray(response) && response.length > 0) {
        return response[0];
      } else {
        console.warn("No apartments found or invalid response");
        return [];
      }

    } catch (error) {
      return [];
    }
  };

  const handleForgotPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await fetchData({
        url: '/account/8',
        method: 'POST',
        data: { email },
      });

      if (response) {
        return response.message || 'Yêu cầu đặt lại mật khẩu đã được gửi!';
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  return { handleLogin, handleLogout, handleRegister, fetchApartments, handleForgotPassword };
}

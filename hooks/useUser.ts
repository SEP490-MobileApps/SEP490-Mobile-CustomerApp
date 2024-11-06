// hooks/useUser.ts
import { useEffect, useState } from "react";
import useAuthAxios from "../utils/useAuthAxios";

interface User {
  accountId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phoneNumber: string;
  dateOfBirth: string;
  role: string;
  // Bổ sung các trường khác nếu cần thiết
}

const useUser = () => {
  const { fetchData } = useAuthAxios();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetchData({ url: "/account/3", method: "GET" });
      if (response) {
        setUser({
          accountId: response.response.accountId,
          fullName: response.response.fullName,
          email: response.response.email,
          avatarUrl: response.response.avatarUrl,
          phoneNumber: response.response.phoneNumber,
          dateOfBirth: response.response.dateOfBirth,
          role: response.response.role,
        });
      }
    };
    fetchUser();
  }, [fetchData]);

  return { user };
};

export default useUser;

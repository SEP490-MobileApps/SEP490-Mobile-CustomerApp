// hooks/useUser.ts
import { useEffect, useState } from "react";
import useAuthAxios from "../utils/useAuthAxios";

interface User {
  fullName: string;
  email: string;
  avatarUrl?: string;
}

const useUser = () => {
  const { fetchData } = useAuthAxios();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetchData({ url: "/account/3", method: "GET" });
      if (response) {
        setUser({
          fullName: response.response.fullName,
          email: response.response.email,
          avatarUrl: response.response.avatarUrl,
        });
      }
    };
    fetchUser();
  }, [fetchData]);

  return { user };
};

export default useUser;

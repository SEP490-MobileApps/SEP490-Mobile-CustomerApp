// src/contexts/GlobalProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../models/User"; // Sửa lại đường dẫn nếu cần thiết

interface GlobalStateContextProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  userInfo: User | null;
  setUserInfo: (value: User | null) => void;
}

const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(
  undefined
);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  return (
    <GlobalStateContext.Provider value={{ userInfo, setUserInfo, loading, setLoading }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalProvider");
  }
  return context;
};

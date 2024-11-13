// contexts/GlobalProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../models/User";

interface GlobalStateContextProps {
  loadingLogin: boolean; // Thêm state mới
  setLoadingLogin: (value: boolean) => void;
  userInfo: User | null;
  setUserInfo: (value: User | null) => void;
  serviceStartDate: Date | null;
  setServiceStartDate: (date: Date | null) => void;
  serviceEndDate: Date | null;
  setServiceEndDate: (date: Date | null) => void;
  orderStartDate: Date | null;
  setOrderStartDate: (date: Date | null) => void;
  orderEndDate: Date | null;
  setOrderEndDate: (date: Date | null) => void;
}

const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loadingLogin, setLoadingLogin] = useState(false); // State mới
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [serviceStartDate, setServiceStartDate] = useState<Date | null>(null);
  const [serviceEndDate, setServiceEndDate] = useState<Date | null>(null);
  const [orderStartDate, setOrderStartDate] = useState<Date | null>(null);
  const [orderEndDate, setOrderEndDate] = useState<Date | null>(null);

  return (
    <GlobalStateContext.Provider
      value={{
        loadingLogin,
        setLoadingLogin,
        userInfo,
        setUserInfo,
        serviceStartDate,
        setServiceStartDate,
        serviceEndDate,
        setServiceEndDate,
        orderStartDate,
        setOrderStartDate,
        orderEndDate,
        setOrderEndDate,
      }}
    >
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

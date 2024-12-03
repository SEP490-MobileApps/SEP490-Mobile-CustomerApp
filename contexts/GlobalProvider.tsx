import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../models/User";

// Định nghĩa kiểu dữ liệu context
interface GlobalStateContextProps {
  loadingLogin: boolean;
  setLoadingLogin: (value: boolean) => void;
  userInfo: User | null;
  setUserInfo: (value: User | null) => void;
  serviceStartDate: Date | null;
  setServiceStartDate: (date: string | null) => void;
  serviceEndDate: Date | null;
  setServiceEndDate: (date: string | null) => void;
  orderStartDate: Date | null;
  setOrderStartDate: (date: string | null) => void;
  orderEndDate: Date | null;
  setOrderEndDate: (date: string | null) => void;
  cartItemCount: number;
  setCartItemCount: (count: number) => void;
}

// Khởi tạo context
const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(undefined);

// GlobalProvider component
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [serviceStartDate, setServiceStartDateRaw] = useState<Date | null>(null);
  const [serviceEndDate, setServiceEndDateRaw] = useState<Date | null>(null);
  const [orderStartDate, setOrderStartDateRaw] = useState<Date | null>(null);
  const [orderEndDate, setOrderEndDateRaw] = useState<Date | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Hàm chuyển đổi string sang Date
  const parseDate = (date: string | null): Date | null => {
    return date ? new Date(date) : null;  // Chuyển string thành Date nếu có
  };

  // Cập nhật các setter sử dụng parseDate
  const setServiceStartDate = (date: string | null) => {
    setServiceStartDateRaw(parseDate(date));
  };

  const setServiceEndDate = (date: string | null) => {
    setServiceEndDateRaw(parseDate(date));
  };

  const setOrderStartDate = (date: string | null) => {
    setOrderStartDateRaw(parseDate(date));
  };

  const setOrderEndDate = (date: string | null) => {
    setOrderEndDateRaw(parseDate(date));
  };

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
        cartItemCount,
        setCartItemCount,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Hook để truy cập GlobalState
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalProvider");
  }
  return context;
};

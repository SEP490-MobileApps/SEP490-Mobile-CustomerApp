// contexts/GlobalProvider.tsx
import React, { createContext, useState, ReactNode } from "react";

const GlobalContext = createContext({});

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState({}); // Replace with your initial state and logic

  return (
    <GlobalContext.Provider value={{ state, setState }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;

import React, { createContext, useContext, useReducer } from "react";
export const AppStateContext = createContext();
export const AppStateProvider = ({ reducer, initialState, children }) => (
  <AppStateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </AppStateContext.Provider>
);
export const useAppState = () => useContext(AppStateContext);

import React, { createContext, useContext, useReducer } from "react";
export const WizardStateContext = createContext();
export const WizardStateProvider = ({ state, children }) => (
  <WizardStateContext.Provider value={state}>
    {children}
  </WizardStateContext.Provider>
);
export const useWizardState = () => useContext(WizardStateContext);

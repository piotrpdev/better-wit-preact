import { createContext } from "react";

export const SettingsContext = createContext({
  "Show Type and Location": true,
  setTypeAndLocation: () => {},
});

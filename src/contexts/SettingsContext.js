import { createContext } from "react";

export const SettingsContext = createContext({
  timetableJsonUrl: null,
  checkboxes: {
    "Show Type and Location": true,
    setTypeAndLocation: () => {},
  }
});

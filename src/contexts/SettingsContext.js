import { createContext } from "react";

export const SettingsContext = createContext({
  timetableJsonUrl: null,
  checkboxes: {
    "Show Type and Location": false,
    setTypeAndLocation: () => { },
    "Auto Update": true,
    setAutoUpdate: () => { },
  },
});

export const SettingsDefault = {
  timetableJsonUrl: null,
  checkboxes: {
    "Show Type and Location": false,
    "Auto Update": true,
  },
}

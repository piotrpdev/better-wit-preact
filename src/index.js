import { useState } from "react";
import DayEntries from "./components/DayEntries";
import DayList from "./components/DayList";
import SettingsBtn from "./components/SettingsBtn";
import SubjectList from "./components/SubjectList";
import useLocalStorageState from "use-local-storage-state";
import { SettingsContext } from "./contexts/SettingsContext";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootswatch/dist/slate/bootstrap.min.css";
// import "bootswatch/dist/morph/bootstrap.min.css";
// import "bootswatch/dist/superhero/bootstrap.min.css"; // This is a good one
import "bootswatch/dist/superhero/bootstrap.min.css";
import "./styles.css";

// https://gist.github.com/piotrpdev/26a84b878b6de2ebbb4f78bbc1ae467c
import _timetableData from "./timetable.json";
import getSubjectsFromData from "./utils/getSubjectsFromData";
const timetableData = JSON.parse(_timetableData);

export default function App() {
  const [settings, setSettings] = useLocalStorageState("settings", {
    defaultValue: { "Show Type and Location": false },
  });

  const [day, setDay] = useState("Monday");
  const [subjects] = useState(getSubjectsFromData(timetableData));
  const [checkedSubjects, setCheckedSubjects] = useLocalStorageState(
    "hiddenModules",
    {
      defaultValue: [],
    }
  );

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <div className="App">
        <header>
          <h1 className="py-2 mb-3">WIT Timetable</h1>
          <SettingsBtn />
        </header>
        <DayList currentDay={day} setDay={setDay} />
        <SubjectList
          subjects={subjects}
          checkedSubjects={checkedSubjects}
          setCheckedSubjects={setCheckedSubjects}
        />
        <DayEntries
          dayTimetableData={timetableData[day].filter(
            (_entry) =>
              !checkedSubjects.includes(_entry["Subject Code and Title"])
          )}
        />
      </div>
    </SettingsContext.Provider>
  );
}
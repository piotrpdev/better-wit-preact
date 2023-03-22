import { useState, useEffect } from "react";
import DayEntries from "./components/DayEntries";
import DayList from "./components/DayList";
import SettingsBtn from "./components/SettingsBtn";
import SubjectList from "./components/SubjectList";
import useLocalStorageState from "use-local-storage-state";
import { SettingsContext } from "./contexts/SettingsContext";
import Spinner from "react-bootstrap/Spinner";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootswatch/dist/slate/bootstrap.min.css";
// import "bootswatch/dist/morph/bootstrap.min.css";
// import "bootswatch/dist/superhero/bootstrap.min.css"; // This is a good one
import "bootswatch/dist/superhero/bootstrap.min.css";
import "./styles.css";

// https://gist.github.com/piotrpdev/26a84b878b6de2ebbb4f78bbc1ae467c

export default function App() {
  const [settings, setSettings] = useLocalStorageState("settings", {
    defaultValue: {
      timetableJsonUrl: null,
      checkboxes: {
        "Show Type and Location": false,
      },
    },
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const todayName = new Date().toLocaleString("en-us", { weekday: "long" });

  const [day, setDay] = useState(days.includes(todayName) ? todayName : "Monday");

  const [JsonParseError, setJsonParseError] = useState(false);

  const [timetableData, setTimetableData] = useLocalStorageState(
    "timetable_json_data",
    {
      defaultValue: null,
    }
  );

  const [checkedSubjects, setCheckedSubjects] = useLocalStorageState(
    "hiddenModules",
    {
      defaultValue: [],
    }
  );

  useEffect(() => {
    setJsonParseError(false);
    if (timetableData || !settings.timetableJsonUrl) return;

    fetch(settings.timetableJsonUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        if (!data?.files?.["timetable.json"]) {
          throw new Error("No timetable.json file found.");
        }

        const parsedData = JSON.parse(data.files["timetable.json"].content);

        setTimetableData(parsedData);
      })
      .catch((error) => {
        setJsonParseError(true);
        console.error("Error fetching/parsing timetable json:", error);
      });

    // import("./timetable.json").then((data) => {
    //   const importedTimetableData = data.default;
    //   //const parsedTimetableData = JSON.parse(importedTimetableData);
    //   console.dir(importedTimetableData.days)
    //   setTimetableData(importedTimetableData.days);
    // });
  }, [settings.timetableJsonUrl, setTimetableData, timetableData]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <div className="App">
        <header>
          <h1 className="py-2 mb-3">WIT Timetable</h1>
          <SettingsBtn />
        </header>
        <DayList currentDay={day} setDay={setDay} todayName={todayName} days={days} todayWeekday={day} />
        {settings.timetableJsonUrl ? (
          !JsonParseError ? (
            timetableData && timetableData.days ? (
              <>
                <SubjectList
                  timetableData={timetableData.days}
                  checkedSubjects={checkedSubjects}
                  setCheckedSubjects={setCheckedSubjects}
                />
                <DayEntries
                  dayTimetableData={timetableData.days[day].filter(
                    (_entry) =>
                      !checkedSubjects.includes(
                        _entry["Subject Code and Title"]
                      )
                  )}
                />
              </>
            ) : (
              <Spinner className="mt-5" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )
          ) : (
            <p className="mt-5">
              Something went wrong parsing the JSON data, please make sure you
              set the correct URL
            </p>
          )
        ) : (
          <p className="mt-5">
            Please set the correct timetable JSON URL in the settings.
          </p>
        )}
      </div>
    </SettingsContext.Provider>
  );
}

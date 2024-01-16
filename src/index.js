import { useState, useEffect } from "react";
import DayEntries from "./components/DayEntries";
import DayList from "./components/DayList";
import SettingsBtn from "./components/SettingsBtn";
import SubjectList from "./components/SubjectList";
import useLocalStorageState from "use-local-storage-state";
import { SettingsContext, SettingsDefault } from "./contexts/SettingsContext";
import Spinner from "react-bootstrap/Spinner";
import ToastContainer from 'react-bootstrap/ToastContainer';
import { DateTime } from "luxon";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootswatch/dist/slate/bootstrap.min.css";
// import "bootswatch/dist/morph/bootstrap.min.css";
// import "bootswatch/dist/superhero/bootstrap.min.css"; // This is a good one
import "bootswatch/dist/superhero/bootstrap.min.css";
import "./styles.css";
import fetchTimetable from "./utils/fetchTimetable";
import RefetchToast from "./components/RefetchToast";

// https://gist.github.com/piotrpdev/26a84b878b6de2ebbb4f78bbc1ae467c

export default function App() {
  const [settings, setSettings] = useLocalStorageState("settings", {
    defaultValue: SettingsDefault,
  });

  const todayName = (DateTime.now()).setZone('Europe/Dublin').toFormat("EEEE");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const getWeekday = () => days.includes(todayName) ? todayName : "Monday";
  const [day, setDay] = useState(getWeekday());

  const [JsonParseError, setJsonParseError] = useState(false);

  const [timetableData, setTimetableData] = useLocalStorageState(
    "timetable_json_data",
    {
      defaultValue: null,
    }
  );

  const [fetchedTimetableData, setFetchedTimetableData] = useState(null);

  const [checkedSubjects, setCheckedSubjects] = useLocalStorageState(
    "hiddenModules",
    {
      defaultValue: [],
    }
  );

  const [showRefetchToast, setShowRefetchToast] = useState(false);
  const toggleShowRefetchToast = () => setShowRefetchToast((prev) => !prev);

  useEffect(() => {
    const weekday = getWeekday();
    console.log(`Setting day to ${weekday}`)
    setDay(getWeekday());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setShowRefetchToast(false);
    setJsonParseError(false);
    if (timetableData?.devDetails) {
      const timetableDate = DateTime.fromISO(timetableData.devDetails.generatedDate)

      if (!timetableData.invalid && settings["Auto Update"]) {
        console.log("Fetching timetable data in devDetails")
        fetchTimetable(settings.timetableJsonUrl).then(({ data, error }) => {
          if (error) {
            //setJsonParseError(true);
          } else {
            const fetchedTimetableDate = DateTime.fromISO(data.devDetails.generatedDate)
            const diffDays = fetchedTimetableDate.diff(timetableDate, 'days').toObject().days

            if (diffDays > 0) {
              console.log("Fetched timetable data successfully")
              setFetchedTimetableData(data);
              setShowRefetchToast(true);
            }
          }
        });
      }
    }
    if (timetableData || !settings.timetableJsonUrl) return;

    console.log("Fetching timetable data")
    fetchTimetable(settings.timetableJsonUrl).then(({ data, error }) => {
      if (error) {
        console.error("Error fetching timetable data")
        setJsonParseError(true);
      } else {
        console.log("Fetched timetable data successfully")
        setTimetableData(data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.timetableJsonUrl, settings["Auto Update"], timetableData]);

  console.log("App Rendered")

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <div className="App">
        <header className="mb-3">
          <h1 className="mb-0">WIT Timetable</h1>
          <SettingsBtn timetableDataState={{ timetableData, setTimetableData }} />
        </header>
        <DayList day={day} setDay={setDay} todayName={todayName} days={days} />
        {!settings.timetableJsonUrl ? (
          <p className="mt-5">
            Please set the correct timetable JSON URL in the settings.
          </p>
        ) : (
          JsonParseError ? (
            <p className="mt-5">
              Something went wrong parsing the JSON data, please make sure you
              set the correct URL
            </p>
          ) : (
            !timetableData || !timetableData.days ? (
              <Spinner className="mt-5" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              <>
                <SubjectList
                  timetableData={timetableData.days}
                  checkedSubjectsState={{ checkedSubjects, setCheckedSubjects }}
                />
                {timetableData.days[day].length <= 0 ? <p className="mt-5">No classes today</p> : <DayEntries
                  dayTimetableData={timetableData.days[day].filter(
                    (_entry) =>
                      !checkedSubjects.includes(
                        _entry["Subject Code and Title"]
                      )
                  )}
                />}
              </>
            )
          )
        )}
      </div>
      <ToastContainer containerPosition="fixed" position="bottom-center" className="p-3">
        <RefetchToast refetchToastState={{ showRefetchToast, toggleShowRefetchToast }} timetableDataState={{ timetableData, setTimetableData }} fetchedTimetableData={fetchedTimetableData} />
      </ToastContainer>
    </SettingsContext.Provider>
  );
}

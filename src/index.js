import { useState, useEffect, useCallback, useMemo } from "react";
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

  const days = useMemo(() => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], []);
  const [now] = useState(DateTime.now())
  const [todayName] = useState(now.setZone('Europe/Dublin').toFormat("EEEE"));

  const getWeekday = useCallback(() => {
    return days.includes(todayName) ? todayName : "Monday"
  }, [days, todayName])

  const [day, setDay] = useState(getWeekday);

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
    setShowRefetchToast(false);
    setJsonParseError(false);
    if (timetableData?.devDetails) {
      const timetableDate = DateTime.fromISO(timetableData.devDetails.generatedDate)

      if (!timetableData.invalid && settings["Auto Update"]) {
        fetchTimetable(settings.timetableJsonUrl).then(({ data, error }) => {
          if (error) {
            //setJsonParseError(true);
          } else {
            const fetchedTimetableDate = DateTime.fromISO(data.devDetails.generatedDate)
            const diffDays = fetchedTimetableDate.diff(timetableDate, 'days').toObject().days

            if (diffDays > 0) {
              setFetchedTimetableData(data);
              setShowRefetchToast(true);
            }
          }
        });
      }
    }
    if (timetableData || !settings.timetableJsonUrl) return;

    fetchTimetable(settings.timetableJsonUrl).then(({ data, error }) => {
      if (error) {
        setJsonParseError(true);
      } else {
        setTimetableData(data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.timetableJsonUrl, settings["Auto Update"], timetableData, now]);

  useEffect(() => {
    setDay(getWeekday())
  }, [todayName, getWeekday])

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <div className="App">
        <header>
          <h1 className="py-2 mb-3">WIT Timetable</h1>
          <SettingsBtn timetableDataState={{ timetableData, setTimetableData }} />
        </header>
        <DayList dayState={{ setDay, day }} todayName={todayName} days={days} />
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

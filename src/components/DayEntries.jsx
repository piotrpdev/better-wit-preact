import Entry from "./Entry";

export default function DayEntries({ dayTimetableData }) {
  return (
    <div>
      <table className="entryContainer">
        <tbody>
          {dayTimetableData.map((_entry) => (
            <Entry
              key={`${_entry["Time"]}-${_entry["Room*"]}`}
              entry={_entry}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

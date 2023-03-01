export default function getSubjectsFromData(timetableData) {
  return [
    ...new Set(
      Object.values(timetableData)
        .map((day) => day.map((_entry) => _entry["Subject Code and Title"]))
        .flat()
    )
  ];
}

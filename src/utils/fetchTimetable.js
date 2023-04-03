export default async function fetchTimetable(timetableJsonUrl) {
    let _data, _error

    try {
        const response = await fetch(timetableJsonUrl);

        if (!response?.ok) throw new Error("Network response was not ok.");

        const data = await response.json();

        if (!data?.files?.["timetable.json"]) throw new Error("No timetable.json file found.");

        const parsedData = JSON.parse(data.files["timetable.json"].content);

        _data = parsedData
    } catch (error) {
        console.error("Error fetching/parsing timetable json:", error);

        _error = error
    }

    return { data: _data, error: _error }
}
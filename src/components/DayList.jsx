import Nav from "react-bootstrap/Nav";

export default function DayList({
  dayState: { setDay, day: _day },
  todayName,
  days,
}) {
  return (
    <Nav className="px-2" fill variant="tabs" activeKey={_day}>
      {days.map((day) => (
        <Nav.Item key={day}>
          <Nav.Link eventKey={day} onClick={() => setDay(day)}>
            {day === todayName ? (
              <b className="text-warning">{day.slice(0, 3)}</b>
            ) : (
              day.slice(0, 3)
            )}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}

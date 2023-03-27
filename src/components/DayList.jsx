import Nav from "react-bootstrap/Nav";

export default function DayList({ setDay, todayName, days, todayWeekday }) {
  return (
    <Nav className="px-2" fill variant="tabs" activeKey={todayWeekday}>
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

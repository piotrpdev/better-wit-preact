import Nav from "react-bootstrap/Nav";

export default function DayList({ day, setDay, todayName, days }) {
  console.debug(`DayList: day: ${day}, todayName: ${todayName}`);

  return (
    <Nav className="px-2" fill variant="tabs">
      {days.map((_day) => (
        <Nav.Item key={_day}>
          <Nav.Link
            eventKey={_day}
            active={_day === day}
            onClick={() => setDay(_day)}
          >
            {_day === todayName ? (
              <b className="text-warning">{_day.slice(0, 3)}</b>
            ) : (
              _day.slice(0, 3)
            )}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}

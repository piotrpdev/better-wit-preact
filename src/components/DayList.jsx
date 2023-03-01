import Nav from "react-bootstrap/Nav";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function DayList({ currentDay, setDay }) {
  return (
    <Nav className="px-2" fill variant="tabs" defaultActiveKey="Monday">
      {days.map((day) => (
        <Nav.Item>
          <Nav.Link eventKey={day} onClick={() => setDay(day)}>
            {day.slice(0, 3)}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}

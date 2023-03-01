import { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Checkbox from "./Checkbox";

export default function SubjectList({
  subjects,
  checkedSubjects,
  setCheckedSubjects,
}) {
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      if (!checkedSubjects.includes(event.target.value)) {
        setCheckedSubjects((prevState) => [...prevState, event.target.value]);
      }
    } else {
      setCheckedSubjects((prevState) =>
        prevState.filter((day) => day !== event.target.value)
      );
    }
  };

  return (
    <Accordion className="mt-3 px-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Hide Modules</Accordion.Header>
        <Accordion.Body>
          <div className="subjectList">
            {subjects.map((subject) => (
              <Checkbox
                value={`${subject}`}
                checked={checkedSubjects.includes(subject)}
                onChange={handleCheckboxChange}
                label={subject.substring(subject.indexOf(" ") + 1)}
              />
            ))}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

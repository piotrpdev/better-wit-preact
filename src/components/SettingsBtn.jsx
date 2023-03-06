import { useContext, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaCog, FaCheck } from "react-icons/fa";
import { SettingsContext } from "../contexts/SettingsContext";
import Checkbox from "./Checkbox";
import InputGroup from 'react-bootstrap/InputGroup';

export default function SettingsBtn() {
  const { settings, setSettings } = useContext(SettingsContext);
  const jsonUrlRef = useRef(null);
  const [show, setShow] = useState(false);

  const [jsonUrlValid, setJsonUrlValid] = useState(false);
  const [jsonUrlInvalid, setJsonUrlInvalid] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCheckboxChange = (event) => {
    setSettings((prev) => ({
      ...prev,
      [event.target.value]: event.target.checked,
    }));
  };

  const handleJsonUrlBtnClick = () => {
    const jsonUrl = jsonUrlRef.current.value;

    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    if (jsonUrl.match(regex)) {
      setJsonUrlInvalid(false);
      setJsonUrlValid(true);

      setSettings((prev) => ({
        ...prev,
        timetableJsonUrl: jsonUrl,
      }));
    } else {
      setJsonUrlValid(false);
      setJsonUrlInvalid(true);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        className="settingsButton"
        onClick={handleShow}
      >
        <FaCog />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        <InputGroup className="mb-3">
        <Form.Label>Timetable JSON URL</Form.Label>
        <div className="settingsInput">
          <Form.Control ref={jsonUrlRef} type="text" placeholder="https://gist.github.com/<user>/<id>" isValid={jsonUrlValid} isInvalid={jsonUrlInvalid} />
          <Button variant="primary" id="jsonUrl-buttonAddon" onClick={handleJsonUrlBtnClick}>
            <FaCheck />
          </Button>
        </div>
      </InputGroup>
    </Form>
            {Object.keys(settings.checkboxes).map((setting) => (
              <Checkbox
                value={setting}
                checked={settings[setting]}
                onChange={handleCheckboxChange}
                label={`${setting}`}
              />
            ))}
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          Made with ❤️ by{" "}
          <a href="https://github.com/piotrpdev" target="_blank">
            piotrpdev
          </a>
        </Modal.Footer>
      </Modal>
    </>
  );
}

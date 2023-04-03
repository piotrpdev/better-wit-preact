import { useContext, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { FaCog, FaCheck, FaRedo } from "react-icons/fa";
import { SettingsContext, SettingsDefault } from "../contexts/SettingsContext";
import Checkbox from "./Checkbox";
import InputGroup from "react-bootstrap/InputGroup";

export default function SettingsBtn({ timetableData, setTimetableData }) {
  const { settings, setSettings } = useContext(SettingsContext);
  const jsonUrlRef = useRef(null);
  const [show, setShow] = useState(false);

  const [jsonUrlValid, setJsonUrlValid] = useState(false);
  const [jsonUrlInvalid, setJsonUrlInvalid] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updateJsonUrl = (jsonUrl) => {
    setSettings((prev) => ({
      ...prev,
      timetableJsonUrl: jsonUrl,
    }));
    setTimetableData(null);
  };

  const handleCheckboxChange = (event) => {
    setSettings((prev) => ({
      ...prev,
      [event.target.value]: event.target.checked,
    }));
  };

  const handleJsonUrlBtnClick = () => {
    const jsonUrl = jsonUrlRef.current.value;

    const expression =
      // eslint-disable-next-line no-useless-escape
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    if (jsonUrl.match(regex)) {
      setJsonUrlInvalid(false);
      setJsonUrlValid(true);

      updateJsonUrl(jsonUrl);
    } else {
      setJsonUrlValid(false);
      setJsonUrlInvalid(true);
    }
  };

  const handleClearSettingsBtnClick = () => {
    setSettings(SettingsDefault);
    setShow(false);
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
                <Form.Control
                  ref={jsonUrlRef}
                  type="text"
                  placeholder="https://api.github.com/gists/<GIST_ID>"
                  defaultValue={settings.timetableJsonUrl}
                  isValid={jsonUrlValid}
                  isInvalid={jsonUrlInvalid}
                />
                <Button
                  variant="success"
                  id="jsonUrl-buttonAddon"
                  onClick={handleJsonUrlBtnClick}
                >
                  <FaRedo />
                </Button>
                <Button
                  variant="primary"
                  id="jsonUrl-buttonAddon"
                  onClick={handleJsonUrlBtnClick}
                >
                  <FaCheck />
                </Button>
              </div>
            </InputGroup>
          </Form>
          {timetableData && (
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th colSpan="2">Timetable Data</th>
                </tr>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(timetableData)
                  .filter(([, value]) => typeof value === "string")
                  .map(([key, value]) => (
                    <tr key={`table-row-${key}`}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
          <div className="settings-checkboxes">
            {Object.keys(settings.checkboxes).map((setting) => (
              <Checkbox
                key={`checkbox-${setting.replace(/\s/g, "")}`}
                value={setting}
                checked={settings[setting]}
                onChange={handleCheckboxChange}
                label={`${setting}`}
              />
            ))}
          </div>
          <Button
            id="clearSettings"
            variant="danger"
            onClick={handleClearSettingsBtnClick}
          >
            Clear Settings
          </Button>
          {process.env.NODE_ENV === "development" && (
            <div id="settings-debug">
              <h3>Debug</h3>
              <Button
                variant="primary"
                onClick={() => updateJsonUrl(process.env.NEW_JSON_URL)}
              >
                Use New JSON URL
              </Button>
              <Button
                variant="primary"
                onClick={() => updateJsonUrl(process.env.OLD_JSON_URL)}
              >
                Use Old JSON URL
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  setTimetableData(JSON.parse(process.env.OLD_TIMETABLE_DATA))
                }
              >
                Use Old Timetable Data
              </Button>
              <Button variant="primary" onClick={() => setTimetableData(null)}>
                Clear Timetable Data
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/piotrpdev"
            target="_blank"
            rel="noreferrer"
          >
            piotrpdev
          </a>
        </Modal.Footer>
      </Modal>
    </>
  );
}

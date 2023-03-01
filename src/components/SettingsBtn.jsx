import { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaCog } from "react-icons/fa";
import { SettingsContext } from "../contexts/SettingsContext";
import Checkbox from "./Checkbox";

export default function SettingsBtn() {
  const { settings, setSettings } = useContext(SettingsContext);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCheckboxChange = (event) => {
    setSettings((prev) => ({
      ...prev,
      [event.target.value]: event.target.checked,
    }));
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
            {Object.keys(settings).map((setting) => (
              <Checkbox
                value={setting}
                checked={settings[setting]}
                onChange={handleCheckboxChange}
                label={`${setting}`}
              />
            ))}
          </Form>
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

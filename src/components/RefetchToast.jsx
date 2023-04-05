import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";

export default function RefetchToast({
  refetchToastState: { showRefetchToast, toggleShowRefetchToast },
  timetableDataState: { timetableData, setTimetableData },
  fetchedTimetableData,
}) {
  return (
    <Toast
      id="refetch-toast"
      show={showRefetchToast}
      onClose={toggleShowRefetchToast}
    >
      <Toast.Header>
        <strong className="me-auto">New timetable available</strong>
      </Toast.Header>
      <Toast.Body>
        <div id="refetch-toast-details">
          <Table striped bordered responsive>
            <tbody>
              <tr>
                <td>
                  <b>New</b>
                </td>
                <td>{fetchedTimetableData?.generatedDate}</td>
              </tr>
              <tr>
                <td>
                  <b>Current</b>
                </td>
                <td>{timetableData?.generatedDate}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <Button
          variant="primary"
          onClick={() => setTimetableData(fetchedTimetableData)}
        >
          Update
        </Button>
      </Toast.Body>
    </Toast>
  );
}

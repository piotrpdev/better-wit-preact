import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsContext";

import BookSVG from "./icons/BookSVG";
import FlaskSVG from "./icons/FlaskSVG";
import MGlassSVG from "./icons/MGlassSVG";

const svgMap = {
  P: FlaskSVG,
  L: BookSVG,
  T: MGlassSVG,
  default: FlaskSVG,
};

export default function Entry(props) {
  const { settings } = useContext(SettingsContext);

  const subjectCodeAndTitle = props.entry["Subject Code and Title"];
  const subjectCode = subjectCodeAndTitle.substring(
    0,
    subjectCodeAndTitle.indexOf(" ")
  );
  const title = subjectCodeAndTitle.substring(
    subjectCodeAndTitle.indexOf(" ") + 1
  );
  const typeAndLocation = props.entry["Type"].split(" - ");

  const lecturer = props.entry["Lecturer"].split(", ").reverse().join(" ");

  const TypeSVG = svgMap[typeAndLocation[0]] || svgMap.default;

  return (
    <tr className={`entry ${typeAndLocation[0]}`}>
      <td className="room-and-time">
        <div className="room-and-time-flex">
          <div className="room">{props.entry["Room*"]}</div>
          <div className="line" />
          <div className="time">{props.entry["Time"]}</div>
        </div>
      </td>
      <td
        className={`subject-and-lecturer ${
          settings["Show Type and Location"] ? "" : "alone"
        }`}
      >
        <div className="subject">{title}</div>
        <div className="lecturer">{lecturer}</div>
      </td>
      {settings["Show Type and Location"] && (
        <td className="icons">
          <div className="type">
            <TypeSVG />
          </div>
          <div className="location">{typeAndLocation[1]}</div>
        </td>
      )}
    </tr>
  );
}

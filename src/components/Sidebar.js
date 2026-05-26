import {
  FaChartBar,
  FaUsers,
  FaFileAlt,
  FaExclamationTriangle,
  FaChartLine
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="sidebar">

      <p onClick={() => window.location.href="/dashboard"}>
        <FaChartBar /> Dashboard
      </p>

      <p onClick={() => window.location.href="/users"}>
        <FaUsers /> Users
      </p>

      <p onClick={() => window.location.href="/posts"}>
        <FaFileAlt /> Posts
      </p>

      <p onClick={() => window.location.href="/emergencies"}>
        <FaExclamationTriangle /> Emergencies
      </p>

      <p onClick={() => window.location.href="/analytics"}>
        <FaChartLine /> Analytics
      </p>

    </div>
  );
}

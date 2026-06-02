import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <h2>UniLink</h2>

      <NavLink to="/dashboard">
        Dashboard
      </NavLink>

      <NavLink to="/users">
        Users
      </NavLink>

      <NavLink to="/posts">
        Posts
      </NavLink>

      <NavLink to="/emergencies">
        Emergencies
      </NavLink>

      <NavLink to="/universities">
        Universities
      </NavLink>

      <NavLink to="/analytics">
        Analytics
      </NavLink>

      <NavLink to="/settings">
        Settings
      </NavLink>

    </aside>
  );
}

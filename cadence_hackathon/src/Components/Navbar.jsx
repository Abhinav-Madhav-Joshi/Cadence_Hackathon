import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation(); // To highlight active page

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      backgroundColor: "#333",
      color: "white"
    }}>
      <h2 style={{ margin: 0 }}>Product Dashboard</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: location.pathname === "/" ? "#4CAF50" : "white",
            fontWeight: location.pathname === "/" ? "bold" : "normal"
          }}
        >
          Home
        </Link>

        {/* <Link
          to="/graphs"
          style={{
            textDecoration: "none",
            color: location.pathname === "/graphs" ? "#4CAF50" : "white",
            fontWeight: location.pathname === "/graphs" ? "bold" : "normal"
          }}
        >
          Data Visualisation
        </Link> */}

        <Link
          to="/ddt"
          style={{
            textDecoration: "none",
            color: location.pathname === "/ddt" ? "#4CAF50" : "white",
            fontWeight: location.pathname === "/ddt" ? "bold" : "normal"
          }}
        >
          Detailed Data Table
        </Link>

        <Link
          to="/atable"
          style={{
            textDecoration: "none",
            color: location.pathname === "/atable" ? "#4CAF50" : "white",
            fontWeight: location.pathname === "/atable" ? "bold" : "normal"
          }}
        >
          Analytics Table
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

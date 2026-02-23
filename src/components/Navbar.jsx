import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  // get role from localStorage
  const role = localStorage.getItem("userRole");

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* LEFT SIDE (spacing for center alignment) */}
      <div className="nav-left"></div>

      {/* CENTER TITLE / LOGO */}
      <Link to="/" className="logo-link">
        <div className="logo">
          <span className="logo-icon">💪</span>
          <span className="logo-text">Health Tracker</span>
        </div>
      </Link>

      {/* RIGHT SIDE BUTTONS */}
      <div className="nav-buttons">
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <button className="nav-btn">Login</button>
            </Link>

            <Link to="/register">
              <button className="nav-btn register">
                Register
              </button>
            </Link>
          </>
        ) : (
          <>
            {/* Admin button only if admin */}
            {role === "admin" && (
              <button
                className="nav-btn admin"
                onClick={() => navigate("/admin")}
              >
                Admin Panel
              </button>
            )}

            <button
              className="nav-btn logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
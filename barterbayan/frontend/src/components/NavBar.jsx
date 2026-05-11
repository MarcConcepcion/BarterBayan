import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth }          from "../context/AuthContext";
import { apiGet }           from "../utils/api";
import MapOverlay           from "./MapOverlay";
import NotificationPanel    from "./NotificationPanel";
import "./NavBar.css";
 
export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [showMap,    setShowMap]    = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unread,     setUnread]     = useState(0);
 
  const tab = (path) => location.pathname === path ? "nav-tab active" : "nav-tab";
 
  const handleLogout = async () => {
    await apiGet("/auth/logout.php");
    logout();
    navigate("/login");
  };
 
  return (
    <>
      {/* ── Top header ── */}
      <header className="nav-top">
        <div className="nav-brand">
          <span className="nav-brand-name">BarterBayan</span>
          <span className="nav-brand-sub">The Community Barter Network.</span>
        </div>
        <button className="nav-bell-btn" onClick={() => setShowNotifs(true)}>
          &#x1F514;
          {unread > 0 && <span className="nav-badge">{unread}</span>}
        </button>
      </header>
 
      {/* ── Bottom tab bar ── */}
      <nav className="nav-bottom">
        <Link to="/home" className={tab("/home")}>
          <span className="nav-tab-icon">&#x2302;</span>
          Home
        </Link>
        <Link to="/post" className="nav-post-btn" title="Post Item">+</Link>
        <Link to={`/profile/${user?.user_id}`} className={tab(`/profile/${user?.user_id}`)}>
          <span className="nav-tab-icon">&#x1F464;</span>
          Me
        </Link>
      </nav>
 
      {showMap    && <MapOverlay       onClose={() => setShowMap(false)} />}
      {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} setUnread={setUnread} />}
    </>
  );
}

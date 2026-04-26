import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, PlusSquare, User, Menu, X, Camera, Search, Users, Bell } from "lucide-react";
import { NotificationsDropdown } from "./NotificationsDropdown";
import "./Navbar.css";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Camera size={24} />
          </div>
          <span className="gradient-text">PixLoop</span>
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <div className="navbar-links-desktop">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
              title="Home Feed"
            >
              <Home size={20} />
              <span>Feed</span>
            </Link>
            
            <Link
              to="/groups"
              className={`nav-link ${isActive("/groups") ? "active" : ""}`}
              title="Groups"
            >
              <Users size={20} />
              <span>Groups</span>
            </Link>

            <div className="nav-search">
              <Search size={18} />
              <input type="text" placeholder="Search..." />
            </div>

            <Link
              to="/create"
              className="nav-link create-btn"
              title="Create Post"
            >
              <PlusSquare size={20} />
              <span>Create</span>
            </Link>

            {/* Notifications */}
            <NotificationsDropdown />

            {/* Profile */}
            <Link to="/profile" className="nav-profile" title="Profile">
              <div className="profile-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        {user && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="navbar-menu-btn"
            title="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <div className="navbar-mobile-menu">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}
          >
            <Home size={20} />
            <span>Feed</span>
          </Link>

          <Link
            to="/create"
            onClick={() => setMenuOpen(false)}
            className={`mobile-nav-link ${isActive("/create") ? "active" : ""}`}
          >
            <PlusSquare size={20} />
            <span>Create Post</span>
          </Link>

          <Link
            to="/groups"
            onClick={() => setMenuOpen(false)}
            className={`mobile-nav-link ${isActive("/groups") ? "active" : ""}`}
          >
            <Users size={20} />
            <span>Groups</span>
          </Link>

          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className={`mobile-nav-link ${isActive("/profile") ? "active" : ""}`}
          >
            <User size={20} />
            <span>Profile</span>
          </Link>

          <button className="mobile-nav-link">
            <Bell size={20} />
            <span>Notifications</span>
          </button>
        </div>
      )}
    </nav>
  );
};
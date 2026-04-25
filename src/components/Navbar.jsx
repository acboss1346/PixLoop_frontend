import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, PlusSquare, User, Menu, X, Camera } from "lucide-react";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white tracking-tight hover:opacity-80 transition-opacity">
            <Camera className="text-blue-500" size={28} />
            PixLoop
          </Link>

          {/* Desktop Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                  isActive("/") ? "text-white bg-neutral-900" : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
                }`}
              >
                <Home size={20} />
                Feed
              </Link>
              <Link
                to="/create"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                  isActive("/create") ? "text-white bg-neutral-900" : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
                }`}
              >
                <PlusSquare size={20} />
                Create
              </Link>
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                  isActive("/profile") ? "text-white bg-neutral-900" : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
                }`}
              >
                <User size={20} />
                Profile
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {user && (
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <div className="md:hidden bg-neutral-950 border-b border-neutral-800 px-4 py-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
              isActive("/") ? "text-white bg-neutral-900" : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <Home size={22} />
            Feed
          </Link>
          <Link
            to="/create"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
              isActive("/create") ? "text-white bg-neutral-900" : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <PlusSquare size={22} />
            Create Post
          </Link>
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
              isActive("/profile") ? "text-white bg-neutral-900" : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <User size={22} />
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
};
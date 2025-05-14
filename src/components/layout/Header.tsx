import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  User,
  Users,
  Home,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";

const Header: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-primary shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo and Project selector */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 text-white rounded-md hover:bg-primary-dark md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex items-center gap-3 px-4 py-3 mb-4">
            <Users size={20} className="text-white" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              CollabSuite
            </h1>
          </Link>
        </div>
        {/* User menu */}
        <div className="flex items-center gap-2">
          {state.isAuthenticated && (
            <>
              <Link
                to="/notifications"
                className="p-2 text-white rounded-md hover:bg-primary-dark relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full text-xs flex items-center justify-center text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white font-semibold"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  {state.user?.name.substring(0, 2).toUpperCase() || "JB"}
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fade-in">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium">{state.user?.name}</p>
                      <p className="text-xs text-text-muted">
                        {state.user?.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-background"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-background"
                    >
                      <Home size={16} />
                      <span>Home</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-background"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-background w-full text-left"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code2, User, Moon, Sun, LogOut } from "lucide-react";
import useUiStore from "../../store/useUiStore";
import useAuthStore from "../../store/useAuthStore";

const Navbar = () => {
  const { theme, toggleTheme } = useUiStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className={`sticky top-0 z-50 w-full backdrop-blur-lg border-b border-base-300/30 transition-colors duration-300 ${
        theme === "dark" ? "bg-base-100/80" : "bg-white/80"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo & Main Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold transition-transform group-hover:scale-105">
                <Code2 size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-base-content group-hover:text-primary transition-colors">
                CodeLab
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link to="/problems" className="px-4 py-2 rounded-lg text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200/50 transition-all">
                Problems
              </Link>
            </div>
          </div>

          {/* Right: Auth & Theme */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 text-base-content/70 hover:text-base-content hover:bg-base-content/10 rounded-full transition-colors flex items-center justify-center"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3 border-l border-base-300 pl-2">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-base-200/50 transition-colors">
                  {user.avatar?.url ? (
                    <img src={user.avatar.url} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-base-300" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User size={16} />
                    </div>
                  )}
                  <span className="text-sm font-medium text-base-content hidden sm:block">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-base-content/70 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-base-300/50 pl-4">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-base-content hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-content hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FileCode, PlusCircle, Home, LogOut, X, Sun, Moon } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import useUiStore from "../../store/useUiStore";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/admin/", icon: LayoutDashboard },
    { name: "Problems", path: "/admin/problems", icon: FileCode },
    { name: "Create Problem", path: "/admin/problems/new", icon: PlusCircle },
  ];

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen || window.innerWidth >= 768 ? 0 : -300 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed md:relative z-50 w-72 h-full bg-base-100/80 backdrop-blur-2xl border-r border-base-300/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col"
      >
        <div className="p-6 border-b border-base-300/50 flex justify-between items-center">
          <Link to="/admin" className="text-2xl font-extrabold flex items-center gap-3">
            <LayoutDashboard size={28} className="text-primary" /> Admin Panel
          </Link>
          <button className="md:hidden p-2 hover:bg-base-200 rounded-xl transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.path === "/admin/" 
              ? location.pathname === "/admin" || location.pathname === "/admin/"
              : link.path === "/admin/problems"
              ? location.pathname === "/admin/problems" || location.pathname.endsWith("/edit")
              : location.pathname === link.path;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? "text-primary-content font-semibold shadow-lg shadow-primary/25"
                    : "hover:bg-base-200/80 text-base-content/70 hover:text-base-content font-medium"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon size={20} className={isActive ? "text-primary-content" : "text-base-content/50 group-hover:text-primary transition-colors"} />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-6 mt-6 border-t border-base-300/50">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base-content/70 hover:text-base-content hover:bg-base-200/80 transition-all font-medium group"
            >
              <Home size={20} className="text-base-content/50 group-hover:text-secondary transition-colors" />
              Back to Main Site
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-base-300/50 bg-base-200/30 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <Link to="/admin/profile" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm group-hover:ring-2 ring-primary/50 transition-all">
                {user.avatar ? (
                  <img src={user.avatar.url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-none group-hover:text-primary transition-colors">{user?.name}</span>
                <span className="text-xs text-base-content/60 mt-1">{user?.email}</span>
              </div>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 text-base-content/70 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors flex items-center justify-center"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-error hover:bg-error/10 hover:shadow-sm font-semibold rounded-xl transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;

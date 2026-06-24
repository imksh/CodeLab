import { Outlet, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../ui/Navbar";
import useUiStore from "../../store/useUiStore";
import useAuthStore from "../../store/useAuthStore";

const UserLayout = () => {
  const location = useLocation();
  const { theme } = useUiStore();
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <div className="h-dvh flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`h-dvh w-full flex flex-col overflow-hidden transition-colors duration-300 ${theme === "dark" ? "bg-base-100" : "bg-base-200"}`}>
      <Navbar />
      <div className="flex-1 min-h-0 relative flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`flex-1 min-h-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
              location.pathname === '/problems' 
                ? 'py-4 overflow-hidden flex flex-col' 
                : 'py-8 overflow-y-auto'
            }`}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserLayout;

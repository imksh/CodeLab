import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../ui/Navbar";
import useUiStore from "../../store/useUiStore";

const PublicLayout = () => {
  const location = useLocation();
  const { theme } = useUiStore();

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
            className="flex-1 min-h-0 w-full overflow-y-auto flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PublicLayout;

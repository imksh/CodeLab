import React, { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  User,
  Crown,
  Code2,
  Moon,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUiStore from "../../store/useUiStore";
import api from "../../config/api";
import toast from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";

const Header = () => {
  const { theme, toggleTheme, currentProblemNumber } = useUiStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <nav
      className={`h-[5dvh] flex items-center justify-between px-6 z-10 shadow-sm transition-colors duration-300 ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/problems")}
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-sm transition-transform group-hover:scale-105">
            <Code2 size={16} />
          </div>
          <span className="font-bold text-base-content text-base hover:text-primary transition-colors tracking-wide">
            CodeLab
          </span>
        </div>
        <div className="flex items-center text-base-content/60 gap-1 ml-4 border-l border-base-content/10 pl-4">
          <button
            onClick={async () => {
              if (!currentProblemNumber) return;
              try {
                const res = await api.get(
                  `/problems/n/${currentProblemNumber - 1}`,
                );
                navigate(`/codelab/${res.data.data._id}`);
              } catch (err) {
                toast.error("No previous problem");
              }
            }}
            className="p-1.5 hover:bg-base-content/10 hover:text-base-content rounded-lg transition-colors"
            title="Previous Problem"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={async () => {
              if (!currentProblemNumber) return;
              try {
                const res = await api.get(
                  `/problems/n/${currentProblemNumber + 1}`,
                );
                navigate(`/codelab/${res.data.data._id}`);
              } catch (err) {
                toast.error("No next problem");
              }
            }}
            className="p-1.5 hover:bg-base-content/10 hover:text-base-content rounded-lg transition-colors"
            title="Next Problem"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={async () => {
              try {
                const res = await api.get(`/problems/random`);
                navigate(`/codelab/${res.data.data._id}`);
              } catch (err) {
                toast.error("Failed to fetch random problem");
              }
            }}
            className="p-1.5 hover:bg-base-content/10 hover:text-base-content rounded-lg transition-colors"
            title="Pick Random"
          >
            <Shuffle size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 text-base-content/70 hover:text-base-content hover:bg-base-content/10 rounded-full transition-colors flex items-center justify-center"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button onClick={()=>navigate("/profile")}  className="w-6 h-6 rounded-full bg-base-300 border border-base-content/10 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all shadow-sm">
          {user.avatar ? (
            <img
              src={user.avatar.url}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-base-content">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Header;

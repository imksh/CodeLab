import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Problem from "../components/Problem";
import Code from "../components/Code";
import useUiStore from "../store/useUiStore";
import { motion } from "framer-motion";
import api  from "../config/api";
import { Loader2 } from "lucide-react";

const CodeLab = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { maximizeView, theme, setCurrentProblemNumber } = useUiStore();
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const [problemData, setProblemData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const userSubmits = (status) => {
    setProblemData((prev) => ({
      ...prev,
      totalSubmissions: prev.totalSubmissions + 1,
      solveStatus: prev.solveStatus === "Accepted" ? "Accepted" : status,
    }));
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/problems/${id}`);
        if (res.data.success) {
          setProblemData(res.data.data);
          setCurrentProblemNumber(res.data.data.number);
        }
      } catch (error) {
        console.error(error);
        navigate("/problems");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblem();
  }, [id, navigate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
  }, [isDragging]);

  if (isLoading) {
    return (
      <div
        className={`h-full flex items-center justify-center ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
      >
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!problemData) return null;

  return (
    <div
      className={`h-full flex flex-col  text-base-content/80 font-sans overflow-hidden ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      {/* Main Workspace */}
      <div className="flex-1 flex gap-0.5 p-2 overflow-hidden h-[calc(100vh-3rem)]">
        {/* Left Panel */}
        <motion.div
          animate={{
            width: maximizeView ? "0%" : `${leftWidth}%`,
            opacity: maximizeView ? 0 : 1,
          }}
          transition={{ duration: isDragging ? 0 : 0.3, ease: "easeInOut" }}
          className={`flex flex-col bg-base-100 rounded-lg overflow-hidden border border-base-300/30 ${
            maximizeView ? "border-none pointer-events-none" : ""
          }`}
        >
          <Problem data={problemData} />
        </motion.div>

        {/* Resizer */}
        {!maximizeView && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            className="w-1.5 cursor-col-resize rounded-full bg-transparent hover:bg-white/20 active:bg-white/30 transition-colors z-10 shrink-0 flex items-center justify-center"
          >
            <div className="w-0.5 h-8 bg-base-300 rounded-full pointer-events-none" />
          </div>
        )}

        {/* Right Panel */}
        <motion.div
          animate={{
            width: maximizeView ? "100%" : `${100 - leftWidth}%`,
          }}
          transition={{ duration: isDragging ? 0 : 0.3, ease: "easeInOut" }}
          className="flex flex-col gap-2 overflow-hidden"
        >
          <Code data={problemData} userSubmits={userSubmits} />
        </motion.div>
      </div>
    </div>
  );
};

export default CodeLab;

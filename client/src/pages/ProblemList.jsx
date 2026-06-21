import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import api from "../config/api";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(
          `/problems?page=${currentPage}&limit=${limit}`,
        );
        setProblems(res.data.data);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch problems", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblems();
  }, [currentPage]);

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "EASY":
        return "text-emerald-500";
      case "MEDIUM":
        return "text-yellow-500";
      case "HARD":
        return "text-red-500";
      default:
        return "text-base-content";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-base-content tracking-tight">
            Problems
          </h1>
          <p className="text-base-content/60 mt-1">
            Master algorithms and data structures
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-base-content shadow-sm"
            placeholder="Search problems..."
          />
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl border border-base-300/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-base-200/50 text-base-content/60 font-medium border-b border-base-300/50">
              <tr>
                <th className="px-6 py-4 w-16">Status</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4 w-32">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300/30">
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-primary"
                      size={24}
                    />
                  </td>
                </tr>
              ) : problems.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-12 text-center text-base-content/60"
                  >
                    No problems found.
                  </td>
                </tr>
              ) : (
                problems.map((prob, idx) => (
                  <motion.tr
                    key={prob._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-base-200/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      {/* Placeholder for actual solve status */}
                      {prob.solveStatus === "Accepted" ? (
                        <CheckCircle2 size={18} className="text-green-500" />
                      ) : prob.solveStatus === "Attempted" ? (
                        <XCircle size={18} className="text-error" />
                      ) : (
                        <Circle size={18} className="text-base-content/20" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/codelab/${prob._id}`}
                        className="font-medium text-base-content hover:text-primary transition-colors block"
                      >
                        {prob.number
                          ? prob.number + ". " + prob.title
                          : prob.title}
                      </Link>
                    </td>
                    <td
                      className={`px-6 py-4 font-medium ${getDifficultyColor(prob.difficulty)}`}
                    >
                      {prob.difficulty.charAt(0) +
                        prob.difficulty.slice(1).toLowerCase()}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-base-300 hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base-content"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg font-medium text-sm transition-colors ${
                    currentPage === page
                      ? "bg-primary text-primary-content"
                      : "border border-base-300 text-base-content hover:bg-base-200"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={currentPage === pagination.totalPages}
            className="p-2 rounded-lg border border-base-300 hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base-content"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProblemList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Filter,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import api from "../config/api";

const PREFILLED_COMPANIES = [
  "Google",
  "Facebook",
  "Amazon",
  "Microsoft",
  "Apple",
  "Netflix",
  "Uber",
];
const PREFILLED_TAGS = [
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
];

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Filters
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams({
          page: currentPage,
          limit,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(difficulty && { difficulty }),
          ...(selectedTags.length > 0 && { tags: selectedTags.join(",") }),
          ...(selectedCompanies.length > 0 && {
            companies: selectedCompanies.join(","),
          }),
        }).toString();

        const res = await api.get(`/problems?${query}`);
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
  }, [
    currentPage,
    limit,
    debouncedSearch,
    difficulty,
    selectedTags,
    selectedCompanies,
  ]);

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "EASY":
        return "text-success";
      case "MEDIUM":
        return "text-warning";
      case "HARD":
        return "text-error";
      default:
        return "text-base-content";
    }
  };

  const toggleArrayItem = (item, array, setter) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item));
    } else {
      setter([...array, item]);
    }
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-18 gap-4 h-full overflow-hidden px-4 md:px-0">
      {/* LEFT COLUMN: Filters (Difficulty & Tags) */}
      <div className="lg:col-span-4 lg:col-start-1 lg:h-full lg:overflow-y-auto space-y-6 hidden lg:block scrollbar-hide lg:pr-2 lg:pb-10">
        <div className="bg-base-100/50 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-sm p-5">
          <div className="flex items-center gap-2 font-extrabold text-base-content mb-6 border-b border-base-300/50 pb-3">
            <Filter size={18} className="text-primary" /> Filters
          </div>

          <div className="space-y-6 text-sm">
            <div>
              <label className="font-bold block mb-3 text-base-content/80">
                Difficulty
              </label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setDifficulty("");
                    setCurrentPage(1);
                  }}
                  className={`text-left px-3 py-2 rounded-xl font-semibold transition-all ${difficulty === "" ? "bg-primary/10 text-primary" : "hover:bg-base-200 text-base-content/70"}`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setDifficulty("EASY");
                    setCurrentPage(1);
                  }}
                  className={`text-left px-3 py-2 rounded-xl font-semibold transition-all ${difficulty === "EASY" ? "bg-success/10 text-success" : "hover:bg-base-200 text-base-content/70"}`}
                >
                  Easy
                </button>
                <button
                  onClick={() => {
                    setDifficulty("MEDIUM");
                    setCurrentPage(1);
                  }}
                  className={`text-left px-3 py-2 rounded-xl font-semibold transition-all ${difficulty === "MEDIUM" ? "bg-warning/10 text-warning" : "hover:bg-base-200 text-base-content/70"}`}
                >
                  Medium
                </button>
                <button
                  onClick={() => {
                    setDifficulty("HARD");
                    setCurrentPage(1);
                  }}
                  className={`text-left px-3 py-2 rounded-xl font-semibold transition-all ${difficulty === "HARD" ? "bg-error/10 text-error" : "hover:bg-base-200 text-base-content/70"}`}
                >
                  Hard
                </button>
              </div>
            </div>

            {/* <div>
              <label className="font-bold block mb-3 text-base-content/80">Tags</label>
              <div className="flex flex-wrap gap-2">
                {PREFILLED_TAGS.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => toggleArrayItem(tag, selectedTags, setSelectedTags)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedTags.includes(tag) ? 'bg-primary text-primary-content shadow-sm shadow-primary/30' : 'bg-base-200 text-base-content/70 hover:bg-base-300'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* CENTER COLUMN: Problem List */}
      <div className="lg:col-span-10 h-full overflow-y-auto space-y-6 scrollbar-hide lg:px-2 pb-24 lg:pb-10 scrollbar-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 md:hidden ">
          <div>
            <h1 className="text-3xl font-extrabold text-base-content tracking-tight">
              Problems
            </h1>
            <p className="text-base-content/60 mt-1">
              Master algorithms and data structures
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 hidden md:flex">
          <div>
            <h1 className="text-3xl font-extrabold text-base-content tracking-tight">
              Problems
            </h1>
            <p className="text-base-content/60 mt-1">
              Master algorithms and data structures
            </p>
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 bg-base-100/50 backdrop-blur border border-base-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium text-base-content shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all"
              placeholder="Search challenges..."
            />
          </div>
        </div>

        {/* Mobile Search & Difficulty */}
        <div className="flex gap-2 w-full md:hidden mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 bg-base-100/50 backdrop-blur border border-base-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium text-base-content shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all"
              placeholder="Search..."
            />
          </div>
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setCurrentPage(1);
            }}
            className="w-[100px] shrink-0 bg-base-100/50 backdrop-blur border border-base-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold text-base-content px-3 py-3 outline-none"
          >
            <option value="">Diff</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Med</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        {/* Horizontal Tags in main section */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => {
              setDifficulty("");
              setCurrentPage(1);
              setSelectedTags([]);
              setSelectedCompanies([]);
            }}
            className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-base-200 text-base-content/70 hover:bg-base-300 border border-base-300/50"
          >
            Clear All
          </button>
          {PREFILLED_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                toggleArrayItem(tag, selectedTags, setSelectedTags)
              }
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedTags.includes(tag) ? "bg-primary text-primary-content shadow-sm shadow-primary/30 border-primary" : "bg-base-100 border border-base-300 text-base-content/70 hover:bg-base-200 hover:text-base-content"}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="bg-base-100/50 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-base-200/30 text-base-content/60 font-semibold border-b border-base-300/50">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4 w-32">Difficulty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300/30">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center">
                        <Loader2
                          className="animate-spin mx-auto text-primary"
                          size={32}
                        />
                        <p className="mt-4 font-medium text-base-content/60">
                          Loading problems...
                        </p>
                      </td>
                    </tr>
                  ) : problems.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-16 text-center text-base-content/60"
                      >
                        <div className="max-w-xs mx-auto">
                          <Filter
                            size={48}
                            className="mx-auto mb-4 opacity-20"
                          />
                          <p className="font-bold text-lg mb-1">
                            No matches found
                          </p>
                          <p className="text-sm">
                            Try adjusting your filters or search query to find
                            more problems.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    problems.map((prob, idx) => (
                      <motion.tr
                        key={prob._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                        className="hover:bg-base-200/40 transition-colors group"
                      >
                        <td className="px-6 py-5 flex gap-2 items-center">
                          {prob.solveStatus === "Accepted" ? (
                            <CheckCircle2
                              size={16}
                              className="text-success shadow-sm rounded-full"
                            />
                          ) : prob.solveStatus === "Attempted" ? (
                            <XCircle
                              size={16}
                              className="text-error shadow-sm rounded-full"
                            />
                          ) : (
                            <Circle
                              size={16}
                              className="text-base-content/20 group-hover:text-base-content/40 transition-colors"
                            />
                          )}
                          <Link
                            to={`/codelab/${prob._id}`}
                            className="font-bold text-base-content hover:text-primary transition-colors block text-base"
                          >
                            {prob.number
                              ? prob.number + ". " + prob.title
                              : prob.title}
                          </Link>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              prob.difficulty === "EASY"
                                ? "border-success/30 text-success bg-success/10"
                                : prob.difficulty === "MEDIUM"
                                  ? "border-warning/30 text-warning bg-warning/10"
                                  : "border-error/30 text-error bg-error/10"
                            }`}
                          >
                            {prob.difficulty.charAt(0) +
                              prob.difficulty.slice(1).toLowerCase()}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="py-16 text-center">
                <Loader2
                  className="animate-spin mx-auto text-primary"
                  size={32}
                />
                <p className="mt-4 font-medium text-base-content/60">
                  Loading problems...
                </p>
              </div>
            ) : problems.length === 0 ? (
              <div className="py-16 text-center text-base-content/60">
                <Filter size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold text-lg mb-1">No matches found</p>
                <p className="text-sm">
                  Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              problems.map((prob, idx) => (
                <motion.div
                  key={prob._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  className="bg-base-100/80 backdrop-blur-xl border border-base-300/50 rounded-3xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <Link
                    to={`/codelab/${prob._id}`}
                    className="flex justify-between items-start gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {prob.solveStatus === "Accepted" ? (
                          <CheckCircle2
                            size={20}
                            className="text-success shadow-sm rounded-full bg-success/10"
                          />
                        ) : prob.solveStatus === "Attempted" ? (
                          <XCircle
                            size={20}
                            className="text-error shadow-sm rounded-full bg-error/10"
                          />
                        ) : (
                          <Circle
                            size={20}
                            className="text-base-content/20 bg-base-200 rounded-full"
                          />
                        )}
                      </div>
                      <div>
                        <h2 className="font-bold text-base-content text-lg leading-tight mb-2">
                          {prob.number
                            ? prob.number + ". " + prob.title
                            : prob.title}
                        </h2>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                            prob.difficulty === "EASY"
                              ? "text-success bg-success/10"
                              : prob.difficulty === "MEDIUM"
                                ? "text-warning bg-warning/10"
                                : "text-error bg-error/10"
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-base-content/30" />
                  </Link>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Controls */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 pb-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-base-300 hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base-content bg-base-100 shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none px-2 scrollbar-hide">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`shrink-0 w-10 h-10 rounded-xl font-bold text-sm transition-all shadow-sm ${
                    currentPage === page
                      ? "bg-primary text-primary-content shadow-primary/30"
                      : "border border-base-300 text-base-content/70 hover:bg-base-200 hover:text-base-content bg-base-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={currentPage === pagination.totalPages}
              className="p-2.5 rounded-xl border border-base-300 hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base-content bg-base-100 shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Mobile Companies Card */}
        <div className="md:hidden mt-4 mb-8 bg-base-100/50 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-sm p-5">
          <div className="flex items-center gap-2 font-extrabold text-base-content mb-4 border-b border-base-300/50 pb-3">
            Top Companies
          </div>
          <div className="flex flex-wrap gap-2">
            {PREFILLED_COMPANIES.map((company) => (
              <button
                key={company}
                onClick={() =>
                  toggleArrayItem(
                    company,
                    selectedCompanies,
                    setSelectedCompanies,
                  )
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedCompanies.includes(company)
                    ? "bg-secondary text-secondary-content border-secondary shadow-sm shadow-secondary/20"
                    : "bg-base-100 border-base-300 text-base-content/70 hover:border-secondary/50 hover:text-secondary"
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Company & User Stats */}
      <div className="lg:col-span-4 lg:h-full lg:overflow-y-auto space-y-6 hidden lg:block scrollbar-none lg:pl-2 lg:pb-10">
        {/* User Stats Card */}
        {user ? (
          <div className="bg-base-100/50 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-sm p-6 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

            <div className="w-20 h-20 mx-auto rounded-full bg-base-200 border-4 border-base-100 shadow-lg flex items-center justify-center text-primary font-bold overflow-hidden mb-4 relative z-10">
              {user.avatar ? (
                <img
                  src={user.avatar.url}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">
                  {user.name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>

            <h3 className="font-extrabold text-lg text-base-content">
              {user.name}
            </h3>
            <p className="text-xs text-base-content/60 font-medium mb-6">
              {user.email}
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-base-300/50 pt-5">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-success">
                  {user.solvedProblems?.length || 0}
                </span>
                <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider mt-1">
                  Solved
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-base-content/80">
                  {user.attemptedProblems?.length || 0}
                </span>
                <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider mt-1">
                  Attempted
                </span>
              </div>
            </div>

            <Link
              to="/profile"
              className="btn btn-primary btn-sm w-full mt-6 rounded-xl shadow-sm"
            >
              View Full Profile
            </Link>
          </div>
        ) : (
          <div className="bg-base-100/50 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-sm p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-extrabold text-lg text-base-content mb-2">
              Track Progress
            </h3>
            <p className="text-sm text-base-content/60 font-medium mb-6 leading-relaxed">
              Create an account to save your solutions and build your profile.
            </p>
            <Link
              to="/login"
              className="btn btn-primary w-full rounded-xl shadow-sm"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Company Filter Card */}
        <div className="bg-base-100/50 backdrop-blur-xl rounded-3xl border border-base-300/50 shadow-sm p-5">
          <div className="flex items-center gap-2 font-extrabold text-base-content mb-5 border-b border-base-300/50 pb-3">
            Top Companies
          </div>
          <div className="flex flex-wrap gap-2">
            {PREFILLED_COMPANIES.map((company) => (
              <button
                key={company}
                onClick={() =>
                  toggleArrayItem(
                    company,
                    selectedCompanies,
                    setSelectedCompanies,
                  )
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedCompanies.includes(company)
                    ? "bg-secondary text-secondary-content border-secondary shadow-sm shadow-secondary/20"
                    : "bg-base-100 border-base-300 text-base-content/70 hover:border-secondary/50 hover:text-secondary"
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemList;

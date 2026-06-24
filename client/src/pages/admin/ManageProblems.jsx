import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../config/api";
import { Plus, Edit2, Trash2, Search, Loader2, Code2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const ManageProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchProblems = async () => {
    try {
      const res = await api.get("/problems?limit=100");
      if (res.data.success) {
        setProblems(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      const res = await api.delete(`/admin/problems/${id}`);
      if (res.data.success) {
        toast.success("Problem deleted");
        setProblems((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete problem");
    }
  };

  const filteredProblems = problems.filter((p) => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const currentProblems = filteredProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-base-content tracking-tight">Problem Database</h1>
          <p className="text-base-content/60 mt-1">Manage and curate coding challenges.</p>
        </div>
        <Link 
          to="/admin/problems/new" 
          className="btn btn-primary rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform border-none flex items-center gap-2 px-6"
        >
          <Plus size={20} /> Create Challenge
        </Link>
      </div>

      <div className="bg-base-100/50 backdrop-blur-xl rounded-3xl shadow-sm border border-base-300/50 overflow-hidden relative">
        <div className="absolute top-[-50%] right-[-10%] w-[50%] h-[100%] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="p-6 border-b border-base-300/50 relative z-10">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search problems by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-base-200/50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base-content backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-base-300/50">
            <AnimatePresence>
              {loading ? (
                <div className="py-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-primary mb-4" size={32} />
                  <p className="text-base-content/60 font-medium">Loading problems...</p>
                </div>
              ) : filteredProblems.length === 0 ? (
                <div className="py-20 text-center text-base-content/60">
                  <Code2 size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No problems found.</p>
                  {searchTerm && <p className="text-sm mt-1">Try adjusting your search query.</p>}
                </div>
              ) : (
                currentProblems.map((problem, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                    key={problem._id}
                    className="p-5 hover:bg-base-200/40 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          #{problem.number}
                        </span>
                        <h3 className="font-bold text-base-content leading-tight">{problem.title}</h3>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        problem.difficulty === "EASY" ? "border-success/30 text-success bg-success/10" :
                        problem.difficulty === "MEDIUM" ? "border-warning/30 text-warning bg-warning/10" :
                        "border-error/30 text-error bg-error/10"
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {problem.companies?.slice(0, 3).map(c => (
                        <span key={c} className="text-[9px] font-semibold tracking-wider uppercase px-2 py-1 rounded-md bg-base-300 text-base-content/70">{c}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-base-300/30">
                      <div className="flex gap-1.5 flex-wrap flex-1 overflow-hidden h-6">
                        {problem.tags?.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-[10px] font-medium bg-base-200 text-base-content/80 px-2 py-0.5 rounded border border-base-300 whitespace-nowrap">{tag}</span>
                        ))}
                      </div>
                      <div className="flex gap-2 ml-2">
                        <Link 
                          to={`/admin/problems/${problem._id}/edit`} 
                          className="p-1.5 rounded-lg text-info bg-info/10 hover:bg-info/20 transition-colors"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(problem._id)}
                          className="p-1.5 rounded-lg text-error bg-error/10 hover:bg-error/20 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Table View */}
          <table className="hidden md:table w-full text-left text-sm">
            <thead className="bg-base-200/30 text-base-content/60 font-medium border-b border-base-300/50">
              <tr>
                <th className="px-6 py-4 w-20 text-center">No.</th>
                <th className="px-6 py-4">Title & Details</th>
                <th className="px-6 py-4 w-32">Difficulty</th>
                <th className="px-6 py-4 hidden md:table-cell">Tags</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300/30">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <Loader2 className="animate-spin mx-auto text-primary mb-4" size={32} />
                      <p className="text-base-content/60 font-medium">Loading problems...</p>
                    </td>
                  </tr>
                ) : filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-base-content/60">
                      <Code2 size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="font-medium">No problems found.</p>
                      {searchTerm && <p className="text-sm mt-1">Try adjusting your search query.</p>}
                    </td>
                  </tr>
                ) : (
                  currentProblems.map((problem, idx) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                      key={problem._id} 
                      className="hover:bg-base-200/40 transition-colors group"
                    >
                      <td className="px-6 py-5 text-center font-bold text-base-content/70 group-hover:text-primary transition-colors">
                        {problem.number}
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-base text-base-content">{problem.title}</div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {problem.companies?.slice(0, 3).map(c => (
                            <span key={c} className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded-md bg-base-300 text-base-content/70">{c}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                          problem.difficulty === "EASY" ? "border-success/30 text-success bg-success/10" :
                          problem.difficulty === "MEDIUM" ? "border-warning/30 text-warning bg-warning/10" :
                          "border-error/30 text-error bg-error/10"
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                          {problem.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-xs font-medium bg-base-200 text-base-content/80 px-2.5 py-1 rounded-lg border border-base-300">{tag}</span>
                          ))}
                          {problem.tags?.length > 2 && (
                            <span className="text-xs font-bold bg-base-300 text-base-content/60 px-2 py-1 rounded-lg">+{problem.tags.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Link 
                            to={`/admin/problems/${problem._id}/edit`} 
                            className="p-2 rounded-xl text-info hover:bg-info/10 transition-colors tooltip tooltip-left"
                            data-tip="Edit"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(problem._id)}
                            className="p-2 rounded-xl text-error hover:bg-error/10 transition-colors tooltip tooltip-left"
                            data-tip="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-base-300/50 bg-base-200/30">
            <span className="text-sm font-medium text-base-content/60">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProblems.length)} of {filteredProblems.length} results
            </span>
            <div className="flex gap-2 items-center">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-sm btn-outline border-base-300 rounded-xl disabled:opacity-50 hover:bg-base-300"
              >
                Previous
              </button>
              <span className="text-sm font-bold text-base-content px-2">Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-sm btn-outline border-base-300 rounded-xl disabled:opacity-50 hover:bg-base-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProblems;

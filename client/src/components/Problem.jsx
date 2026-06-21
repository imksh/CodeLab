import { useState } from "react";
import {
  FileText,
  BookOpen,
  FlaskConical,
  Clock,
  Tag,
  Building2,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../config/api.js";

const Problem = ({ data }) => {
  const [activeTab, setActiveTab] = useState("description");
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  const likeProblem = async () => {
    try {
      if (hasLiked) {
        toast.success("Problem already liked");
        return;
      }
      const res = await api.post(`/problems/${data._id}/like`);
      setHasLiked(true);
      if (hasDisliked) {
        setHasDisliked(false);
      }
      toast.success("Problem liked");
    } catch (error) {
      console.log("Error in like problem", error);
      toast.error("Failed to like problem");
    }
  };

  const dislikeProblem = async () => {
    try {
      if (hasDisliked) {
        toast.success("Problem already disliked");
        return;
      }
      const res = await api.post(`/problems/${data._id}/dislike`);
      setHasDisliked(true);
      if (hasLiked) {
        setHasLiked(false);
      }
      toast.success("Problem disliked");
    } catch (error) {
      console.log("Error in dislike problem", error);
      toast.error("Failed to dislike problem");
    }
  };

  return (
    <div className="h-full flex flex-col bg-base-100 text-base-content">
      {/* Tabs */}
      <div className="flex bg-base-300 border-b border-base-300/30 text-xs font-medium text-base-content overflow-x-auto min-h-[36px]">
        <div
          onClick={() => setActiveTab("description")}
          className={`flex items-center gap-1.5 px-4 py-2 border-b-2 cursor-pointer transition-colors ${activeTab === "description" ? "border-primary text-base-content bg-base-200/50" : "border-transparent hover:bg-base-200/30 hover:text-base-content/80"}`}
        >
          <FileText size={14} className="text-info" />
          Description
        </div>
        <div
          onClick={() => setActiveTab("editorial")}
          className={`flex items-center gap-1.5 px-4 py-2 border-b-2 cursor-pointer transition-colors ${activeTab === "editorial" ? "border-primary text-base-content bg-base-200/50" : "border-transparent hover:bg-base-200/30 hover:text-base-content/80"}`}
        >
          <BookOpen size={14} className="text-violet-500" />
          Editorial
        </div>
        <div
          onClick={() => setActiveTab("solutions")}
          className={`flex items-center gap-1.5 px-4 py-2 border-b-2 cursor-pointer transition-colors ${activeTab === "solutions" ? "border-primary text-base-content bg-base-200/50" : "border-transparent hover:bg-base-200/30 hover:text-base-content/80"}`}
        >
          <FlaskConical size={14} className="text-info" />
          Solutions
        </div>
        <div
          onClick={() => setActiveTab("submissions")}
          className={`flex items-center gap-1.5 px-4 py-2 border-b-2 cursor-pointer transition-colors ${activeTab === "submissions" ? "border-primary text-base-content bg-base-200/50" : "border-transparent hover:bg-base-200/30 hover:text-base-content/80"}`}
        >
          <Clock size={14} className="text-success" />
          Submissions
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 text-sm text-base-content relative">
        {activeTab === "description" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-semibold text-base-content">
                  {data.number} . <span>‎ </span>
                  {data.title}
                </h1>
                {data.solveStatus !== "Unattempted" && (
                  <div className="flex items-center gap-1 text-xs text-base-content/60">
                    {data.solveStatus === "Accepted" ? (
                      <>
                        <span>Accepted</span>
                        <span className="text-emerald-500">✓</span>
                      </>
                    ) : (
                      <>
                        <span>Attempted</span>
                        <span className="text-red-500">✗</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mb-4 mt-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    data.difficulty === "EASY"
                      ? "text-emerald-400 bg-emerald-400/10"
                      : data.difficulty === "MEDIUM"
                        ? "text-yellow-400 bg-yellow-400/10"
                        : "text-red-400 bg-red-400/10"
                  }`}
                >
                  {data.difficulty}
                </span>
                <button
                  onClick={() => toast.success("Comming Soon")}
                  className="text-base-content/60 bg-base-200/5 px-2 py-1 rounded-full text-xs font-medium hover:bg-base-200/50 cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Tag size={12} /> Topics
                </button>
                <button
                  onClick={() => toast.success("Comming Soon")}
                  className="text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full text-xs font-medium hover:bg-orange-400/20 cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Building2 size={12} /> Companies
                </button>
                <button
                  onClick={() => setActiveTab("editorial")}
                  className="text-base-content/60 bg-base-200/5 px-2 py-1 rounded-full text-xs font-medium hover:bg-base-200/50 cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Lightbulb size={12} /> Hint
                </button>
              </div>
            </div>

            <div className="space-y-4 leading-relaxed whitespace-pre-wrap text-[15px]">
              {data.description}
            </div>

            <div className="space-y-6 mt-8">
              {data.examples.map((ex, idx) => (
                <div key={idx}>
                  <p className="font-semibold text-base-content mb-3">
                    Example {idx + 1}:
                  </p>
                  <div className="border-l-2 border-base-content/20 pl-4 py-1">
                    <p className="font-mono text-xs mb-1 whitespace-pre-wrap">
                      <strong className="font-sans text-base-content/80">
                        Input:
                      </strong>
                      {"\n"}
                      {ex.input}
                    </p>
                    <p className="font-mono text-xs mb-1 whitespace-pre-wrap">
                      <strong className="font-sans text-base-content/80">
                        Output:
                      </strong>
                      {"\n"}
                      {ex.output}
                    </p>
                    {ex.explanation && (
                      <p className="font-mono text-xs whitespace-pre-wrap mt-2">
                        <strong className="font-sans text-base-content/80">
                          Explanation:
                        </strong>
                        {"\n"}
                        {ex.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 mb-4">
              <h2 className="font-semibold text-base-content mb-3">
                Constraints:
              </h2>
              <ul className="list-disc ml-5 space-y-2 text-base-content/80">
                {data.constraints.map((c, idx) => (
                  <li key={idx}>
                    <code className="bg-base-200/50 px-1.5 py-0.5 rounded text-base-content/80 text-xs">
                      {c}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "editorial" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Editorial
            </h2>
            <div className="bg-base-200/50 p-5 rounded-lg border border-base-300/30">
              <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-400" /> Hints
              </h3>
              <ul className="list-decimal ml-5 space-y-3 text-base-content/80 mb-8 text-[15px]">
                {data.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>

              <h3 className="font-semibold text-base-content mb-3">Approach</h3>
              <p className="text-base-content/80 mb-6 whitespace-pre-wrap leading-relaxed text-[15px]">
                {data.solution.approach}
              </p>

              <div className="flex gap-4 mt-6">
                <div className="bg-base-100 p-4 rounded-lg border border-base-300/30 flex-1">
                  <span className="text-xs text-base-content/60 block mb-2 font-medium">
                    Time Complexity
                  </span>
                  <code className="text-emerald-400 font-mono text-sm bg-emerald-400/10 px-2 py-1 rounded">
                    {data.solution.timeComplexity}
                  </code>
                </div>
                <div className="bg-base-100 p-4 rounded-lg border border-base-300/30 flex-1">
                  <span className="text-xs text-base-content/60 block mb-2 font-medium">
                    Space Complexity
                  </span>
                  <code className="text-blue-400 font-mono text-sm bg-blue-400/10 px-2 py-1 rounded">
                    {data.solution.spaceComplexity}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "solutions" && (
          <div className="flex flex-col items-center justify-center h-full text-base-content/60 gap-4 pt-20 animate-in fade-in duration-300">
            <div className="bg-base-200/5 p-4 rounded-full">
              <FlaskConical size={32} className="opacity-50" />
            </div>
            <p className="text-center max-w-[250px]">
              Community solutions are currently being processed. Check back
              later!
            </p>
          </div>
        )}

        {activeTab === "submissions" && (
          <div className="flex flex-col items-center justify-center h-full text-base-content/60 gap-4 pt-20 animate-in fade-in duration-300">
            <div className="bg-base-200/5 p-4 rounded-full">
              <Clock size={32} className="opacity-50" />
            </div>
            <p>You haven't submitted any code yet.</p>
          </div>
        )}
      </div>

      {/* Footer / Status */}
      <div className="bg-base-100 border-t border-base-300/30 p-2 flex justify-between items-center text-xs text-base-content/60 min-h-[40px] shrink-0">
        <div className="flex gap-4 px-2">
          <button
            onClick={likeProblem}
            disabled={hasLiked}
            className={`flex items-center gap-1 cursor-pointer hover:text-base-content transition-colors ${hasLiked ? "text-success" : ""}`}
          >
            <ThumbsUp size={14} /> {hasLiked ? data.likes + 1 : data.likes}
          </button>
          <button
            onClick={dislikeProblem}
            disabled={hasDisliked}
            className={`flex items-center gap-1 cursor-pointer hover:text-base-content transition-colors ${hasDisliked ? "text-error" : ""}`}
          >
            <ThumbsDown size={14} />{" "}
            {hasDisliked ? data.dislikes + 1 : data.dislikes}
          </button>
        </div>
        <div className="flex items-center gap-1.5 px-2 text-emerald-500 font-medium">
          {data.totalSubmissions || 0} Submissions
        </div>
      </div>
    </div>
  );
};

export default Problem;

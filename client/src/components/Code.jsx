import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import {
  Code2,
  CheckSquare,
  TerminalSquare,
  RotateCcw,
  Maximize2,
  Maximize,
  ChevronUp,
  ChevronDown,
  WrapText,
  Loader2,
  Circle,
} from "lucide-react";
import useUiStore from "../store/useUiStore";
import ConfirmModal from "./modals/ConfirmModal";
import toast from "react-hot-toast";
import api from "../config/api";

const Code = ({ data, userSubmits }) => {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(data?.starterCode?.java || "");
  const [activeTab, setActiveTab] = useState("testcase");
  const [executionResult, setExecutionResult] = useState(null);
  const [selectedResultCase, setSelectedResultCase] = useState(0);
  const [showBottomPanel, setShowBottomPanel] = useState(true);
  const { theme } = useUiStore();
  const [wordWrap, setWordWrap] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [example, setExample] = useState(data.examples[0]);
  const { maximizeView, toggleMaximizeView } = useUiStore();
  const [maximize, setMazimize] = useState("");
  const [topHeight, setTopHeight] = useState(65);
  const [isDragging, setIsDragging] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
      if (newHeight > 20 && newHeight < 80) setTopHeight(newHeight);
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "row-resize";
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

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(data?.starterCode?.[lang] || "");
  };

  const runCode = async () => {
    setIsRunning(true);
    setExecutionResult(null);
    try {
      const res = await api.post("/submissions/run", {
        problemId: data._id,
        language,
        code,
      });
      setExecutionResult({ ...res.data.executionDetails, isSubmit: false });
      if (
        res.data.executionDetails.results &&
        res.data.executionDetails.results.length > 0
      ) {
        const failedIndex = res.data.executionDetails.results.findIndex(
          (r) => r.status !== "Accepted",
        );
        setSelectedResultCase(failedIndex !== -1 ? failedIndex : 0);
      }
    } catch (error) {
      toast.error("Execution failed");
      setExecutionResult({
        status: "Error",
        error: error.response?.data?.message || error.message,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    setIsSubmitting(true);
    setExecutionResult(null);
    try {
      const res = await api.post("/submissions", {
        problemId: data._id,
        language,
        code,
      });
      setExecutionResult({ ...res.data.executionDetails, isSubmit: true });
      userSubmits(res.data.executionDetails.status);
      if (
        res.data.executionDetails.results &&
        res.data.executionDetails.results.length > 0
      ) {
        const failedIndex = res.data.executionDetails.results.findIndex(
          (r) => r.status !== "Accepted",
        );
        setSelectedResultCase(failedIndex !== -1 ? failedIndex : 0);
      }

      if (res.data.executionDetails?.status === "Accepted") {
        toast.success("Solution Accepted!");
      } else {
        toast.error("Solution failed on some test cases.");
      }
    } catch (error) {
      toast.error("Submission failed");
      setExecutionResult({
        status: "Error",
        error: error.response?.data?.message || error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="h-full flex flex-col gap-1.5 overflow-hidden"
      >
        {/* Editor Panel */}
        <motion.div
          animate={{
            flex: maximizeView && maximize === "bottom" ? 0 : undefined,
            height: maximizeView
              ? maximize === "bottom"
                ? "0%"
                : "100%"
              : showBottomPanel
                ? `${topHeight}%`
                : "100%",
            opacity: maximizeView && maximize === "bottom" ? 0 : 1,
          }}
          transition={{ duration: isDragging ? 0 : 0.3, ease: "easeInOut" }}
          className={`flex flex-col bg-base-100 rounded-lg border border-base-300/30 overflow-hidden ${
            maximizeView && maximize === "bottom"
              ? "border-none !min-h-0 pointer-events-none"
              : "min-h-[200px]"
          }`}
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between bg-base-300 border-b border-base-300/30 text-xs font-medium text-base-content/60 px-3 min-h-[36px]">
            <div className="flex items-center gap-1.5 h-full text-base-content">
              <Code2 size={14} className="text-emerald-400" />
              Code
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  title="Select Language"
                  className="bg-transparent text-base-content/80 outline-none hover:text-base-content cursor-pointer px-1 py-1 rounded hover:bg-white/10 text-xs"
                >
                  <option value="cpp" className="bg-base-100">
                    C++
                  </option>
                  <option value="java" className="bg-base-100">
                    Java
                  </option>
                  <option value="python" className="bg-base-100">
                    Python
                  </option>
                  <option value="javascript" className="bg-base-100">
                    JavaScript
                  </option>
                </select>
              </div>
              <div className="flex items-center gap-2.5 text-base-content/60 border-l border-base-300/30 pl-3">
                <button
                  onClick={() => {
                    setMazimize("top");
                    toggleMaximizeView();
                  }}
                  title="Maximize Editor"
                  className={`cursor-pointer hover:text-primary transition-colors ${
                    maximizeView && maximize === "top"
                      ? "text-base-content"
                      : "text-base-content/60"
                  }`}
                >
                  <Maximize size={14} />
                </button>
                <button
                  onClick={() => {
                    setWordWrap(!wordWrap);
                    toast.success(
                      `${wordWrap ? `WordWrap Disabled` : `WordWrap Enabled`}`,
                    );
                  }}
                  title="Word Wrap"
                  className={`cursor-pointer hover:text-primary transition-colors ${
                    wordWrap ? "text-success" : "text-base-content/60"
                  }`}
                >
                  <WrapText size={14} />
                </button>
                {/* <span className="cursor-pointer hover:text-base-content transition-colors">
                  <Settings size={14} />
                </span> */}
                <button
                  onClick={() => setIsClearModalOpen(true)}
                  title="Clear Code"
                  className="cursor-pointer hover:text-error transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  title="Fullscreen"
                  className="cursor-pointer hover:text-base-content transition-colors"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className={`flex-1 flex flex-col min-h-0 `}>
            <div className="flex-1 min-h-0 relative">
              <Editor
                height="100%"
                language={language}
                value={code}
                theme={theme === "dark" ? "vs-dark" : "vs"}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  automaticLayout: true,
                  fontSize: 14,
                  wordWrap: wordWrap ? "on" : "off",
                  fontFamily:
                    "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
                  scrollBeyondLastLine: false,
                  scrollbar: {
                    verticalScrollbarSize: 6,
                    horizontalScrollbarSize: 6,
                  },
                  padding: { top: 16 },
                  renderLineHighlight: "none",
                  hideCursorInOverviewRuler: true,
                  overviewRulerBorder: false,
                  quickSuggestions: true,
                  suggestOnTriggerCharacters: true,
                  acceptSuggestionOnEnter: "on",
                  tabCompletion: "on",
                  wordBasedSuggestions: "currentDocument",
                  snippetSuggestions: "top",
                }}
              />
            </div>
            <div
              className={`flex gap-3 shrink-0 justify-end px-4 py-2 border-t border-base-300/50 bg-base-200/20`}
            >
              <button
                onClick={() => {
                  setActiveTab("result");
                  runCode();
                }}
                disabled={isRunning || isSubmitting}
                className="btn btn-sm disabled:opacity-50"
              >
                {isRunning ? "Running..." : "Run"}
              </button>
              <button
                onClick={() => {
                  setActiveTab("result");
                  submitCode();
                }}
                disabled={isRunning || isSubmitting}
                className="btn btn-sm btn-success text-white disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Resizer */}
        {showBottomPanel && !maximizeView && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            className="h-1.5 cursor-row-resize rounded-full bg-transparent hover:bg-white/20 active:bg-white/30 transition-colors z-10 shrink-0 flex items-center justify-center my-[-4px]"
          >
            <div className="h-0.5 w-8 bg-base-300 rounded-full pointer-events-none" />
          </div>
        )}

        {/* Testcase / Console Panel */}
        <motion.div
          animate={{
            height: maximizeView
              ? maximize === "bottom"
                ? "100%"
                : "0%"
              : showBottomPanel
                ? `${100 - topHeight}%`
                : 36,
            opacity: maximizeView && maximize === "top" ? 0 : 1,
          }}
          transition={{ duration: isDragging ? 0 : 0.3, ease: "easeInOut" }}
          className={`flex flex-col bg-base-100 rounded-lg border border-base-300/30 overflow-hidden relative ${
            maximizeView && maximize === "top"
              ? "border-none !min-h-0 pointer-events-none"
              : "min-h-[36px]"
          }`}
        >
          {/* Tabs */}
          <div className="flex justify-between items-center bg-base-300 border-b border-base-300/30 text-xs font-medium text-base-content/60 min-h-[36px] group">
            <div className="flex h-full">
              <div
                className={`flex items-center gap-1.5 px-4 h-full cursor-pointer border-b-2 border-b-base-300 hover:text-base-content transition-colors ${activeTab === "testcase" ? "text-base-content  border-b-secondary" : ""}`}
                onClick={() => setActiveTab("testcase")}
              >
                <CheckSquare size={14} className="text-emerald-500" />
                Testcase
              </div>
              <div
                className={`flex items-center gap-1.5 px-4 h-full cursor-pointer border-b-2 border-b-base-300 hover:text-base-content transition-colors ${activeTab === "result" ? "text-base-content  border-b-secondary" : ""}`}
                onClick={() => setActiveTab("result")}
              >
                <TerminalSquare size={14} className="text-emerald-500" />
                Test Result
              </div>
            </div>
            <div className=" h-full gap-2 flex md:hidden group-hover:flex px-4 ">
              <button
                onClick={() => {
                  setMazimize("bottom");
                  toggleMaximizeView();
                }}
                className="text-base-content p-1 my-auto h-fit hover:bg-white/10 rounded"
              >
                <Maximize size={14} />
              </button>
              <button
                onClick={() => setShowBottomPanel((p) => !p)}
                className="p-1 my-auto h-fit hover:bg-white/10 rounded text-base-content"
              >
                {showBottomPanel ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            className={`flex-1 overflow-y-auto p-4 transition-opacity duration-300 ${
              showBottomPanel ? "opacity-100" : "opacity-0"
            }`}
          >
            {activeTab === "testcase" ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {data.examples.map((ex, index) => (
                    <button
                      onClick={() => setExample(ex)}
                      key={index}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                        example === ex
                          ? "bg-secondary/70 text-secondary-content  border-primary/30"
                          : "bg-base-300 text-base-content/60 border-base-300 hover:bg-base-200/50"
                      }`}
                    >
                      Case {index + 1}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-base-content/60 mb-1.5">
                      Input
                    </div>
                    <div className="bg-base-200 rounded-lg px-4 py-2.5 text-sm text-base-content/80 font-mono border border-base-300/30">
                      <pre>{example.input}</pre>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-base-content/60 mb-1.5">
                      Output
                    </div>
                    <div className="bg-base-200 rounded-lg px-4 py-2.5 text-sm text-base-content/80 font-mono border border-base-300/30">
                      <pre>{example.output}</pre>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {isRunning || isSubmitting ? (
                  <div className="flex flex-col items-center justify-center h-full text-base-content/60 gap-3 mt-8">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="font-medium text-sm">
                      {isRunning ? "Running test cases..." : "Submitting..."}
                    </span>
                    <span className="text-xs text-base-content/40">
                      (Waiting for execution engine)
                    </span>
                  </div>
                ) : executionResult ? (
                  <div className="space-y-6">
                    <h3
                      className={`text-xl font-bold ${
                        executionResult.status === "Accepted"
                          ? "text-success"
                          : executionResult.status === "Error"
                            ? "text-error"
                            : "text-error"
                      }`}
                    >
                      {executionResult.status}
                    </h3>

                    {executionResult.isSubmit && executionResult.status === "Accepted" ? (
                      <div className="bg-success/10 text-success p-6 rounded-xl border border-success/20 text-center">
                        <div className="text-3xl mb-2">🎉</div>
                        <h4 className="text-xl font-bold mb-2">Submission Accepted!</h4>
                        <div className="flex justify-center gap-6 mt-4">
                          <div className="text-center">
                            <div className="text-xs text-success/70 uppercase font-semibold">Runtime</div>
                            <div className="text-lg font-mono">{executionResult.executionTime} ms</div>
                          </div>
                        </div>
                      </div>
                    ) : executionResult.status !== "Error" &&
                      executionResult.results &&
                      executionResult.results.length > 0 && (
                        <>
                          <div className="flex gap-2 flex-wrap">
                            {executionResult.results.map((res, idx) => (
                              <button
                                key={idx}
                                onClick={() => setSelectedResultCase(idx)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border flex items-center gap-2 ${
                                  selectedResultCase === idx
                                    ? "bg-base-200 text-base-content border-base-content/20"
                                    : "bg-transparent text-base-content/60 border-transparent hover:bg-base-200/50"
                                }`}
                              >
                                {res.status === "Accepted" ? (
                                  <Circle
                                    size={10}
                                    className="fill-success text-success"
                                  />
                                ) : (
                                  <Circle
                                    size={10}
                                    className="fill-error text-error"
                                  />
                                )}
                                Case {idx + 1}
                              </button>
                            ))}
                          </div>

                          {/* Selected Test Case Details */}
                          {executionResult.results[selectedResultCase] && (
                            <div className="space-y-4">
                              <div>
                                <div className="text-xs text-base-content/60 mb-1.5">
                                  Input
                                </div>
                                <div className="bg-base-200/50 rounded-lg px-4 py-2.5 text-sm text-base-content/80 font-mono border border-base-300/30 whitespace-pre-wrap">
                                  {
                                    executionResult.results[selectedResultCase]
                                      .input
                                  }
                                </div>
                              </div>

                              {executionResult.results[selectedResultCase]
                                .stderr ? (
                                <div>
                                  <div className="text-xs text-error mb-1.5">
                                    Runtime Error
                                  </div>
                                  <div className="bg-error/10 text-error rounded-lg px-4 py-2.5 text-sm font-mono border border-error/20 whitespace-pre-wrap overflow-x-auto">
                                    {
                                      executionResult.results[
                                        selectedResultCase
                                      ].stderr
                                    }
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div>
                                    <div className="text-xs text-base-content/60 mb-1.5">
                                      Output
                                    </div>
                                    <div
                                      className={`rounded-lg px-4 py-2.5 text-sm font-mono border whitespace-pre-wrap ${
                                        executionResult.results[
                                          selectedResultCase
                                        ].status === "Accepted"
                                          ? "bg-base-200/50 text-base-content/80 border-base-300/30"
                                          : "bg-error/5 text-error border-error/20"
                                      }`}
                                    >
                                      {
                                        executionResult.results[
                                          selectedResultCase
                                        ].actualOutput
                                      }
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-base-content/60 mb-1.5">
                                      Expected
                                    </div>
                                    <div className="bg-base-200/50 rounded-lg px-4 py-2.5 text-sm text-base-content/80 font-mono border border-base-300/30 whitespace-pre-wrap">
                                      {
                                        executionResult.results[
                                          selectedResultCase
                                        ].expectedOutput
                                      }
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </>
                      )}

                    {executionResult.status === "Error" && (
                      <div className="bg-error/10 text-error rounded-lg px-4 py-2.5 text-sm font-mono border border-error/20 whitespace-pre-wrap overflow-x-auto">
                        {executionResult.error}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm font-medium text-base-content/60 whitespace-pre-wrap pt-4 px-2">
                    You must run your code first.
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <ConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={() => {
          setCode(data?.starterCode?.[language] || "");
          setIsClearModalOpen(false);
        }}
        title="Clear Code"
        message="Are you sure you want to clear all the code?"
        confirmText="Clear"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default Code;

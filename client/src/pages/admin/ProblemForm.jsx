import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import { Loader2, UploadCloud, X, Plus, Save, ArrowLeft, Layers, Settings, Code, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const PREFILLED_COMPANIES = ["Google", "Facebook", "Amazon", "Microsoft", "Apple", "Netflix", "Uber"];
const PREFILLED_TAGS = ["Array", "String", "Hash Table", "Dynamic Programming", "Math", "Sorting", "Greedy"];
const PREFILLED_TOPICS = ["Algorithms", "Data Structures", "Database", "Shell", "Concurrency"];

const ProblemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    number: "",
    title: "",
    description: "",
    difficulty: "EASY",
    timeLimit: 2,
    memoryLimit: 256,
    tags: [],
    companies: [],
    topics: [],
    solutionCode: "",
    attachmentType: "pdf", // url, video, pdf, image, zip
    attachmentUrl: ""
  });

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // For multi-select inputs
  const [tagInput, setTagInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [topicInput, setTopicInput] = useState("");

  useEffect(() => {
    if (isEdit) {
      const fetchProblem = async () => {
        try {
          const res = await api.get(`/problems/${id}`);
          if (res.data.success) {
            const data = res.data.data;
            setFormData({
              ...data,
              tags: data.tags || [],
              companies: data.companies || [],
              topics: data.topics || [],
              solutionCode: data.solutionCode || "",
              attachmentType: data.attachment?.type || "pdf",
              attachmentUrl: data.attachment?.url || ""
            });
          }
        } catch (error) {
          toast.error("Failed to fetch problem details");
          navigate("/admin/problems");
        } finally {
          setLoading(false);
        }
      };
      fetchProblem();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayAdd = (field, value, setter) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    }
    setter("");
  };

  const handleArrayRemove = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((item) => item !== value) }));
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (["tags", "companies", "topics"].includes(key)) {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === "testCases" || key === "examples" || key === "hints" || key === "starterCode" || key === "driverCode" || key === "solution") {
          submitData.append(key, JSON.stringify(formData[key] || []));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      if (file && formData.attachmentType !== 'url') {
        submitData.append("attachment", file);
      }

      let res;
      if (isEdit) {
        res = await api.put(`/admin/problems/${id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/admin/problems", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        toast.success(`Problem ${isEdit ? "updated" : "created"} successfully!`);
        navigate("/admin/problems");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save problem");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  const SectionCard = ({ title, icon: Icon, children }) => (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-base-100/50 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-base-300/50 relative overflow-hidden"
    >
      <div className="flex items-center gap-3 border-b border-base-300/50 pb-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon size={20} />
        </div>
        <h2 className="text-xl font-bold text-base-content">{title}</h2>
      </div>
      {children}
    </motion.section>
  );

  return (
    <div className="space-y-8">
      {isEdit && (
        <div className="flex items-center gap-2 text-sm font-medium text-base-content/60 mb-1">
          <button onClick={() => navigate("/admin/problems")} className="flex items-center gap-1.5 hover:text-primary ">
            {/* <ArrowLeft size={16} />  */}
            Problems
          </button>
          <span className="opacity-50">/</span>
          <span className="text-base-content/90 truncate max-w-[200px] sm:max-w-xs">{formData.title || "Loading..."}</span>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-base-content tracking-tight">
            {isEdit ? "Edit Challenge" : "Create Challenge"}
          </h1>
          <p className="text-base-content/60 mt-1">
            {isEdit ? "Update and modify the details of this problem." : "Design a new coding problem for the community."}
          </p>
        </div>
        <button onClick={() => navigate("/admin/problems")} className="btn btn-outline btn-sm  hover:bg-error hover:text-white">Cancel</button>
      </div>

      <div className="bg-base-100/50 backdrop-blur-xl rounded-3xl shadow-sm border border-base-300/50 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Core Details Section */}
          <div>
            <h3 className="text-lg font-bold text-base-content mb-6 flex items-center gap-2 border-b border-base-300/50 pb-3">
              <FileText size={20} className="text-primary" /> Core Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold text-base-content/80">Problem Number</span></label>
                <input type="number" name="number" value={formData.number} onChange={handleChange} required className="w-full px-4 py-3 bg-base-200/50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-bold text-base-content/80">Title</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-base-200/50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text font-bold text-base-content/80">Description (Markdown)</span></label>
                <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full px-4 py-3 bg-base-200/50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all h-40 resize-y font-mono text-sm"></textarea>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-bold text-base-content/80">Difficulty</span></label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full px-4 py-3 bg-base-200/50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer">
                  <option value="EASY">🟢 EASY</option>
                  <option value="MEDIUM">🟡 MEDIUM</option>
                  <option value="HARD">🔴 HARD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categorization Section */}
          <div>
            <h3 className="text-lg font-bold text-base-content mb-6 flex items-center gap-2 border-b border-base-300/50 pb-3">
              <Layers size={20} className="text-secondary" /> Categorization
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tags */}
              <div className="space-y-3">
                <label className="label pb-0"><span className="label-text font-bold text-base-content/80">Tags</span></label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium text-sm">
                      {tag} <X size={14} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => handleArrayRemove("tags", tag)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd("tags", tagInput, setTagInput))} className="w-full px-4 py-2.5 bg-base-200/50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm" placeholder="Add tag..." />
                  <button type="button" onClick={() => handleArrayAdd("tags", tagInput, setTagInput)} className="p-2.5 rounded-xl bg-primary text-primary-content hover:bg-primary/90 transition-colors"><Plus size={20} /></button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {PREFILLED_TAGS.map(t => !formData.tags.includes(t) && (
                    <button type="button" key={t} onClick={() => handleArrayAdd("tags", t, setTagInput)} className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-base-300 hover:border-primary/50 hover:bg-primary/5 text-base-content/60 hover:text-primary transition-all">{t}</button>
                  ))}
                </div>
              </div>

              {/* Companies */}
              <div className="space-y-3">
                <label className="label pb-0"><span className="label-text font-bold text-base-content/80">Companies</span></label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.companies.map((comp) => (
                    <span key={comp} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary font-medium text-sm">
                      {comp} <X size={14} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => handleArrayRemove("companies", comp)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={companyInput} onChange={(e) => setCompanyInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd("companies", companyInput, setCompanyInput))} className="w-full px-4 py-2.5 bg-base-200/50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-sm" placeholder="Add company..." />
                  <button type="button" onClick={() => handleArrayAdd("companies", companyInput, setCompanyInput)} className="p-2.5 rounded-xl bg-secondary text-secondary-content hover:bg-secondary/90 transition-colors"><Plus size={20} /></button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {PREFILLED_COMPANIES.map(c => !formData.companies.includes(c) && (
                    <button type="button" key={c} onClick={() => handleArrayAdd("companies", c, setCompanyInput)} className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-base-300 hover:border-secondary/50 hover:bg-secondary/5 text-base-content/60 hover:text-secondary transition-all">{c}</button>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className="space-y-3">
                <label className="label pb-0"><span className="label-text font-bold text-base-content/80">Topics</span></label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.topics.map((topic) => (
                    <span key={topic} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent font-medium text-sm">
                      {topic} <X size={14} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => handleArrayRemove("topics", topic)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={topicInput} onChange={(e) => setTopicInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd("topics", topicInput, setTopicInput))} className="w-full px-4 py-2.5 bg-base-200/50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm" placeholder="Add topic..." />
                  <button type="button" onClick={() => handleArrayAdd("topics", topicInput, setTopicInput)} className="p-2.5 rounded-xl bg-accent text-accent-content hover:bg-accent/90 transition-colors"><Plus size={20} /></button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {PREFILLED_TOPICS.map(t => !formData.topics.includes(t) && (
                    <button type="button" key={t} onClick={() => handleArrayAdd("topics", t, setTopicInput)} className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-base-300 hover:border-accent/50 hover:bg-accent/5 text-base-content/60 hover:text-accent transition-all">{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Solutions & Assets */}
          <div>
            <h3 className="text-lg font-bold text-base-content mb-6 flex items-center gap-2 border-b border-base-300/50 pb-3">
              <Code size={20} className="text-accent" /> Solutions & Assets
            </h3>
            
            <div className="form-control mb-8">
              <label className="label"><span className="label-text font-bold text-base-content/80">Solution Code</span></label>
              <textarea name="solutionCode" value={formData.solutionCode} onChange={handleChange} className="w-full px-4 py-3 bg-base-200/50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all h-48 font-mono text-sm" placeholder="Paste optimal solution code here..."></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold text-base-content/80">Attachment Type</span></label>
                <select name="attachmentType" value={formData.attachmentType} onChange={handleChange} className="w-full px-4 py-3 bg-base-200/50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all appearance-none cursor-pointer">
                  <option value="pdf">📄 PDF Document</option>
                  <option value="video">🎥 Video Solution</option>
                  <option value="image">🖼️ Image</option>
                  <option value="zip">🗜️ ZIP Archive</option>
                  <option value="url">🔗 External URL</option>
                </select>
              </div>

              {formData.attachmentType === 'url' ? (
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-base-content/80">URL</span></label>
                  <input type="url" name="attachmentUrl" value={formData.attachmentUrl} onChange={handleChange} className="w-full px-4 py-3 bg-base-200/50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="https://..." />
                </div>
              ) : (
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-base-content/80">Upload File</span></label>
                  <div 
                    className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${dragActive ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-base-300 hover:border-primary/50 bg-base-200/30 hover:bg-base-200/50'}`}
                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFile(e.target.files[0])} accept={formData.attachmentType === 'video' ? 'video/*' : formData.attachmentType === 'image' ? 'image/*' : formData.attachmentType === 'pdf' ? '.pdf' : '*/*'} />
                    
                    <motion.div animate={dragActive ? { y: -5 } : { y: 0 }}>
                      <UploadCloud className={`mx-auto mb-3 transition-colors duration-300 ${dragActive ? 'text-primary' : 'text-base-content/40'}`} size={40} />
                    </motion.div>
                    
                    {file ? (
                      <div>
                        <div className="font-bold text-primary break-all">{file.name}</div>
                        <div className="text-sm text-base-content/50 mt-1">{(file.size/1024/1024).toFixed(2)} MB</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-base-content/80 mb-1">
                          <span className="text-primary">Click to upload</span> or drag and drop
                        </div>
                        <div className="text-xs text-base-content/50 font-medium tracking-wide uppercase">
                          Supported: {formData.attachmentType} (Max: 100MB)
                        </div>
                      </div>
                    )}
                  </div>
                  {isEdit && formData.attachmentUrl && !file && (
                    <div className="text-sm mt-3 font-medium flex items-center justify-between px-4 py-2 bg-base-200/50 rounded-lg border border-base-300">
                      <span className="text-base-content/60">Current file:</span>
                      <a href={formData.attachmentUrl} target="_blank" rel="noreferrer" className="text-info hover:underline flex items-center gap-1"><FileText size={16}/> View Asset</a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Bar */}
          <div className="pt-6 mt-6 border-t border-base-300/50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-sm text-base-content/50 font-medium">Please review all details before publishing.</p>
            <div className="flex gap-4 w-full sm:w-auto">
              <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost rounded-xl flex-1 sm:flex-none hover:bg-base-200">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary rounded-xl px-8 shadow-sm hover:-translate-y-0.5 transition-transform flex-1 sm:flex-none">
                {submitting ? <><Loader2 className="animate-spin" size={20} /> Saving...</> : <><Save size={20} /> {isEdit ? "Update Challenge" : "Publish Challenge"}</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProblemForm;

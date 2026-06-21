import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Activity,
  Edit2,
  Camera,
  X,
  Check,
  Loader2,
  Award,
  CheckCircle2,
  Clock3,
  FileCode2,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import api from "../config/api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Profile = () => {
  const { user, updateProfile, isUpdatingProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [stats, setStats] = useState(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/auth/stats");
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchStats();
    }
  }, [user]);

  if (!user) return null;

  const handleEditToggle = () => {
    if (!isEditing) {
      setFormData({ name: user.name, phone: user.phone });
      setAvatarPreview(null);
      setSelectedFile(null);
    }
    setIsEditing(!isEditing);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    if (selectedFile) {
      data.append("avatar", selectedFile);
    }

    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return "badge badge-success";
      case "Wrong Answer":
        return "badge badge-error";
      case "Time Limit Exceeded":
        return "badge badge-warning";
      case "Runtime Error":
        return "badge badge-error";
      default:
        return "badge badge-neutral";
    }
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-base-content tracking-tight">
              Your Profile
            </h1>
            <p className="text-base-content/60 mt-1">
              Manage your personal information and stats
            </p>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Avatar & Basic Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 "
        >
          <div className="bg-base-100 rounded-3xl p-6 border border-base-300/50 shadow-sm flex flex-col items-center text-center relative overflow-hidden group">
            {/* Background abstract decoration */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent"></div>

            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-base-100 shadow-md group-hover:shadow-lg transition-all z-10">
              {avatarPreview || user.avatar?.url ? (
                <img
                  src={avatarPreview || user.avatar.url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center">
                  <User size={48} />
                </div>
              )}

              {isEditing && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera size={24} className="text-white mb-1" />
                  <span className="text-xs text-white font-medium">Change</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>

            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input input-bordered w-full text-center font-bold text-xl mb-2"
                placeholder="Your Name"
              />
            ) : (
              <h2 className="text-2xl font-bold text-base-content z-10">
                {user.name}
              </h2>
            )}

            <div className="flex items-center gap-1.5 mt-2 text-sm font-medium text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full z-10">
              <Shield size={14} />
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
          <div className="flex justify-center w-full mt-12">
            {!isEditing ? (
              <button
                onClick={handleEditToggle}
                className="btn btn-outline border-primary/50 hover:bg-base-content/10 gap-2 rounded-xl text-base-content"
              >
                <Edit2 size={16} className="" /> Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEditToggle}
                  className="btn btn-ghost text-base-content/70 hover:bg-base-content/10 gap-2 rounded-xl"
                  disabled={isUpdatingProfile}
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary gap-2 rounded-xl"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  Save
                </button>
              </div>
            )}
          </div>
          </div>

        </motion.div>

        {/* Right Col: Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 space-y-6"
        >
          <div className="bg-base-100 rounded-3xl p-6 border border-base-300/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>

            <h3 className="text-lg font-bold text-base-content mb-6 flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              Account Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-base-200/50 rounded-2xl border border-base-300/30 hover:border-base-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-base-100 shadow-sm flex items-center justify-center text-base-content/70 mr-4">
                  <Mail size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-1">
                    Email Address
                  </p>
                  <p className="text-base font-semibold text-base-content">
                    {user.email}
                  </p>
                </div>
                {isEditing && (
                  <span className="text-xs text-base-content/40 bg-base-300 px-2 py-1 rounded-md">
                    Locked
                  </span>
                )}
              </div>

              <div className="flex items-center p-4 bg-base-200/50 rounded-2xl border border-base-300/30 hover:border-base-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-base-100 shadow-sm flex items-center justify-center text-base-content/70 mr-4">
                  <Phone size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-1">
                    Phone Number
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="input input-sm input-bordered w-full max-w-xs"
                      placeholder="Phone number"
                    />
                  ) : (
                    <p className="text-base font-semibold text-base-content">
                      {user.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center p-4 bg-base-200/50 rounded-2xl border border-base-300/30 hover:border-base-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-base-100 shadow-sm flex items-center justify-center text-base-content/70 mr-4">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-1">
                    Joined
                  </p>
                  <p className="text-base font-semibold text-base-content">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-base-100 rounded-3xl p-6 border border-base-300/50 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-bold text-base-content mb-6 flex items-center gap-2">
              <Award size={20} className="text-primary" />
              Coding Stats
            </h3>

            {stats ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="stat bg-base-200/50 rounded-2xl border border-base-300/30">
                    <div className="stat-title">Accepted</div>
                    <div className="stat-value text-success text-3xl">
                      {stats.acceptedSubmissions}
                    </div>
                  </div>

                  {/* <div className="stat bg-base-200/50 rounded-2xl border border-base-300/30">
                    <div className="stat-title">Attempted</div>
                    <div className="stat-value text-info text-3xl">
                      {stats.attemptedSubmissions}
                    </div>
                  </div> */}

                  <div className="stat bg-base-200/50 rounded-2xl border border-base-300/30">
                    <div className="stat-title">Submissions</div>
                    <div className="stat-value text-3xl">
                      {stats.totalSubmissions}
                    </div>
                  </div>

                  <div className="stat bg-base-200/50 rounded-2xl border border-base-300/30">
                    <div className="stat-title">Acceptance</div>
                    <div className="stat-value text-warning text-3xl">
                      {stats.acceptanceRate}%
                    </div>
                  </div>
                </div>

                <div className="h-64 w-full bg-base-200/30 rounded-2xl border border-base-300/30 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Easy",
                            value: stats.difficultyBreakdown.easy,
                            color: "#10b981",
                          },
                          {
                            name: "Medium",
                            value: stats.difficultyBreakdown.medium,
                            color: "#f59e0b",
                          },
                          {
                            name: "Hard",
                            value: stats.difficultyBreakdown.hard,
                            color: "#ef4444",
                          },
                        ].filter((d) => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          {
                            name: "Easy",
                            value: stats.difficultyBreakdown.easy,
                            color: "#10b981",
                          },
                          {
                            name: "Medium",
                            value: stats.difficultyBreakdown.medium,
                            color: "#f59e0b",
                          },
                          {
                            name: "Hard",
                            value: stats.difficultyBreakdown.hard,
                            color: "#ef4444",
                          },
                        ]
                          .filter((d) => d.value > 0)
                          .map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                          borderRadius: "0.5rem",
                          color: "#fff",
                        }}
                        itemStyle={{ color: "#fff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-sm">
                        Easy ({stats.difficultyBreakdown.easy})
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-sm">
                        Medium ({stats.difficultyBreakdown.medium})
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm">
                        Hard ({stats.difficultyBreakdown.hard})
                      </span>
                    </div>
                  </div>
                  {stats.totalSolved === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-sm font-medium text-base-content/50 mt-20">
                        No solved problems yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-center p-8">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-100 rounded-3xl p-6 border border-base-300/50 shadow-sm"
          >
            <h3 className="text-lg font-bold text-base-content mb-6 flex items-center gap-2">
              <FileCode2 size={20} className="text-primary" />
              Recent Submissions
            </h3>

            {!stats?.recentSubmissions?.length ? (
              <div className="text-center py-12">
                <p className="text-base-content/50">No submissions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 bg-base-200/30 hover:bg-base-200/50 rounded-2xl border border-base-300/30 transition-colors"
                  >
                    <div className="w-full">
                      <div className="flex items-center gap-3 mb-1  w-full">
                        <span className="font-bold text-base-content">
                          {submission.title}
                        </span>
                        <span
                          className={`text-xs badge-xs ml-auto ${getStatusBadge(submission.status)}`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-base-content/50">
                        <span className="font-mono bg-base-300 px-1.5 py-0.5 rounded-md text-base-content/70">
                          #{submission.problemNumber}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <Clock3 size={12} />
                          {formatRelativeTime(submission.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

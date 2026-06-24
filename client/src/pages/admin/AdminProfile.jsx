import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit2,
  Camera,
  X,
  Check,
  Loader2,
  Activity
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

const AdminProfile = () => {
  const { user, updateProfile, isUpdatingProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!user) return null;

  const handleEditToggle = () => {
    if (!isEditing) {
      setFormData({ name: user.name, phone: user.phone || "" });
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-base-content tracking-tight">Admin Profile</h1>
        <p className="text-base-content/60 mt-1">Manage your administrative account details and settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* Left Col: Avatar & Basic Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 relative z-10"
        >
          <div className="bg-base-100/50 backdrop-blur-xl rounded-3xl p-8 border border-base-300/50 shadow-sm flex flex-col items-center text-center overflow-hidden group">
            
            <div className="relative w-36 h-36 rounded-full overflow-hidden mb-6 border-4 border-base-100 shadow-xl group-hover:shadow-2xl transition-all z-10">
              {avatarPreview || user.avatar?.url ? (
                <img
                  src={avatarPreview || user.avatar.url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center">
                  <User size={60} />
                </div>
              )}

              {isEditing && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera size={28} className="text-white mb-2" />
                  <span className="text-sm text-white font-medium">Change Photo</span>
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
                className="w-full px-4 py-2 bg-base-200/50 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-center font-bold text-xl mb-4"
                placeholder="Your Name"
              />
            ) : (
              <h2 className="text-2xl font-black text-base-content z-10 mb-2">
                {user.name}
              </h2>
            )}

            <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-primary bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full z-10 shadow-inner">
              <Shield size={14} />
              {user.role.toUpperCase()}
            </div>
            
            <div className="flex justify-center w-full mt-8">
              {!isEditing ? (
                <button
                  onClick={handleEditToggle}
                  className="w-full py-3 rounded-xl bg-base-200 hover:bg-base-300 text-base-content font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Edit2 size={18} /> Edit Profile
                </button>
              ) : (
                <div className="flex w-full gap-3">
                  <button
                    onClick={handleEditToggle}
                    className="flex-1 py-3 rounded-xl bg-base-200 hover:bg-base-300 text-base-content font-bold flex items-center justify-center gap-2 transition-colors"
                    disabled={isUpdatingProfile}
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-focus text-primary-content font-bold flex items-center justify-center gap-2 transition-transform shadow-lg hover:-translate-y-0.5"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Check size={18} />
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
          className="md:col-span-2 space-y-6 relative z-10"
        >
          <div className="bg-base-100/50 backdrop-blur-xl rounded-3xl p-8 border border-base-300/50 shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-bold text-base-content mb-8 flex items-center gap-3">
              <Activity size={24} className="text-secondary" />
              Account Details
            </h3>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center p-5 bg-base-200/50 rounded-2xl border border-base-300/30 hover:border-base-300 transition-colors shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-base-100 shadow-sm flex items-center justify-center text-base-content/70 mr-5">
                  <Mail size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-1">
                    Email Address
                  </p>
                  <p className="text-lg font-bold text-base-content">
                    {user.email}
                  </p>
                </div>
                {isEditing && (
                  <span className="text-xs font-bold text-base-content/50 bg-base-300 px-3 py-1.5 rounded-lg">
                    LOCKED
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="flex items-center p-5 bg-base-200/50 rounded-2xl border border-base-300/30 hover:border-base-300 transition-colors shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-base-100 shadow-sm flex items-center justify-center text-base-content/70 mr-5">
                  <Phone size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-1">
                    Phone Number
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full max-w-sm px-4 py-2 bg-base-100 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-base-content font-semibold"
                      placeholder="Enter phone number..."
                    />
                  ) : (
                    <p className="text-lg font-bold text-base-content">
                      {user.phone || <span className="text-base-content/30 italic font-medium">Not provided</span>}
                    </p>
                  )}
                </div>
              </div>

              {/* Joined */}
              <div className="flex items-center p-5 bg-base-200/50 rounded-2xl border border-base-300/30 hover:border-base-300 transition-colors shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-base-100 shadow-sm flex items-center justify-center text-base-content/70 mr-5">
                  <Calendar size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-1">
                    Member Since
                  </p>
                  <p className="text-lg font-bold text-base-content">
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
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProfile;

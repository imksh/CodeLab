import React, { useEffect, useState } from "react";
import api from "../../config/api";
import { Loader2, Users, FileCode, Target } from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics");
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!data) return <div className="text-center text-error font-medium p-8">Failed to load analytics data.</div>;

  const COLORS = ["#22c55e", "#ef4444"]; // Match --color-success and --color-error from index.css

  const metrics = [
    { title: "Total Users", value: data.totalUsers, icon: Users, color: "primary", bg: "bg-primary/10", text: "text-primary" },
    { title: "Total Problems", value: data.totalProblems, icon: FileCode, color: "secondary", bg: "bg-secondary/10", text: "text-secondary" },
    { title: "Submissions", value: data.totalSubmissions, icon: Target, color: "accent", bg: "bg-accent/10", text: "text-accent" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-base-content tracking-tight">Overview</h1>
        <p className="text-base-content/60 mt-1">Key metrics and recent activity across your platform.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative group bg-base-100/50 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-base-300/50 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${metric.color}/20 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none -mr-10 -mt-10 blur-xl`}></div>
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${metric.bg} flex items-center justify-center ${metric.text} shadow-inner`}>
                  <Icon size={28} />
                </div>
                <div>
                  <p className="text-base-content/60 text-sm font-semibold uppercase tracking-wider">{metric.title}</p>
                  <p className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-base-content to-base-content/60`}>
                    {metric.value}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Charts */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-base-100/50 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-base-300/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-success/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h2 className="text-xl font-bold mb-6 text-base-content flex items-center gap-2">
            <Target size={20} className="text-primary" /> Submission Status
          </h2>
          <div className="h-72 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.submissionsChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {data.submissionsChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(var(--color-base-100), 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(var(--color-base-300), 0.5)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: 'var(--color-base-content)', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-sm font-semibold text-base-content/80">Accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-error shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <span className="text-sm font-semibold text-base-content/80">Rejected</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Users List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-base-100/50 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-base-300/50 relative overflow-hidden"
        >
          <h2 className="text-xl font-bold mb-6 text-base-content flex items-center gap-2">
            <Users size={20} className="text-secondary" /> Recent Registrations
          </h2>
          <div className="space-y-4 relative z-10">
            {data.recentUsers.map((user, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (idx * 0.1) }}
                key={user._id} 
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-base-200/50 transition-colors border border-transparent hover:border-base-300/50 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center font-bold text-lg text-base-content shadow-inner group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-base-content">{user.name}</p>
                    <p className="text-xs text-base-content/50 font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-base-200 text-base-content/60">
                  {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </motion.div>
            ))}
            {data.recentUsers.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center gap-2 opacity-50">
                <Users size={40} />
                <p className="text-sm font-medium">No recent users.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

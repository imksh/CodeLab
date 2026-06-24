import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { Menu } from "lucide-react";
import AdminSidebar from "../ui/AdminSidebar";

const AdminLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  // We keep a lightweight version of navLinks here just to find the header title,
  // or we could determine the title purely from location.pathname.
  const getPageTitle = () => {
    if (location.pathname.includes("/problems/new")) return "Create Problem";
    if (location.pathname.includes("/problems/") && location.pathname.includes("/edit")) return "Edit Problem";
    if (location.pathname.includes("/problems")) return "Problems";
    if (location.pathname.includes("/profile")) return "Admin Profile";
    return "Dashboard";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-base-200 text-base-content relative">
      
      {/* Background Mesh Gradients */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px]"></div>
      </div> */}

      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="md:hidden bg-base-100/60 backdrop-blur-xl border-b border-base-300/40 h-16 flex items-center px-4 md:px-8 justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 hover:bg-base-200 rounded-xl transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="font-bold text-lg text-base-content/90">
              {getPageTitle()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layouts/PublicLayout";
import UserLayout from "./components/layouts/UserLayout";
import CodeLabLayout from "./components/layouts/CodeLabLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProblemList from "./pages/ProblemList";
import CodeLab from "./pages/CodeLab";

import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProblems from "./pages/admin/ManageProblems";
import ProblemForm from "./pages/admin/ProblemForm";
import AdminProfile from "./pages/admin/AdminProfile";

import useAuthStore from "./store/useAuthStore";
import useUiStore from "./store/useUiStore";

const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useUiStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (isCheckingAuth) {
    return <div className="h-dvh flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected User Routes */}
          <Route element={<UserLayout />}>
            <Route path="/problems" element={<ProblemList />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* CodeLab Route (has its own custom layout inside) */}
          <Route element={<CodeLabLayout />}>
            <Route path="/codelab/:id" element={<CodeLab />} />
          </Route>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="" element={<AdminDashboard />} />
            <Route path="problems" element={<ManageProblems />} />
            <Route path="problems/new" element={<ProblemForm />} />
            <Route path="problems/:id/edit" element={<ProblemForm />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

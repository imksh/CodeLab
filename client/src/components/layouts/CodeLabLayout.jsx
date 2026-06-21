import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../ui/Header";

const CodeLabLayout = () => {
  return (
    <div className="h-dvh">
      <div className="h-[5dvh] w-full">
        <Header />
      </div>
      <div className="h-[95dvh] w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default CodeLabLayout;

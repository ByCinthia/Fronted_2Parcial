import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import "./dashboard.css";

export default function DashboardLayout() {
  return (
    <div className="dashboard-root">
      <Topbar />
      <Sidebar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
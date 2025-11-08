import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import "./dashboard.css";

export default function DashboardLayout() {
  return (
    <div className="dashboard-root">
      <Topbar />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
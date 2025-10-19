import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./layout.css";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout-container">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`main-content ${collapsed ? "expanded" : ""}`}>
        {children}
      </main>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import CountUp from "react-countup";
import "../styles/estadisticas.css";

function Estadisticas() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    salesByDate: [],
    topProducts: [],
  });

  useEffect(() => {
    fetch("http://localhost:4000/api/dashboard-stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error cargando estadísticas:", err));
  }, []);

  const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#f44336"];

  return (
    <div className="dashboard-container">
      <h2>📊 Panel de Administración</h2>

      {/* Resumen rápido */}
      <div className="stats-cards">
        <div className="card">
          <h3>Total Ventas</h3>
          <p>${<CountUp end={stats.totalSales} duration={1.5} decimals={2} />}</p>
        </div>
        <div className="card">
          <h3>Total Órdenes</h3>
          <p><CountUp end={stats.totalOrders} duration={1.5} /></p>
        </div>
        <div className="card">
          <h3>Órdenes Completadas</h3>
          <p><CountUp end={stats.completedOrders} duration={1.5} /></p>
        </div>
        <div className="card">
          <h3>Órdenes Pendientes</h3>
          <p><CountUp end={stats.pendingOrders} duration={1.5} /></p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts">
        <div className="chart">
          <h3>Ventas por Día</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.salesByDate}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Bar dataKey="total" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h3>Productos más vendidos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.topProducts}
                dataKey="quantity"
                nameKey="name"
                outerRadius={80}
                label
              >
                {stats.topProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Estadisticas;

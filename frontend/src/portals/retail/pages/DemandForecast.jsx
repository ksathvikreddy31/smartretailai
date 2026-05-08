import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import {
  HiOutlineArrowTrendingUp,
  HiOutlineExclamationTriangle,
  HiOutlineCube,
  HiOutlineChartBar,
} from "react-icons/hi2";

import api from "../../../shared/services/api";

export default function DemandForecast() {
  const [forecastData, setForecastData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const COLORS = ["#818cf8", "#4ade80", "#facc15", "#fb7185", "#38bdf8"];

  // =====================================
  // FETCH FORECAST DATA
  // =====================================

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    try {
      setLoading(true);

      const response = await api.get("/ai/forecast");

      if (response.data.success) {
        setForecastData(response.data.forecast);
      } else {
        setError("Forecast service unavailable");
      }
    } catch (err) {
      console.error(err);

      setError("Unable to load forecast");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>AI Forecasting Engine Running...</h2>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div style={styles.loading}>
        <h2>⚠️ Forecast Error</h2>

        <p>{error}</p>
      </div>
    );
  }

  // =====================================
  // KPI
  // =====================================

  const highestDemand = forecastData[0];

  const lowStock = forecastData.filter(
    (item) => item.forecast_30_days > item.current_stock,
  );

  // =====================================
  // PIE CHART DATA
  // =====================================

  const categoryData = forecastData.reduce((acc, item) => {
    const existing = acc.find((x) => x.name === item.category);

    if (existing) {
      existing.value += item.forecast_30_days;
    } else {
      acc.push({
        name: item.category,

        value: item.forecast_30_days,
      });
    }

    return acc;
  }, []);

  return (
    <div style={styles.container}>
      {/* HEADER */}

      <div style={styles.header}>
        <h1 style={styles.title}>AI Demand Forecasting</h1>

        <p style={styles.subTitle}>SmartRetail ML Forecast Dashboard</p>
      </div>

      {/* KPI CARDS */}

      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <HiOutlineArrowTrendingUp size={30} color="#4ade80" />

          <div>
            <div style={styles.kpiLabel}>Highest Demand</div>

            <div style={styles.kpiValue}>{highestDemand?.product}</div>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <HiOutlineExclamationTriangle size={30} color="#f87171" />

          <div>
            <div style={styles.kpiLabel}>Low Stock Risks</div>

            <div style={styles.kpiValue}>{lowStock.length}</div>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <HiOutlineCube size={30} color="#38bdf8" />

          <div>
            <div style={styles.kpiLabel}>Products Forecasted</div>

            <div style={styles.kpiValue}>{forecastData.length}</div>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <HiOutlineChartBar size={30} color="#818cf8" />

          <div>
            <div style={styles.kpiLabel}>Market Trend</div>

            <div style={styles.kpiValue}>Bullish 📈</div>
          </div>
        </div>
      </div>

      {/* CHARTS */}

      <div style={styles.chartGrid}>
        {/* LINE CHART */}

        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Demand Forecast</h2>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="product" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="forecast_30_days"
                stroke="#818cf8"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="forecast_7_days"
                stroke="#4ade80"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}

        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Category Distribution</h2>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR CHART */}

      <div style={styles.chartCard}>
        <h2 style={styles.chartTitle}>Stock vs Predicted Demand</h2>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="product" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar dataKey="current_stock" fill="#38bdf8" />

            <Bar dataKey="forecast_30_days" fill="#818cf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PRODUCT CARDS */}

      <div style={styles.productGrid}>
        {forecastData.map((item, index) => (
          <div key={index} style={styles.productCard}>
            <div style={styles.category}>{item.category}</div>

            <h2 style={styles.productName}>{item.product}</h2>

            <div style={styles.metric}>
              Current Stock:
              {item.current_stock}
            </div>

            <div style={styles.metric}>
              7-Day Forecast:
              {item.forecast_7_days}
            </div>

            <div style={styles.metric}>
              30-Day Forecast:
              {item.forecast_30_days}
            </div>

            <div
              style={{
                marginTop: 12,

                color: item.trend === "up" ? "#4ade80" : "#f87171",

                fontWeight: "700",
              }}
            >
              {item.trend === "up"
                ? "📈 Increasing Demand"
                : "📉 Decreasing Demand"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#0f172a",

    minHeight: "100vh",

    padding: "30px",

    color: "white",
  },

  loading: {
    background: "#0f172a",

    minHeight: "100vh",

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    alignItems: "center",

    color: "white",
  },

  header: {
    marginBottom: "30px",
  },

  title: {
    fontSize: "38px",

    fontWeight: "800",
  },

  subTitle: {
    color: "#94a3b8",

    marginTop: "6px",
  },

  kpiGrid: {
    display: "grid",

    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",

    gap: "20px",

    marginBottom: "30px",
  },

  kpiCard: {
    background: "#111827",

    border: "1px solid #1e293b",

    borderRadius: "18px",

    padding: "22px",

    display: "flex",

    alignItems: "center",

    gap: "15px",
  },

  kpiLabel: {
    color: "#94a3b8",

    fontSize: "13px",
  },

  kpiValue: {
    fontSize: "22px",

    fontWeight: "700",
  },

  chartGrid: {
    display: "grid",

    gridTemplateColumns: "repeat(auto-fit,minmax(500px,1fr))",

    gap: "20px",

    marginBottom: "30px",
  },

  chartCard: {
    background: "#111827",

    border: "1px solid #1e293b",

    borderRadius: "20px",

    padding: "24px",

    marginBottom: "30px",
  },

  chartTitle: {
    marginBottom: "20px",

    fontSize: "20px",

    fontWeight: "700",
  },

  productGrid: {
    display: "grid",

    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",

    gap: "20px",
  },

  productCard: {
    background: "#111827",

    border: "1px solid #1e293b",

    borderRadius: "18px",

    padding: "20px",
  },

  category: {
    color: "#818cf8",

    fontSize: "13px",

    marginBottom: "10px",
  },

  productName: {
    fontSize: "24px",

    fontWeight: "700",

    marginBottom: "18px",
  },

  metric: {
    marginBottom: "8px",

    color: "#cbd5e1",
  },
};

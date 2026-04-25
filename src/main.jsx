import React from "react";
import { createRoot } from "react-dom/client";
import FMScoutDashboard from "./FMScoutDashboard";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || "Unknown rendering error",
    };
  }

  componentDidCatch(error) {
    console.error("Dashboard render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0a0f1e",
          color: "#e2e8f0",
          fontFamily: "Segoe UI, sans-serif",
          padding: 24,
        }}>
          <div style={{ maxWidth: 720, width: "100%", background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 10, padding: 20 }}>
            <h1 style={{ margin: 0, fontSize: 20, color: "#f1f5f9" }}>Dashboard failed to render</h1>
            <p style={{ marginTop: 10, color: "#94a3b8" }}>A runtime error occurred. This page now shows the error instead of a blank screen.</p>
            <pre style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#0f172a", border: "1px solid #1e293b", color: "#fca5a5", overflowX: "auto" }}>
              {this.state.errorMessage}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <FMScoutDashboard />
    </AppErrorBoundary>
  </React.StrictMode>
);

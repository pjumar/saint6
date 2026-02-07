"use client";

import { useState, useEffect } from "react";

interface DebugInfo {
  page: string;
  sections: {
    name: string;
    hasData: boolean;
    count?: number;
    error?: string;
  }[];
  timestamp: string;
  locale: string;
  env: string;
}

interface DebugPanelProps {
  info: DebugInfo;
}

export function DebugPanel({ info }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check for debug query param
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("debug") === "true") {
      setIsVisible(true);
    }
    // Log to console regardless
    console.log("[DebugPanel] Page render info:", info);
  }, [info]);

  if (!isClient || !isVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "rgba(0, 0, 0, 0.9)",
        color: "#fff",
        padding: "16px",
        borderRadius: "8px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 99999,
        maxWidth: "400px",
        maxHeight: "80vh",
        overflow: "auto",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <strong style={{ color: "#4ade80" }}>Debug: {info.page}</strong>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          x
        </button>
      </div>

      <div style={{ marginBottom: "8px", color: "#9ca3af" }}>
        Locale: {info.locale} | Env: {info.env}
      </div>
      <div style={{ marginBottom: "12px", color: "#9ca3af" }}>
        Built: {info.timestamp}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "4px 8px",
                borderBottom: "1px solid #333",
              }}
            >
              Section
            </th>
            <th
              style={{
                textAlign: "center",
                padding: "4px 8px",
                borderBottom: "1px solid #333",
              }}
            >
              Status
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "4px 8px",
                borderBottom: "1px solid #333",
              }}
            >
              Count
            </th>
          </tr>
        </thead>
        <tbody>
          {info.sections.map((section) => (
            <tr key={section.name}>
              <td style={{ padding: "4px 8px" }}>{section.name}</td>
              <td style={{ padding: "4px 8px", textAlign: "center" }}>
                {section.error ? (
                  <span style={{ color: "#ef4444" }}>ERR</span>
                ) : section.hasData ? (
                  <span style={{ color: "#4ade80" }}>OK</span>
                ) : (
                  <span style={{ color: "#fbbf24" }}>EMPTY</span>
                )}
              </td>
              <td style={{ padding: "4px 8px", textAlign: "right" }}>
                {section.count ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {info.sections.some((s) => s.error) && (
        <div style={{ marginTop: "12px", color: "#ef4444" }}>
          <strong>Errors:</strong>
          {info.sections
            .filter((s) => s.error)
            .map((s) => (
              <div key={s.name} style={{ marginTop: "4px" }}>
                {s.name}: {s.error}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface HelloResponse {
  message: string;
}

interface CalculateResponse {
  a: number;
  b: number;
  operation: string;
  result: number;
  expression: string;
}

const API_URL = "http://localhost:5174";

function App() {
  const [numA, setNumA] = useState("1");
  const [numB, setNumB] = useState("1");
  const [operation, setOperation] = useState("add");

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<HelloResponse>({
    queryKey: ["hello"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/hello`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
  });

  const {
    data: calcData,
    isPending: calcPending,
    isError: calcError,
    error: calcErrorMsg,
    refetch: calcRefetch,
  } = useQuery<CalculateResponse>({
    queryKey: ["calculate", numA, numB, operation],
    queryFn: async () => {
      const params = new URLSearchParams({ a: numA, b: numB, operation });
      const response = await fetch(`${API_URL}/api/calculate?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    enabled: numA !== "" && numB !== "",
  });

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Cloud Env Client</h1>
      <p style={{ color: "#666" }}>
        This app fetches data from the Hono server at {API_URL}
      </p>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Server Response:</h2>
        {isPending && <p>Loading...</p>}
        {isError && (
          <p style={{ color: "red" }}>
            Error: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        )}
        {data && (
          <p
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            {data.message}
          </p>
        )}
      </div>

      <button
        onClick={() => refetch()}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Refresh
      </button>

      {/* Calculator Section */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          border: "2px solid #10b981",
          borderRadius: "8px",
          backgroundColor: "#f0fdf4",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#059669" }}>Calculator (1+1=?)</h2>
        
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: "500" }}>
              Number A:
            </label>
            <input
              type="number"
              value={numA}
              onChange={(e) => setNumA(e.target.value)}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                width: "100px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: "500" }}>
              Operation:
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <option value="add">+</option>
              <option value="subtract">-</option>
              <option value="multiply">×</option>
              <option value="divide">÷</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", fontWeight: "500" }}>
              Number B:
            </label>
            <input
              type="number"
              value={numB}
              onChange={(e) => setNumB(e.target.value)}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                width: "100px",
              }}
            />
          </div>

          <button
            onClick={() => calcRefetch()}
            style={{
              marginTop: "1.25rem",
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              cursor: "pointer",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Calculate
          </button>
        </div>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "white",
            borderRadius: "4px",
            border: "1px solid #d1fae5",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Result:</h3>
          {calcPending && <p>Calculating...</p>}
          {calcError && (
            <p style={{ color: "red" }}>
              Error: {calcErrorMsg instanceof Error ? calcErrorMsg.message : "Unknown error"}
            </p>
          )}
          {calcData && (
            <div>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#059669",
                  margin: "0.5rem 0",
                }}
              >
                {calcData.expression}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
                {calcData.a} {calcData.operation} {calcData.b} = {calcData.result}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

import { useQuery } from "@tanstack/react-query";

interface HelloResponse {
  message: string;
}

const API_URL = "http://localhost:5174";

function App() {
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
    </div>
  );
}

export default App;

//Mark as client in order to use react hooks
"use client";

import React from "react";
import { fetchFormGraph }  from "./hooks/fetchFormGraph";

export default function Home() {
  const { graph, loading, error } = fetchFormGraph();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading graph: {error.message}</div>;

  return (
    <pre>{JSON.stringify(graph, null, 2)}</pre>
  );
}

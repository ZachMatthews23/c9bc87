//Mark as client in order to use react hooks
"use client";

import { useEffect, useState } from "react";
import { FormGraph } from "@/app/types/model";

//URL to reach mock server
const MOCK_GRAPH_URL = "http://localhost:3000/api/v1/123/actions/blueprints/bp_456/graph";

export const FetchFormGraph = () => {
  const [graph, setGraph] = useState<FormGraph | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await fetch(MOCK_GRAPH_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch graph: ${response.statusText}`);
        }
        const data: FormGraph = await response.json();
        setGraph(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, []);

  return { graph, loading, error };
};
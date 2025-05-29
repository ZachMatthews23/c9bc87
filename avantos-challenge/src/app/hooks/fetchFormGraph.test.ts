import { renderHook, act } from "@testing-library/react";
import { fetchFormGraph } from "./fetchFormGraph";

global.fetch = jest.fn();

describe("fetchFormGraph", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and return the graph data successfully", async () => {
    const mockGraphData = { id: "123", name: "Test Graph" };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGraphData,
    });

    const { result } = renderHook(() => fetchFormGraph());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      // Wait for the useEffect to complete
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.graph).toEqual(mockGraphData);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch errors", async () => {
    const mockErrorMessage = "Failed to fetch graph";
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: mockErrorMessage,
    });

    const { result } = renderHook(() => fetchFormGraph());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      // Wait for the useEffect to complete
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.graph).toBeNull();
    expect(result.current.error).toEqual(new Error(`Failed to fetch graph: ${mockErrorMessage}`));
  });

  it("should handle network errors", async () => {
    const mockError = new Error("Network Error");
    (fetch as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => fetchFormGraph());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      // Wait for the useEffect to complete
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.graph).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });
});
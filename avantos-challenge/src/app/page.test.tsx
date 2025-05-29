import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./page";
import { FetchFormGraph } from "./hooks/fetchFormGraph";

jest.mock("./hooks/fetchFormGraph");

const mockGraph = {
  nodes: {
    formA: {
      id: "formA",
      data: { name: "Form A" },
      fields: [
        { id: "email", name: "Email", type: "text" },
        { id: "name", name: "Name", type: "text" },
      ],
    },
    formB: {
      id: "formB",
      data: { name: "Form B" },
      fields: [
        { id: "address", name: "Address", type: "text" },
        { id: "phone", name: "Phone", type: "text" },
      ],
    },
  },
};

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", () => {
    (FetchFormGraph as jest.Mock).mockReturnValue({
      graph: null,
      loading: true,
      error: null,
    });

    render(<Home />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render error state if fetch fails", () => {
    (FetchFormGraph as jest.Mock).mockReturnValue({
      graph: null,
      loading: false,
      error: { message: "Failed to load graph" },
    });

    render(<Home />);
    expect(screen.getByText("Error loading graph: Failed to load graph")).toBeInTheDocument();
  });

  it("should render form list when data is loaded", () => {
    (FetchFormGraph as jest.Mock).mockReturnValue({
      graph: mockGraph,
      loading: false,
      error: null,
    });

    render(<Home />);
    expect(screen.getByText("Form A")).toBeInTheDocument();
    expect(screen.getByText("Form B")).toBeInTheDocument();
  });

  it("should update selected form when a form is clicked", () => {
    (FetchFormGraph as jest.Mock).mockReturnValue({
      graph: mockGraph,
      loading: false,
      error: null,
    });

    render(<Home />);
    fireEvent.click(screen.getAllByText("Form A")[0]);
    expect(screen.getAllByText("Form A")[0]).toBeInTheDocument();
  });

  it("should update form values and propagates changes to dependent forms", () => {
    (FetchFormGraph as jest.Mock).mockReturnValue({
      graph: mockGraph,
      loading: false,
      error: null,
    });

    const { getByText } = render(<Home />);
    fireEvent.click(getByText("Form A"));

    const emailInput = screen.getByPlaceholderText("email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput).toHaveValue("test@example.com");
  });
});
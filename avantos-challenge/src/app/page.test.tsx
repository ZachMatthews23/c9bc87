import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./page";
import { fetchFormGraph } from "./hooks/fetchFormGraph";

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
      field_schema: {
        email: { type: "text", required: true },
        name: { type: "text", required: false },
      },
    },
    formB: {
      id: "formB",
      data: { name: "Form B" },
      fields: [
        { id: "address", name: "Address", type: "text" },
        { id: "phone", name: "Phone", type: "text" },
      ],
      field_schema: {
        address: { type: "text", required: true },
        phone: { type: "text", required: false },
      },
    },
  },
};

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (fetchFormGraph as jest.Mock).mockReturnValue({
      graph: null,
      loading: true,
      error: null,
    });

    render(<Home />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state if fetch fails", () => {
    (fetchFormGraph as jest.Mock).mockReturnValue({
      graph: null,
      loading: false,
      error: { message: "Failed to load graph" },
    });

    render(<Home />);
    expect(screen.getByText("Error loading graph: Failed to load graph")).toBeInTheDocument();
  });

  it("renders form list when data is loaded", () => {
    (fetchFormGraph as jest.Mock).mockReturnValue({
      graph: mockGraph,
      loading: false,
      error: null,
    });

    render(<Home />);
    expect(screen.getByText("Form A")).toBeInTheDocument();
    expect(screen.getByText("Form B")).toBeInTheDocument();
  });

  it("updates selected form when a form is clicked", () => {
    (fetchFormGraph as jest.Mock).mockReturnValue({
      graph: mockGraph,
      loading: false,
      error: null,
    });

    render(<Home />);
    fireEvent.click(screen.getByText("Form A"));
    expect(screen.getByText("Form A")).toBeInTheDocument();
  });

  it("updates form values and propagates changes to dependent forms", () => {
    (fetchFormGraph as jest.Mock).mockReturnValue({
      graph: mockGraph,
      loading: false,
      error: null,
    });

    const { getByText } = render(<Home />);
    fireEvent.click(getByText("Form A"));

    const emailInput = screen.getByLabelText("email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput).toHaveValue("test@example.com");
  });
});
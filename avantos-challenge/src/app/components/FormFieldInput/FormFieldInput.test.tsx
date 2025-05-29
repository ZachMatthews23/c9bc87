import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormFieldInput from "./FormFieldInput";

describe("FormFieldInput Component", () => {
  const mockOnChange = jest.fn();
  const mockOnClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the input field with the correct props", () => {
    render(
      <FormFieldInput
        type="text"
        placeholder="Enter text"
        value="test value"
        onChange={mockOnChange}
      />
    );

    const inputElement = screen.getByPlaceholderText("Enter text");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue("test value");
    expect(inputElement).toHaveAttribute("type", "text");
  });

  it("calls onChange when the input value changes", () => {
    render(
      <FormFieldInput
        type="text"
        placeholder="Enter text"
        value=""
        onChange={mockOnChange}
      />
    );

    const inputElement = screen.getByPlaceholderText("Enter text");
    fireEvent.change(inputElement, { target: { value: "new value" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: { value: "new value" } })
    );
  });

  it("renders the clear button for email input type", () => {
    render(
      <FormFieldInput
        type="email"
        placeholder="Enter email"
        value="test@example.com"
        onChange={mockOnChange}
      />
    );

    const clearButton = screen.getByRole("button", { name: /clear/i });
    expect(clearButton).toBeInTheDocument();
  });

  it("does not render the clear button for non-email input types", () => {
    render(
      <FormFieldInput
        type="text"
        placeholder="Enter text"
        value="test value"
        onChange={mockOnChange}
      />
    );

    const clearButton = screen.queryByRole("button", { name: /clear/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it("clears the input value when the clear button is clicked", () => {
    render(
      <FormFieldInput
        type="email"
        placeholder="Enter email"
        value="test@example.com"
        onChange={mockOnChange}
      />
    );

    const clearButton = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: { value: "" } })
    );
  });

  it("calls onClick when the input is clicked", () => {
    render(
      <FormFieldInput
        type="text"
        placeholder="Enter text"
        value=""
        onChange={mockOnChange}
        onClick={mockOnClick}
      />
    );

    const inputElement = screen.getByPlaceholderText("Enter text");
    fireEvent.click(inputElement);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
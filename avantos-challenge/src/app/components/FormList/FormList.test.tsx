import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormList from "./FormList";
import { Form } from "@/app/types/model";

const mockForms: Form[] = [
  { id: "1", data: { name: "Form 1" }, fields: [] },
  { id: "2", data: { name: "Form 2" }, fields: [] },
  { id: "3", data: { name: "Form 3" }, fields: [] },
];

const mockOnSelectedForm = jest.fn();

describe("FormList Component", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the list of forms", () => {
    render(
      <FormList
        forms={mockForms}
        selectedFormId={null}
        onSelectedForm={mockOnSelectedForm}
      />
    );

    mockForms.forEach((form) => {
      expect(screen.getByText(form.data.name)).toBeInTheDocument();
    });
  });

  it("should apply selected styles to the selected form", () => {
    render(
      <FormList
        forms={mockForms}
        selectedFormId="2"
        onSelectedForm={mockOnSelectedForm}
      />
    );

    const selectedItem = screen.getByText("Form 2");
    expect(selectedItem).toHaveStyle("background-color: #f0f0f0");
    expect(selectedItem).toHaveStyle("font-weight: bold");
  });

  it("should call onSelectedForm when a form is clicked", () => {
    render(
      <FormList
        forms={mockForms}
        selectedFormId={null}
        onSelectedForm={mockOnSelectedForm}
      />
    );

    const formItem = screen.getByText("Form 1");
    fireEvent.click(formItem);

    expect(mockOnSelectedForm).toHaveBeenCalledWith("1");
  });

  it("should not apply selected styles to unselected forms", () => {
    render(
      <FormList
        forms={mockForms}
        selectedFormId="2"
        onSelectedForm={mockOnSelectedForm}
      />
    );

    const unselectedItem = screen.getByText("Form 1");
    expect(unselectedItem).not.toHaveStyle("background-color: #f0f0f0");
    expect(unselectedItem).not.toHaveStyle("font-weight: bold");
  });

  it("should render an empty list when no forms are provided", () => {
    render(
      <FormList
        forms={[]}
        selectedFormId={null}
        onSelectedForm={mockOnSelectedForm}
      />
    );

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
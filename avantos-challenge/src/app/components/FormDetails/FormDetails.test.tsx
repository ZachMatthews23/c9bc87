import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormDetails from "./FormDetails";
import PrefillModal from "../Modal/PrefillModal";
import { FormGraph, GlobalData } from "@/app/types/model";

jest.mock("../PrefillModal/PrefillModal", () => jest.fn(() => <div data-testid="prefill-modal" />));

const mockOnFieldValueChange = jest.fn();
const mockForm = { id: "1", data: { name: "Form B" } };
const mockAllForms = {} as FormGraph;
const mockFormValues = { "1": { field1: "value1" } };
const mockGlobalData = { fields: [{ id: "globalField1", value: "globalValue1" }] } as GlobalData;
const mockSelectedFormValues = { field1: "value1" };

describe("FormDetails Component", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <FormDetails
        allForms={mockAllForms}
        form={mockForm}
        formValues={mockFormValues}
        globalData={mockGlobalData}
        selectedFormValues={mockSelectedFormValues}
        onFieldValueChange={mockOnFieldValueChange}
      />
    );

  it("should render the form name", () => {
    renderComponent();
    expect(screen.getByText("Form B")).toBeInTheDocument();
  });

  it("should render form fields", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("dynamic_checkbox_group")).toBeInTheDocument();
  });

  it("should call onFieldValueChange when a field value is changed", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("dynamic_checkbox_group");
    fireEvent.change(input, { target: { value: "new value" } });
    expect(mockOnFieldValueChange).toHaveBeenCalledWith("dynamic_checkbox_group", "new value");
  });

  it("should open the PrefillModal when a field is clicked and value is empty", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("dynamic_checkbox_group");
    fireEvent.click(input);
    expect(screen.getByTestId("prefill-modal")).toBeInTheDocument();
  });

  it("should close the PrefillModal when onClose is triggered", () => {
    (PrefillModal as jest.Mock).mockImplementation(({ onClose }) => (
      <div data-testid="prefill-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ));
    renderComponent();
    fireEvent.click(screen.getByPlaceholderText("dynamic_checkbox_group"));
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("prefill-modal")).not.toBeInTheDocument();
  });

  it("should save prefill value when onSave is triggered", () => {
    const mockPrefill = { sourceFormId: "global-data", sourceFieldId: "globalField1" };
    (PrefillModal as jest.Mock).mockImplementation(({ onSave }) => (
      <div data-testid="prefill-modal">
        <button onClick={() => onSave(mockPrefill)}>Save</button>
      </div>
    ));
    renderComponent();
    fireEvent.click(screen.getByPlaceholderText("dynamic_checkbox_group"));
    fireEvent.click(screen.getByText("Save"));
    expect(mockOnFieldValueChange).toHaveBeenCalledWith("dynamic_checkbox_group", "globalValue1");
  });
});
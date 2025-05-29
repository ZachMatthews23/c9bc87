//Mark as client in order to use react hooks
"use client";

import React, { useState } from "react";
import { FetchFormGraph } from "./hooks/fetchFormGraph";
import FormList from "./components/FormList/FormList";
import FormDetails from "./components/FormDetails/FormDetails";
import { dependencies, FormGraph, FormIds, GlobalData } from "./types/model";
import { findFormById, propagateEmailToDependents } from "./utils/graphUtil";

export default function Home() {
  const { graph, loading, error } = FetchFormGraph();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  // Centralized state for all form field values
  const [formValues, setFormValues] = useState<{
    [formId: string]: { [field: string]: string };
  }>({});

  // Handle changes to the email form field and propagate changes to dependent forms
  const handleFieldValueChange = (formId: string, formName: string, field: string, value: string) => {
    setFormValues((prev) => {
      const updatedValues = {
        ...prev,
        [formId]: {
          ...prev[formId],
          [field]: value,
        },
      };
  
      // If Form A's email changes, propagate it to dependent forms
      if (formId === FormIds.FormA && field === "email") {
        propagateEmailToDependents(dependencies, updatedValues, value);
      } else {
        // Ensures all other forms only update their own values
        updatedValues[formName] = {
          ...updatedValues[formName],
          [field]: value,
        };
      }
  
      return updatedValues;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading graph: {error.message}</div>;

  const selectedForm = selectedFormId
    ? findFormById(Object.values(graph?.nodes ?? []), selectedFormId)
    : null;

  return (
    <div>
      <FormList
        forms={Object.values(graph?.nodes ?? []).sort((a, b) =>
          a.data.name.localeCompare(b.data.name)
        )}
        onSelectedForm={setSelectedFormId}
        selectedFormId={selectedFormId}
      />

      {selectedForm && (
        <FormDetails
          form={selectedForm as { id: string; data: { name: string; }; }}
          selectedFormValues={formValues[selectedForm.data.name] || {}}
          formValues={formValues}
          onFieldValueChange={(field, value) => handleFieldValueChange(selectedForm.id, selectedForm.data.name, field, value)} 
          allForms={graph as FormGraph}
          globalData={GlobalData}  
        />
      )}
    </div>
  );
};
import React, { useState } from "react";
import FormFieldInput from "../FormFieldInput/FormFieldInput";
import PrefillModal from "../PrefillModal/PrefillModal";
import { formFields, Form, FormGraph, PrefillMapping } from "@/app/types/model";

type FormDetailsProps = {
  form: { id: string; data: { name: string } };
  selectedFormValues: { [field: string]: string };
  formValues: { [formId: string]: { [field: string]: string } };
  allForms: FormGraph;
  onFieldValueChange: (field: string, value: string) => void;
};

const FormDetails: React.FC<FormDetailsProps> = ({
  form,
  selectedFormValues,
  formValues,
  allForms,
  onFieldValueChange,
}) => {
  const [prefillModalState, setPrefillModalState] = useState<{
    isOpen: boolean;
    fieldId: string | null;
  }>({ isOpen: false, fieldId: null });

  const handleFieldChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Open PrefillModal if the current form is not "Form A" and the value is null
    if (form.data.name !== "Form A" && !value) {
      handleOpenPrefillModal(field);
    } else {
      onFieldValueChange(field, value);
    }
  };

  const handleOpenPrefillModal = (fieldId: string) => {
    setPrefillModalState({ isOpen: true, fieldId });
  };
  
  const handleClosePrefillModal = () => {
    setPrefillModalState({ isOpen: false, fieldId: null });
  };
  
  const handleSavePrefill = (prefill: PrefillMapping | null) => {
    if (prefill) {
      const prefillValue = formValues[prefill.sourceFormId]?.[prefill.sourceFieldId] || "";
      onFieldValueChange(prefillModalState.fieldId!, prefillValue);
    }
    handleClosePrefillModal();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>{form.data.name}</h2>
      <form style={styles.fieldList}>
        {formFields.map((field, index) => (
          <div key={index}>
            <FormFieldInput
              type={field.type}
              placeholder={field.placeholder}
              value={selectedFormValues[field.placeholder] || ""}
              onChange={handleFieldChange(field.placeholder)}
              onClick={() => {
                if (form.data.name !== "Form A" && !formValues[field.placeholder]) {
                  handleOpenPrefillModal(field.placeholder);
                }
              }}
            />
          </div>
        ))}
      </form>
      {prefillModalState.isOpen && (
        <PrefillModal
          fieldId={prefillModalState.fieldId!}
          formId={form.id}
          formGraph={allForms}
          onClose={handleClosePrefillModal}
          onSave={handleSavePrefill}
        />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  mainContent: {
    transition: 'margin-left 0.3s ease',
    marginLeft: '0',
  },
  mainContentShifted: {
    marginLeft: '300px',
  },
  header: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  fieldList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '50%',
  },
};

export default FormDetails;
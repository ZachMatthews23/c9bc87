import React, { useState } from "react";
import FormFieldInput from "../FormFieldInput/FormFieldInput";
import PrefillModal from "../Modal/PrefillModal";
import { formFields, FormGraph, GlobalData, PrefillMapping } from "@/app/types/model";

type FormDetailsProps = {
  allForms: FormGraph;
  form: { id: string; data: { name: string } };
  formValues: { [formId: string]: { [field: string]: string } };
  globalData: GlobalData;
  selectedFormValues: { [field: string]: string };
  onFieldValueChange: (field: string, value: string) => void;
};

const FormDetails: React.FC<FormDetailsProps> = ({
  allForms,
  form,
  formValues,
  globalData,
  selectedFormValues,
  onFieldValueChange,
}) => {
  const [prefillModalState, setPrefillModalState] = useState<{
    isOpen: boolean;
    fieldId: string | null;
  }>({ isOpen: false, fieldId: null });

  const handleFieldChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    if (form.data.name !== "Form A" && !value) {
      handleOpenPrefillModal(field);
    } else {
      onFieldValueChange(field, value);
    }
  };
  
  const handleFieldClick = (field: string) => {
    if (form.data.name !== "Form A" && !selectedFormValues[field]) {
      handleOpenPrefillModal(field);
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
      const prefillValue =
        prefill.sourceFormId === "global-data"
          ? globalData.fields.find((field) => field.id === prefill.sourceFieldId)?.value || ""
          : formValues[prefill.sourceFormId]?.[prefill.sourceFieldId] || "";
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
            placeholder={field.name}
            value={selectedFormValues[field.name] || ""}
            onChange={handleFieldChange(field.name)}
            onClick={() => handleFieldClick(field.name)}
          />
        </div>
      ))}
    </form>
      {prefillModalState.isOpen && (
        <PrefillModal
          formId={form.id}
          formGraph={allForms}
          onClose={handleClosePrefillModal}
          onSave={handleSavePrefill}
          globalData={globalData}
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
import React from "react";
import { Form } from "../../types/model";

type FormListProps = {
  forms: Form[];
  selectedFormId: string | null;
  onSelectForm: (formId: string) => void;
};

const FormList: React.FC<FormListProps> = ({ forms, selectedFormId, onSelectForm }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Forms</h2>
      <ul style={styles.list}>
        {forms.map((form) => (
          <li
            key={form.id}
            style={{
              ...styles.listItem,
              ...(form.id === selectedFormId ? styles.selectedItem : {}),
            }}
            onClick={() => onSelectForm(form.id)}
          >
            {form.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minWidth: "200px",
    borderRight: "1px solid #ccc",
    paddingRight: "1rem",
  },
  header: {
    fontSize: "1.25rem",
    marginBottom: "0.5rem",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "0.5rem",
    cursor: "pointer",
    borderRadius: "6px",
    marginBottom: "0.25rem",
    backgroundColor: "#f9f9f9",
    transition: "background 0.2s ease",
  },
  selectedItem: {
    backgroundColor: "#d3e5ff",
    fontWeight: "bold",
  },
};

export default FormList;
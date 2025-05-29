import React from "react";
import { Form } from "@/app/types/model"

type FormListProps = {
  forms: Form[],
  selectedFormId: string | null,
  onSelectedForm: (formId: string) => void;
}

const FormList: React.FC<FormListProps> = ({forms, selectedFormId, onSelectedForm}) => {
  return (
    <div style={styles.container}>
      <ul style={styles.list}>
        {forms.map((form) => (
          <li
            key={form.id}
            style={{
              ...styles.listItem,
              ...(selectedFormId === form.id ? styles.selectedItem : {})
            }}
            onClick={() => onSelectedForm(form.id)}
          >
            {form.data.name}
          </li>
        ))}
      </ul>
    </div>
  )
} 

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '50%',
    borderRight: '1px solid #ccc',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '0.5rem',
    cursor: 'pointer',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    backgroundColor: '#808080',
    transition: 'background-color 0.2s ease',
  },
  selectedItem: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    color: '#000',
  }
}

export default FormList;
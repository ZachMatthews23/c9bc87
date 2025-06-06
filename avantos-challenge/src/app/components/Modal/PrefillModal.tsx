import React, { useState } from 'react';
import { FormGraph, GlobalData, PrefillMapping } from '@/app/types/model';
import { getDependencyForms } from '@/app/utils/graphUtil';
import { formFields } from '@/app/types/const';

type PrefillModalProps = {
  formId: string;
  onClose: () => void;
  onSave: (prefill: PrefillMapping | null) => void;
  formGraph: FormGraph;
  globalData: GlobalData;
};

const PrefillModal: React.FC<PrefillModalProps> = ({ formId, onClose, onSave, formGraph, globalData }) => {
  const [search, setSearch] = useState('');
  const [expandedFormId, setExpandedFormId] = useState<string | null>(null);
  const [selectedPrefill, setSelectedPrefill] = useState<PrefillMapping | null>(null);

  const dependencyForms = getDependencyForms(formId, formGraph);

  const handleFormClick = (formId: string) => {
    setExpandedFormId(prev => (prev === formId ? null : formId));
  };

  const handleSelect = () => {
    if (selectedPrefill) {
      onSave(selectedPrefill);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.header}>Select data element to map</h3>

        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <div style={styles.treeContainer}>
          {/* Render Global Data */}
          <div>
            <div
              style={{
                ...styles.formHeader,
                backgroundColor: expandedFormId === globalData.id ? '#eee' : 'transparent',
              }}
              onClick={() => handleFormClick(globalData.id)}
            >
              {expandedFormId === globalData.id ? '▾' : '▸'} {globalData.data.name}
            </div>
            {expandedFormId === globalData.id && (
              <ul style={styles.fieldList}>
                {globalData.fields
                  .filter((field) =>
                    field.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((field) => (
                    <li
                      key={field.id}
                      style={{
                        ...styles.fieldItem,
                        backgroundColor:
                          selectedPrefill?.sourceFormId === globalData.id &&
                          selectedPrefill?.sourceFieldId === field.id
                            ? '#d0eaff'
                            : 'transparent',
                      }}
                      onClick={() =>
                        setSelectedPrefill({
                          sourceFormId: globalData.id,
                          sourceFieldId: field.id,
                        })
                      }
                    >
                      {field.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          {/* Render Dependency Forms */}
          {dependencyForms.map((form) => {
            const fields = formFields.filter(field =>
              field.name.toLowerCase().includes(search.toLowerCase())
            );

            return (
              <div key={form?.id}>
                <div
                  style={{
                    ...styles.formHeader,
                    backgroundColor: expandedFormId === form?.id ? '#eee' : 'transparent',
                  }}
                  onClick={() => handleFormClick(form?.id ?? '')}
                >
                  {expandedFormId === form?.id ? '▾' : '▸'} {form?.data.name}
                </div>
                {expandedFormId === form?.id && (
                  <ul style={styles.fieldList}>
                    {fields.map((field) => (
                      <li
                        key={field.name}
                        style={{
                          ...styles.fieldItem,
                          backgroundColor:
                            selectedPrefill?.sourceFormId === form.id &&
                            selectedPrefill?.sourceFieldId === field.name
                              ? '#d0eaff'
                              : 'transparent',
                        }}
                        onClick={() =>
                          setSelectedPrefill({
                            sourceFormId: form.id,
                            sourceFieldId: field.name,
                          })
                        }
                      >
                        {field.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelButton}>
            Cancel
          </button>
          <button
            onClick={handleSelect}
            style={styles.selectButton}
            disabled={!selectedPrefill}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    color: '#000',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginBottom: '1rem',
    fontSize: '1.2rem',
  },
  search: {
    marginBottom: '1rem',
    padding: '0.5rem',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc',
    color: '#000',
  },
  treeContainer: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '0.5rem',
  },
  formHeader: {
    padding: '0.5rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
  },
  fieldList: {
    listStyle: 'none',
    margin: 0,
    paddingLeft: '1rem',
  },
  fieldItem: {
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
    borderRadius: '4px',
    marginBottom: '2px',
  },
  footer: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  },
  cancelButton: {
    backgroundColor: "#ff4d4d",
    border: '1px solid #ccc',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
  selectButton: {
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default PrefillModal;
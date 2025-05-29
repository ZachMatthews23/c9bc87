import React from "react";

type FormFieldInputProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
};

const FormFieldInput: React.FC<FormFieldInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  onClick
}) => {
  // Handle clearing the input value
  const handleClear = () => {
    const event = {
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div style={styles.container}>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        onClick={onClick}
        style={styles.input}
      />
      {type === "email" && (
        <button type="button" onClick={handleClear} style={styles.clearButton}>
          Clear
        </button>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
    color: "#000",
    backgroundColor: "#f0f0f0",
  },
  clearButton: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    cursor: "pointer",
  },
};

export default FormFieldInput;
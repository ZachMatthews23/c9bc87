export type Field = {
  id: string;
  name: string;
  prefill?: PrefillMapping | null;
  type: string;
};

export type Form = {
  id: string;
  data: {
    name: string;
  }
  fields: Field[];
  field_schema: {
    properties: {
      [key: string]: any;
    };
  };
};

export type PrefillMapping = {
  sourceFormId: string;
  sourceFieldId: string;
};

export type FormGraph = {
  nodes: { [formId: string]: Form };
  edges: { from: string; to: string }[];
  forms?: {
    field_schema: {
      properties: { [key: string]: any };
    };
  };
};

//Update to add more fields for selected Form
export const formFields = [
  { type: "text", placeholder: "dynamic_checkbox_group" },
  { type: "text", placeholder: "dynamic_object" },
  { type: "email", placeholder: "email" },
];

export const dependencies: { [key: string]: string[] } = {
  "Form A": ["Form A"],
  "Form B": ["Form A"],
  "Form C": ["Form A"],
  "Form D": ["Form A"],
  "Form E": ["Form A"],
  "Form F": ["Form A"],
};

export const FormIds = {
  FormA: "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88",
  FormB: "form-a4750667-d774-40fb-9b0a-44f8539ff6c4",
  FormC: "form-7c26f280-7bff-40e3-b9a5-0533136f52c3",
  FormD: "form-0f58384c-4966-4ce6-9ec2-40b96d61f745",
  FormE: "form-e15d42df-c7c0-4819-9391-53730e6d47b3",
  FormF: "form-bad163fd-09bd-4710-ad80-245f31b797d5",
}
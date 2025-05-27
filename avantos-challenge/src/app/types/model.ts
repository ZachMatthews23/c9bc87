export type Field = {
  id: string;
  name: string;
  prefill?: PrefillMapping;
  type: string;
};

export type Form = {
  id: string;
  name: string;
  fields: Field[];
};

export type PrefillMapping = {
  sourceFormId: string;
  sourceFieldId: string;
};

export type FormGraph = {
  forms: { [formId: string]: Form };
  edges: { from: string; to: string }[];
};
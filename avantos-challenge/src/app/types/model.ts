export type Field = {
  id: string;
  name: string;
  prefill?: PrefillMapping | null;
  type: string;
  value?: string;
};

export type Form = {
  id: string;
  data: {
    name: string;
    prerequisites?: string[];
  }
  fields: Field[];
};

export type PrefillMapping = {
  sourceFormId: string;
  sourceFieldId: string;
};

export type FormGraph = {
  nodes: { [formId: string]: Form };
  edges: { from: string; to: string }[];
};

export type GlobalData = {
  id: string;
  data: {
    name: string;
    prerequisites: string[];
  };
  fields: Field[];
};

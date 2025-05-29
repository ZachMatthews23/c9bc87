export const findFormById = (
  nodes: { id: string; data: { name: string }; [key: string]: any }[],
  id: string
) => {
  return nodes.find((node) => node.id === id) || null;
};

export const propagateEmailToDependents = (
  dependencies: { [key: string]: string[] },
  updatedValues: { [formId: string]: { [field: string]: string } },
  value: string
) => {
  Object.keys(dependencies).forEach((dependentFormId) => {
    if (dependencies[dependentFormId].includes("Form A")) {
      updatedValues[dependentFormId] = {
        ...updatedValues[dependentFormId],
        email: value,
      };
    }
  });
};
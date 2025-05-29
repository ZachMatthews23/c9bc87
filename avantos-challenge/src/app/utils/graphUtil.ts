import { FormGraph } from '@/app/types/model';

// Utility functions for managing form dependencies and values in a graph structure

export const findFormById = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

//Used to determine form dependecies
export const getFormDependencies = (
  formId: string,
  formGraph: FormGraph,
  visited = new Set<string>()
): string[] => {
  const node = Object.values(formGraph.nodes).find((n) => n.id === formId);
  if (!node || visited.has(formId)) return [];

  visited.add(formId);

  let deps: string[] = [];
  for (const prereqId of node.data.prerequisites || []) {
    deps.push(prereqId);
    deps = deps.concat(getFormDependencies(prereqId, formGraph, visited));
  }

  return deps;
};

export const getDependencyForms = (formId: string, formGraph: FormGraph) => {
  const dependencyIds = Array.from(new Set(getFormDependencies(formId, formGraph)));
  return dependencyIds
    .map((id) => Object.values(formGraph.nodes).find((n) => n.id === id))
    .sort((a, b) => (a?.data.name ?? '').localeCompare(b?.data.name ?? ''));
};
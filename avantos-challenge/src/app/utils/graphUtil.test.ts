import { FormGraph } from '@/app/types/model';
import { findFormById, getFormDependencies, propagateEmailToDependents } from './graphUtil';

describe('graphUtil', () => {
  describe('findFormById', () => {
    it('should return the node with the matching id', () => {
      const nodes = [
        { id: '1', data: { name: 'Form A' } },
        { id: '2', data: { name: 'Form B' } },
      ];
      const result = findFormById(nodes, '1');
      expect(result).toEqual({ id: '1', data: { name: 'Form A' } });
    });

    it('should return null if no node matches the id', () => {
      const nodes = [
        { id: '1', data: { name: 'Form A' } },
        { id: '2', data: { name: 'Form B' } },
      ];
      const result = findFormById(nodes, '3');
      expect(result).toBeNull();
    });

    it('should handle an empty nodes array', () => {
      const nodes = [] as { id: string; data: { name: string } }[];
      const result = findFormById(nodes, '1');
      expect(result).toBeNull();
    });
  });

  describe('propagateEmailToDependents', () => {
    it('should update email for dependent forms', () => {
      const dependencies = {
        '2': ['Form A'],
        '3': ['Form A'],
      };
      const updatedValues: { [formId: string]: { [field: string]: string } } = {
        '2': { email: 'old@example.com' },
        '3': { email: 'old@example.com' },
      };
      const value = 'new@example.com';

      propagateEmailToDependents(dependencies, updatedValues, value);

      expect(updatedValues['2'].email).toBe('new@example.com');
      expect(updatedValues['3'].email).toBe('new@example.com');
    });

    it('should not update email for forms without dependencies on "Form A"', () => {
      const dependencies = {
        '2': ['Form B'],
        '3': ['Form C'],
      };
      const updatedValues: { [formId: string]: { [field: string]: string } } = {
        '2': { email: 'old@example.com' },
        '3': { email: 'old@example.com' },
      };
      const value = 'new@example.com';

      propagateEmailToDependents(dependencies, updatedValues, value);

      expect(updatedValues['2'].email).toBe('old@example.com');
      expect(updatedValues['3'].email).toBe('old@example.com');
    });

    it('should handle empty dependencies object', () => {
      const dependencies: { [key: string]: string[] } = {};
      const updatedValues: { [formId: string]: { [field: string]: string } } = {};
      const value = 'new@example.com';

      propagateEmailToDependents(dependencies, updatedValues, value);

      expect(updatedValues).toEqual({});
    });
  });

  describe('getFormDependencies', () => {
    it('should return all dependencies for a given form', () => {
      const formGraph = {
        nodes: {
          '1': { id: '1', data: { name: 'Form A', prerequisites: ['2'] } },
          '2': { id: '2', data: { name: 'Form B', prerequisites: [] } },
          '3': { id: '3', data: { name: 'Form C', prerequisites: ['1'] } },
        },
        edges: [],
      } as unknown as FormGraph;
      const result = getFormDependencies('1', formGraph);
      expect(result).toEqual(['2']);
    });

    it('should return an empty array for forms with no dependencies', () => {
      const formGraph = {
        nodes: {
          '1': { id: '1', data: { name: 'Form A', prerequisites: [] } },
        },
        edges: [],
      } as unknown as FormGraph;
      const result = getFormDependencies('1', formGraph);
      expect(result).toEqual([]);
    });
  });
});
import { findFormById, propagateEmailToDependents } from './graphUtil';

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
      const nodes: any[] = [];
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
      const formId = '1';
      const value = 'new@example.com';

      propagateEmailToDependents(dependencies, updatedValues, formId, value);

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
      const formId = '1';
      const value = 'new@example.com';

      propagateEmailToDependents(dependencies, updatedValues, formId, value);

      expect(updatedValues['2'].email).toBe('old@example.com');
      expect(updatedValues['3'].email).toBe('old@example.com');
    });

    it('should handle empty dependencies object', () => {
      const dependencies: { [key: string]: string[] } = {};
      const updatedValues: { [formId: string]: { [field: string]: string } } = {};
      const formId = '1';
      const value = 'new@example.com';

      propagateEmailToDependents(dependencies, updatedValues, formId, value);

      expect(updatedValues).toEqual({});
    });
  });
});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PrefillModal from './PrefillModal';
import { FormGraph, GlobalData } from '@/app/types/model';

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

const mockFormGraph: FormGraph = {
  nodes: {},
  edges: [],
};

const mockGlobalData: GlobalData = {
  id: 'global',
  data: { name: 'Global Data', prerequisites: [''] },
  fields: [
    { type: 'text', id: 'field1', name: 'Field 1' },
    { type: 'email', id: 'field2', name: 'Field 2' },
  ],
};

describe('PrefillModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the modal with the correct title', () => {
    render(
      <PrefillModal
        formId="form1"
        onClose={mockOnClose}
        onSave={mockOnSave}
        formGraph={mockFormGraph}
        globalData={mockGlobalData}
      />
    );

    expect(screen.getByText('Select data element to map')).toBeInTheDocument();
  });

  it('should call onClose when the Cancel button is clicked', () => {
    render(
      <PrefillModal
        formId="form1"
        onClose={mockOnClose}
        onSave={mockOnSave}
        formGraph={mockFormGraph}
        globalData={mockGlobalData}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should disable the Select button when no field is selected', () => {
    render(
      <PrefillModal
        formId="form1"
        onClose={mockOnClose}
        onSave={mockOnSave}
        formGraph={mockFormGraph}
        globalData={mockGlobalData}
      />
    );

    expect(screen.getByText('Select')).toBeDisabled();
  });

  it('should enable the Select button when a field is selected', () => {
    render(
      <PrefillModal
        formId="form1"
        onClose={mockOnClose}
        onSave={mockOnSave}
        formGraph={mockFormGraph}
        globalData={mockGlobalData}
      />
    );

    fireEvent.click(screen.getByText('▸ Global Data'));
    fireEvent.click(screen.getByText('Field 1'));
    expect(screen.getByText('Select')).not.toBeDisabled();
  });

  it('should call onSave with the selected field when the Select button is clicked', () => {
    render(
      <PrefillModal
        formId="form1"
        onClose={mockOnClose}
        onSave={mockOnSave}
        formGraph={mockFormGraph}
        globalData={mockGlobalData}
      />
    );

    fireEvent.click(screen.getByText('▸ Global Data'));
    fireEvent.click(screen.getByText('Field 1'));
    fireEvent.click(screen.getByText('Select'));

    expect(mockOnSave).toHaveBeenCalledWith({
      sourceFormId: 'global',
      sourceFieldId: 'field1',
    });
  });

  it('should filter fields based on the search input', () => {
    render(
      <PrefillModal
        formId="form1"
        onClose={mockOnClose}
        onSave={mockOnSave}
        formGraph={mockFormGraph}
        globalData={mockGlobalData}
      />
    );

    fireEvent.click(screen.getByText('▸ Global Data'));
    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: 'Field 2' },
    });

    expect(screen.queryByText('Field 1')).not.toBeInTheDocument();
    expect(screen.getByText('Field 2')).toBeInTheDocument();
  });

  it('should toggle the expansion of global data fields when clicked', () => {
    render(
      <PrefillModal
        formId="form1"
        onClose={mockOnClose}
        onSave={mockOnSave}
        formGraph={mockFormGraph}
        globalData={mockGlobalData}
      />
    );

    const globalDataHeader = screen.getByText('▸ Global Data');
    fireEvent.click(globalDataHeader);

    expect(screen.getByText('▾ Global Data')).toBeInTheDocument();
    expect(screen.getByText('Field 1')).toBeInTheDocument();
    expect(screen.getByText('Field 2')).toBeInTheDocument();

    fireEvent.click(globalDataHeader);
    expect(screen.getByText('▸ Global Data')).toBeInTheDocument();
    expect(screen.queryByText('Field 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Field 2')).not.toBeInTheDocument();
  });
});
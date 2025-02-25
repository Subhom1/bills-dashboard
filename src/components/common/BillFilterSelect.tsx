import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useRecoilValue, useRecoilState } from 'recoil';
import { billTypesSelector } from '@/state/selectors/billsSelector';
import { billsState } from '@/state/atoms/billsState';
import { Bill } from '@/types';
import { useBillFilter } from '@/hooks/useBillFilter';
import PropTypes from 'prop-types';

/**
 * Props for the bill filter dropdown
 * @param onFilterChange - Callback function that receives filtered bills and selected type
 */
interface BillFilterSelectProps {
  onFilterChange: (filteredBills: Bill[], type: string) => void;
}

/**
 * A dropdown component that lets users filter bills by their type.
 * Uses Material-UI's Select component with Recoil for state management.
 * 
 * Features:
 * - Shows all available bill types dynamically
 * - Maintains selected filter in local state
 * - Triggers parent callback when filter changes
 * - Uses custom hook for filtering logic
 */
export const BillFilterSelect: React.FC<BillFilterSelectProps> = ({ onFilterChange }) => {
  // Track which bill type is currently selected
  const [selectedType, setSelectedType] = React.useState<string>('');
  
  // Get unique bill types from our Recoil selector
  const billTypes = useRecoilValue(billTypesSelector);
  
  // Get all bills from Recoil state
  const [bills] = useRecoilState(billsState);
  
  // Use our custom hook to filter bills based on selected type
  const filteredBills = useBillFilter(bills, selectedType);

  /**
   * Handle changes to the filter dropdown
   * Updates local state and notifies parent component
   */
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const type = event.target.value as string;
    setSelectedType(type);
    onFilterChange(filteredBills, type);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
      {/* Label for the dropdown */}
      <InputLabel id="bill-type-filter-label">Filter by Bill Type</InputLabel>
      
      {/* Main dropdown component */}
      <Select
        labelId="bill-type-filter-label"
        id="bill-type-filter"
        value={selectedType}
        label="Filter by Bill Type"
        onChange={handleTypeChange}
        data-testid="bill-type-filter"
      >
        {/* Default option to show all bills */}
        <MenuItem value="All">
          <em>All</em>
        </MenuItem>
        
        {/* Generate menu items for each bill type */}
        {billTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Runtime props validation
BillFilterSelect.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};
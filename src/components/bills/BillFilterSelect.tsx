import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useRecoilValue, useRecoilState } from 'recoil';
import { billTypesSelector } from '@/state/selectors/billsSelector';
import { billsState } from '@/state/atoms/billsState';
import { Bill } from '@/types';
import { useBillFilter } from '@/hooks/useBillFilter';
interface BillFilterSelectProps {
  onFilterChange: (filteredBills: Bill[], type:string) => void;
}

export const BillFilterSelect: React.FC<BillFilterSelectProps> = ({ onFilterChange }) => {
  const [selectedType, setSelectedType] = React.useState<string>('');
  const billTypes = useRecoilValue(billTypesSelector);
  const [bills] = useRecoilState(billsState);

  const handleTypeChange = (event: any) => {
    const type = event.target.value as string;
    setSelectedType(type);
    const filteredBills = useBillFilter(bills, type);
    onFilterChange(filteredBills, type);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
      <InputLabel id="bill-type-filter-label">Filter by Bill Type</InputLabel>
      <Select
        labelId="bill-type-filter-label"
        id="bill-type-filter"
        value={selectedType}
        label="Filter by Bill Type"
        onChange={handleTypeChange}
      >
        <MenuItem value="All">
          <em>All</em>
        </MenuItem>
        {billTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
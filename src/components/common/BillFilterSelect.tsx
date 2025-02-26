import React,{useEffect} from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import PropTypes from "prop-types";

/**
 * Props for the bill status filter dropdown
 * @param onFilterChange - Callback function that receives filtered bills and selected status
 */
interface BillFilterSelectProps {
  onFilterChange: (status: string) => void;
  activeTab: number;
}

/**
 * A dropdown component that lets users filter bills by their status.
 * Uses Material-UI's Select component with Recoil for state management.
 *
 * Features:
 * - Shows all available bill statuses dynamically
 * - Maintains selected filter in local state
 * - Triggers parent callback when filter changes
 * - Uses custom hook for filtering logic
 */
export const BillFilterSelect: React.FC<BillFilterSelectProps> = ({
  onFilterChange,
  activeTab,
}) => {
  // Track which bill status is currently selected
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");

  // Predefined bill statuses
  const billStatuses = [
    "Current",
    "Withdrawn",
    "Enacted",
    "Rejected",
    "Defeated",
    "Lapsed",
  ];

  /**
   * Handle changes to the status filter dropdown
   * Updates local state and notifies parent component
   */
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const status = event.target.value as string;
    setSelectedStatus(status);
    onFilterChange(status);
  };
  useEffect(() => {
    setSelectedStatus("");
  }, [activeTab]);
  return (
    <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
      <InputLabel id="bill-status-filter-label">
        Filter by Bill Status
      </InputLabel>

      <Select
        labelId="bill-status-filter-label"
        id="bill-status-filter"
        value={selectedStatus}
        label="Filter by Bill Status"
        onChange={handleStatusChange}
        data-testid="bill-status-filter"
      >
        <MenuItem value="All">
          <em>All</em>
        </MenuItem>

        {billStatuses.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
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

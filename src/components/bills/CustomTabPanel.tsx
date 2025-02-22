import React from 'react';
import Box from '@mui/material/Box';

/**
 * Props for the CustomTabPanel component
 * @property {React.ReactNode} children - Content to be rendered inside the panel
 * @property {number} index - Unique identifier for this tab panel
 * @property {number} value - Currently selected tab index
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * CustomTabPanel Component
 * A memoized component that handles tab panel visibility and accessibility
 * 
 * Features:
 * - Shows/hides content based on selected tab
 * - Maintains proper ARIA attributes for accessibility
 * - Optimized with React.memo to prevent unnecessary re-renders
 * - Provides consistent padding and layout for tab content
 * 
 * @component
 * @param {TabPanelProps} props - Component properties
 * @returns {JSX.Element} Rendered tab panel with proper ARIA attributes
 */
export const CustomTabPanel = React.memo(function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel" // Semantic role for accessibility
      hidden={value !== index} // Hide panel when not selected
      id={`simple-tabpanel-${index}`} // Unique ID for ARIA relationships
      aria-labelledby={`simple-tab-${index}`} // Links panel to its tab
      {...other}
    >
      {/* Only render children when tab is selected to improve performance */}
      {value === index && (
        <Box sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
});
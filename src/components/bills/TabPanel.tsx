import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { mockBills } from "@/tests/mocks/mockBills";
import { BillsTable } from "./BillsTable";

/**
 * Props interface for the CustomTabPanel component
 * @interface TabPanelProps
 * @property {React.ReactNode} children - Child elements to be rendered inside the panel
 * @property {number} index - Index of the current tab panel
 * @property {number} value - Currently selected tab index
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * CustomTabPanel Component
 * Renders a tab panel that shows/hides content based on the selected tab
 * @param {TabPanelProps} props - Component props
 * @returns {JSX.Element} Rendered tab panel component
 */
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      
      {value === index && <Box sx={{ pt: 1, px:1 }}>{children}</Box>}
    </div>
  );
}

/**
 * Helper function to generate accessibility props for tabs
 * @param {number} index - Index of the tab
 * @returns {Object} Object containing aria and id properties
 */
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

/**
 * TabPanel Component
 * Main component that manages the bills and favorites tabs
 * Implements tab switching and content rendering logic
 * @returns {JSX.Element} Rendered tabs container with content
 */
export default function TabPanel() {
  // State to track the currently selected tab
  const [value, setValue] = React.useState(0);

  /**
   * Handle tab change event
   * @param {React.SyntheticEvent} event - The event object
   * @param {number} newValue - Index of the newly selected tab
   */
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className="min-h-[600px] min-w-[1100px] border rounded-md p-0" sx={{ borderRadius: 2 }}>
      {/* Tab navigation container */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          className="bg-gray-200 rounded-t-md"
          value={value}
          onChange={handleChange}
          aria-label="bill tabs"
        >
          <Tab label="Bills" {...a11yProps(0)} />
          <Tab label="Favourites" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {/* Tab content panels */}
      <CustomTabPanel value={value} index={0}>
        <BillsTable bills={mockBills[0].results.map((item) => item.bill)} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Favourites
      </CustomTabPanel>
    </Box>
  );
}

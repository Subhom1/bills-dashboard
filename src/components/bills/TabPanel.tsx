import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { mockBills } from "@/tests/mocks/mockBills";
import { BillsTable } from "./BillsTable";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TabPanel() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className="min-h-[600px] min-w-[1100px] border rounded-md p-0" sx={{ borderRadius: 2 }}>
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
      <CustomTabPanel value={value} index={0}>
        <BillsTable bills={mockBills[0].results.map((item) => item.bill)} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Favourites
      </CustomTabPanel>
    </Box>
  );
}

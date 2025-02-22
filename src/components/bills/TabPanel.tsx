import React, {useState, useEffect, useCallback, useRef} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { mockBills } from "@/tests/mocks/mockBills";
import { BillsTable } from "./BillsTable";
import { billsState } from "@/state/atoms/billsState";
import { billHeadState } from "@/state/atoms/billHeadState";
import { fetchBills } from "@/api/bills";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  favoriteBillsSelector,
  billTypesSelector,
} from "@/state/selectors/billsSelector";
import {TabContent} from './TabContent';
import {CustomTabPanel} from './CustomTabPanel';





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
  const [value, setValue] = useState(0);
  // State to store the list of bills
  const [bills, setBills] = useRecoilState(billsState);
  const [billHead, setBillHead] = useRecoilState(billHeadState);
  const [isLoading, setIsLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const favoriteBills = useRecoilValue(favoriteBillsSelector);
  const billTypes = useRecoilValue(billTypesSelector);
  // Use useRef to track if initial fetch has been made
  const initialFetchRef = useRef(false);
  // Fetch bills from the API on initial render
  useEffect(() => {
    const loadBills = async () => {
      if (initialFetchRef.current) return; // Skip if already fetched
      initialFetchRef.current = true;
      try {
        const response = await fetchBills(false, 10, 0);
        setBillHead(response.head);
        // Add isFavorite flag to each bill before saving to state
        const billsWithFavorites = response.results.map((item) => ({
          ...item.bill,
          isFavorite: false,
        }));
        setBills(billsWithFavorites);
      } catch (error) {
        console.error("Failed to fetch bills:", error);
      }
    };

    if (bills.length === 0) {
      loadBills();
    }
  }, [setBills, setBillHead, bills.length]);
  // Handle loading more bills
  const handleLoadMore = useCallback(
    async (newSkip: number) => {
      if (isLoading) return; // Prevent multiple calls while loading
      try {
        setIsLoading(true);
        const response = await fetchBills(false, 10, newSkip);
        const newBillsWithFavorites = response.results.map((item) => ({
          ...item.bill,
          isFavorite: false,
        }));
        setBills((prevBills) => [...prevBills, ...newBillsWithFavorites]);
        setSkip(newSkip);
      } catch (error) {
        console.error("Failed to fetch more bills:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, setBills]
  );
  /**
   * Handle tab change event
   * @param {React.SyntheticEvent} event - The event object
   * @param {number} newValue - Index of the newly selected tab
   */
  const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)},[]);
  return (
    <Box
      className="h-[650px] min-w-[1100px] border rounded-md p-0"
      sx={{ borderRadius: 2 }}
    >
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
        <TabContent
          bills={bills}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TabContent bills={favoriteBills} isLoading={isLoading} />
      </CustomTabPanel>
    </Box>
  );
}

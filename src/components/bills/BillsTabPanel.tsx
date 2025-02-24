import React, { useState, useEffect, useCallback, useRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { billsState } from "@/state/atoms/billsState";
import { billHeadState } from "@/state/atoms/billHeadState";
import { fetchBills } from "@/api/bills";
import { useRecoilState } from "recoil";
import { TabContent } from "./TabContent";
import { TabWrapper } from "./TabWrapper";
import { BillFilterSelect } from "@/components/common/BillFilterSelect";
import { favoriteBillsState } from "@/state/atoms/favoriteBillsState";
import { Bill, BillsResponseHead } from "@/types";
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
export default function BillsTabPanel() {
  const [value, setValue] = useState<number>(0);
  const [bills, setBills] = useRecoilState<Bill[]>(billsState);
  const [billHead, setBillHead] =
    useRecoilState<BillsResponseHead>(billHeadState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [favoriteBills, setFavoriteBills] =
    useRecoilState<Bill[]>(favoriteBillsState);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Use useRef to track if initial fetch has been made
  const initialFetchRef = useRef<boolean>(false);
  // Handler for filter changes
  const handleFilterChange = useCallback(
    (filteredBills: Bill[], type: string): void => {
      setFilteredBills(filteredBills);
      setActiveFilter(type);
    },
    []
  );

  // Fetch bills from the API on initial render
  useEffect(() => {
    const loadBills = async (): Promise<void> => {
      if (initialFetchRef.current) return; // Skip if already fetched
      initialFetchRef.current = true;
      try {
        const response = await fetchBills(false, 25, 0);
        setBillHead(response.head);
        // Add isFavorite flag to each bill before saving to state
        const billsWithFavorites = response.results.map((item) => ({
          ...item.bill,
          isFavorite: false,
        }));
        setBills(billsWithFavorites);
        setIsLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Failed to fetch bills:", error);
      }
    };

    if (bills.length === 0) {
      setIsLoading(true);
      loadBills();
    }
  }, [setBills, setBillHead, bills.length]);

  // Handle loading more bills
  const handleLoadMore = useCallback(
    async (newSkip: number): Promise<void> => {
      if (isLoading) return; // Prevent multiple calls while loading
      try {
        setIsLoading(true);
        const response = await fetchBills(false, 25, newSkip);
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
  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number): void => {
      setValue(newValue);
    },
    []
  );
  return (
    <Box
      className="h-[650px] min-w-[1100px] border rounded-md p-0"
      sx={{ borderRadius: 2 }}
    >
      {/* Tab navigation container */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "rgb(229 231 235)",
        }}
      >
        <Tabs
          className="bg-gray-200 rounded-t-md"
          value={value}
          onChange={handleChange}
          aria-label="bill tabs"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Tab label="Bills" {...a11yProps(0)} />
          <Tab label="Favourites" {...a11yProps(1)} />
        </Tabs>
        <BillFilterSelect onFilterChange={handleFilterChange} />
      </Box>

      {/* Tab content panels */}
      <TabWrapper value={value} index={0}>
        <TabContent
          bills={activeFilter !== "All" && activeFilter ? filteredBills : bills}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
        />
      </TabWrapper>
      <TabWrapper value={value} index={1}>
        <TabContent bills={favoriteBills} isLoading={isLoading} />
      </TabWrapper>
    </Box>
  );
}

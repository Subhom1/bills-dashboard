import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
  lazy,
} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { billsState } from "@/state/atoms/billsState";
import { billHeadState } from "@/state/atoms/billHeadState";
import { fetchBillsWithCache } from "@/api/bills";
import { useRecoilState } from "recoil";
import { TabContent } from "./TabContent";
import { TabWrapper } from "./TabWrapper";
import { favoriteBillsState } from "@/state/atoms/favoriteBillsState";
import { Bill, BillsResponseHead } from "@/types";
import Loader from "@/components/common/Loader";
import { fetchedPagesState } from "@/state/atoms/fetchedPagesState";
const BillFilterSelect = lazy(() =>
  import("@/components/common/BillFilterSelect").then((module) => ({
    default: module.BillFilterSelect,
  }))
);

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
  const [fetchedPages, setFetchedPages] = useRecoilState(fetchedPagesState);
  // Use useRef to track if initial fetch has been made
  const initialFetchRef = useRef<boolean>(false);
  // Handler for filter changes
  const handleFilterChange = useCallback(
    (filteredBills: Bill[], type: string): void => {
      setFilteredBills(filteredBills);
      setActiveFilter(type);
      setFetchedPages(new Set([0])); // Reset to initial page
    },
    [setFetchedPages]
  );

  // Fetch bills from the API on initial render
  useEffect(() => {
    const loadBills = async (): Promise<void> => {
      if (initialFetchRef.current) return; // Skip if already fetched
      initialFetchRef.current = true;
      try {
        const response = await fetchBillsWithCache(false, 25, 0);
        setBillHead(response?.head);
        // Add isFavorite flag to each bill before saving to state
        const billsWithFavorites = response?.results.map(
          (item: { bill: Bill }) => ({
            ...item.bill,
            isFavorite: false,
          })
        );
        setBills(billsWithFavorites);
        setIsLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Failed to fetch bills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (bills.length === 0) {
      setIsLoading(true);
      loadBills();
    }
  }, [setBills, setBillHead, bills.length]);

  /**
   * Loads more bills when user scrolls or requests next page
   * Handles pagination, deduplication, and state updates
   *
   * @param newSkip - Number of items to skip (pagination offset)
   * @returns Promise that resolves when new bills are loaded
   *
   * Key features:
   * - Prevents duplicate loading while in progress
   * - Uses cached data when available
   * - Deduplicates bills using URI as unique identifier
   * - Preserves existing bills while adding new ones
   * - Handles loading states and errors
   */
  const handleLoadMore = useCallback(
    async (newSkip: number): Promise<void> => {
      // Safety check - don't load if already in progress
      if (isLoading) return;

      try {
        // Show loading spinner while fetching
        setIsLoading(true);

        // Get next batch of bills, using cache if available
        const response = await fetchBillsWithCache(false, 25, newSkip);

        // Transform API response to add favorite flag
        const newBillsWithFavorites = response?.results.map(
          (item: { bill: Bill }) => ({
            ...item.bill,
            isFavorite: false,
          })
        );

        // Update bills state while removing duplicates
        setBills((prevBills) => {
          // Create Set of existing bill URIs for quick lookup
          const existingUris = new Set(prevBills.map((bill) => bill.uri));

          // Filter out any bills we already have
          const uniqueNewBills = newBillsWithFavorites.filter(
            (bill: Bill) => !existingUris.has(bill.uri)
          );

          // Combine existing and new bills
          return [...prevBills, ...uniqueNewBills];
        });

        // Update pagination offset
        setSkip(newSkip);
      } catch (error) {
        // Log any loading errors
        console.error("Failed to fetch more bills:", error);
      } finally {
        // Always hide loading spinner when done
        setIsLoading(false);
      }
    },
    // Only recreate if loading state or setBills function changes
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
      data-testid="bills-tab-panel"
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
        <Suspense fallback={<Loader />}>
          <BillFilterSelect onFilterChange={handleFilterChange} />{" "}
        </Suspense>
      </Box>

      {/* Tab content panels */}
      <TabWrapper value={value} index={0}>
        <TabContent
          bills={activeFilter !== "All" && activeFilter ? filteredBills : bills}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
          msg="No Bills Found"
          isFavoriteView={false}
        />
      </TabWrapper>
      <TabWrapper value={value} index={1}>
        <TabContent
          bills={favoriteBills}
          isLoading={isLoading}
          msg="No Favourite Bills Found"
          isFavoriteView={true}
        />
      </TabWrapper>
    </Box>
  );
}

import { Bill } from "@/types";

import { useMemo } from "react";

/**
 * Custom hook for filtering bills by type
 * @param {Bill[]} bills - Array of bills to filter
 * @param {string} filterType - Type to filter by
 * @returns {Bill[]} Filtered array of bills
 */
export const useBillFilter = (bills: Bill[], filterType: string): Bill[] => {
  return useMemo(() => {
    if (!filterType || filterType === "All") return bills;
    return bills.filter((bill) => bill.billType === filterType);
  }, [bills, filterType]);
};

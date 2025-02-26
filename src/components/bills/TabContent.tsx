import React from "react";
import { Bill } from "@/types";
import { BillsTable } from "./BillsTable";
import Loader from "@/components/common/Loader";
/**
 * Props interface for TabContent component
 * @property {Bill[]} bills - Array of bills to display
 * @property {Function} onLoadMore - Optional callback for loading more bills
 * @property {boolean} isLoading - Loading state flag
 */
interface TabContentProps {
  bills: Bill[];
  onLoadMore?: (skip: number) => Promise<void>;
  isLoading: boolean;
  msg:string;
  isFavoriteView:boolean;
}

/**
 * TabContent Component
 * Memoized component that renders either a loading state, empty state,
 * or bills table based on the current data and loading status
 *
 * @component
 * @param {TabContentProps} props - Component props
 * @returns {JSX.Element} Rendered content
 */
export const TabContent = React.memo(function TabContent({
  bills,
  onLoadMore,
  isLoading,
  msg,
  isFavoriteView
}: TabContentProps) {
  // Show loading or empty state when no bills are present
  if (!bills.length) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        {isLoading ? <Loader /> : msg}
      </div>
    );
  }

  // Render bills table when data is available
  return (
    <BillsTable bills={bills} onLoadMore={onLoadMore} isLoading={isLoading} isFavoriteView={isFavoriteView} />
  );
});

import BillsTabPanel from "@/components/bills/BillsTabPanel";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { JSX } from "react";

/**
 * Layout Component
 * Root layout component that structures the main application interface
 * Contains the header and the main content area with tabs
 *
 * Component Structure:
 * - Header: Displays the application title
 * - TabPanel: Contains the main bills and favorites tabs
 *
 * @returns {JSX.Element} The complete application layout
 */
export const Layout = (): JSX.Element => {
  const isOnline = useNetworkStatus();
  if (!isOnline) {
    return (
      <div className=" bg-gray-100 h-[650px] min-w-[1100px] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          You are offline
        </h1>
        <p className="text-gray-600">Please check your internet connection.</p>
      </div>
    );
  }
  return (
    <>
      {/* Application header with title */}
      <header
        className="text-left my-5 ml-5 font-semibold text-3xl"
        data-testid="layout-header"
      >
        Bills Dashboard
      </header>

      {/* Main content area with tab panels */}
      <BillsTabPanel />
    </>
  );
};

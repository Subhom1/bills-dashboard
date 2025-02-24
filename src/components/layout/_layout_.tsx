import BillsTabPanel from "@/components/bills/BillsTabPanel";

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
export const Layout = () => {
  return (
    <>
      {/* Application header with title */}
      <header className="text-left my-5 ml-5 font-semibold text-3xl">
        Bills Dashboard
      </header>

      {/* Main content area with tab panels */}
      <BillsTabPanel />
    </>
  );
};

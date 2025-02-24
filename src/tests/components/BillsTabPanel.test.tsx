// src/tests/components/TabPanel.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import BillsTabPanel from "@/components/bills/BillsTabPanel";
import { RecoilRoot } from "recoil";
import { mockBills } from "@/tests/mocks/mockBills";

/**
 * Test Suite for TabPanel Component
 * Verifies the functionality and accessibility of the tabbed interface
 * Tests include:
 * - Tab rendering and labeling
 * - Content switching behavior
 * - Accessibility compliance
 * - Styling and layout
 */
describe("TabPanel Component", () => {
  /**
   * Setup before each test
   * Renders the TabPanel within RecoilRoot for state management
   * Ensures a fresh component instance for each test
   */
  beforeEach(() => {
    render(
      <RecoilRoot>
        <BillsTabPanel />
      </RecoilRoot>
    );
  });

  /**
   * Test: Tab Labels
   * Verifies that both tabs are rendered with correct text labels
   * Ensures navigation options are visible to users
   */
  test("renders both tabs with correct labels", () => {
    expect(screen.getByText("Bills")).toBeInTheDocument();
    expect(screen.getByText("Favourites")).toBeInTheDocument();
  });

  /**
   * Test: Default Tab
   * Checks if Bills tab is displayed by default
   * Verifies correct ARIA labeling for initial render
   */
  test("displays Bills tab content by default", () => {
    const billsPanel = screen.getByRole("tabpanel");
    expect(billsPanel).toBeVisible();
    expect(billsPanel).toHaveAttribute("aria-labelledby", "simple-tab-0");
  });

  /**
   * Test: Tab Switching
   * Validates that clicking Favourites tab shows correct content
   * Checks proper ARIA attributes after tab switch
   */
  test("switches to Favourites tab when clicked", () => {
    const favouritesTab = screen.getByText("Favourites");
    fireEvent.click(favouritesTab);

    const favouritesPanel = screen.getByRole("tabpanel");
    expect(favouritesPanel).toBeVisible();
    expect(favouritesPanel).toHaveAttribute("aria-labelledby", "simple-tab-1");
    expect(favouritesPanel).toHaveTextContent("Favourites");
  });

  /**
   * Test: Accessibility
   * Ensures proper ARIA attributes for screen readers
   * Validates tab selection state indicators
   */
  test("maintains proper ARIA attributes for accessibility", () => {
    const tabList = screen.getByRole("tablist");
    expect(tabList).toHaveAttribute("aria-label", "bill tabs");

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });

  /**
   * Test: Styling
   * Verifies component renders with correct responsive classes
   * Checks minimum dimensions for proper layout
   */
  test("renders with correct styling classes", () => {
    const container = screen.getByRole("tabpanel").parentElement;
    expect(container).toHaveClass(
      "h-[650px]", "min-w-[1100px]", "border rounded-md", "p-0 MuiBox-root css-rl6otz"
    );
  });

  /**
   * Test: Bills Table Content
   * Validates that Bills tab contains the data table
   * Checks table accessibility attributes
   */
  test("shows bills table in Bills tab", () => {
    const billsTab = screen.getByText("Bills");
    fireEvent.click(billsTab);
    
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute("aria-label", "bills table");
  });
});
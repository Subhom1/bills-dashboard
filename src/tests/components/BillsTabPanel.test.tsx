import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BillsTabPanel from "@/components/bills/BillsTabPanel";
import { RecoilRoot } from "recoil";

/**
 * Test Suite for TabPanel Component
 * Verifies the functionality and accessibility of the tabbed interface.
 */
describe("TabPanel Component", () => {
  /**
   * Setup before each test
   * Ensures a fresh component instance for each test.
   */
  beforeEach(async () => {
    await waitFor(() =>
      render(
        <RecoilRoot>
          <BillsTabPanel />
        </RecoilRoot>
      )
    );
  });

  /**
   * Test: Tab Labels
   * Verifies that both tabs are rendered with correct text labels.
   */
  test("renders both tabs with correct labels", () => {
    expect(screen.getByText("Bills")).toBeInTheDocument();
    expect(screen.getByText("Favourites")).toBeInTheDocument();
  });

  /**
   * Test: Default Tab
   * Checks if the Bills tab is displayed by default.
   */
  test("displays Bills tab content by default", async () => {
    const billsPanel = await screen.findByRole("tabpanel");
    expect(billsPanel).toBeVisible();
    expect(billsPanel).toHaveAttribute("aria-labelledby", "simple-tab-0");
  });

  /**
   * Test: Tab Switching
   * Validates that clicking the Favourites tab shows correct content.
   */
  test("switches to Favourites tab when clicked", async () => {
    const favouritesTab = screen.getByText("Favourites");
    fireEvent.click(favouritesTab);

    const favouritesPanel = await screen.findByRole("tabpanel");

    expect(favouritesPanel).toBeVisible();
    expect(favouritesPanel).toHaveAttribute("aria-labelledby", "simple-tab-1");
    expect(favouritesPanel).toHaveTextContent("No Favourite Bills Found");
  });

  /**
   * Test: Accessibility
   * Ensures proper ARIA attributes for screen readers.
   */
  test("maintains proper ARIA attributes for accessibility", async () => {
    const tabList = screen.getByRole("tablist");
    expect(tabList).toHaveAttribute("aria-label", "bill tabs");

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });

  /**
   * Test: Styling
   * Verifies component renders with correct responsive classes.
   */
  test("renders with correct styling classes", async () => {
    const container = (await screen.findByRole("tabpanel")).parentElement;
    expect(container).toHaveClass(
      "h-[650px]",
      "min-w-[1100px]",
      "border",
      "rounded-md",
      "p-0"
    );
  });

  /**
   * Test: Bills Table Content
   * Validates that Bills tab contains the data table.
   */
  test("shows bills table in Bills tab", async () => {
    const billsTab = screen.getByText("Bills");
    fireEvent.click(billsTab);

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute("aria-label", "bills table");
  });
});

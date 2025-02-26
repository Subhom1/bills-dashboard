import { render, screen, fireEvent, act } from "@testing-library/react";
import BillsTabPanel from "@/components/bills/BillsTabPanel";
import { RecoilRoot } from "recoil";
import { mockBills } from "@/tests/mocks/mockBills";
import { fetchBillsWithCache } from "@/api/bills";

// Mock the fetchBills function
jest.mock("@/api/bills", () => ({
  fetchBillsWithCache: jest.fn(),
}));

describe("TabPanel Component", () => {
  beforeEach(async () => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock successful API response
    (fetchBillsWithCache as jest.Mock).mockResolvedValue({
      head: {
        counts: { billCount: 1, resultCount: 1 },
        dateRange: {
          start: "1900-01-01T00:00:00.000Z",
          end: "2099-01-01T00:00:00.000Z",
        },
        lang: "en",
      },
      results: mockBills[0].results,
    });

    await act(async () => {
      render(
        <RecoilRoot>
          <BillsTabPanel />
        </RecoilRoot>
      );
    });
  });

  //Test: Tab Labels
  //Verifies that both tabs are rendered with correct text labels.

  test("renders both tabs with correct labels", async () => {
    await act(async () => {
      expect(screen.getByText("Bills")).toBeInTheDocument();
      expect(screen.getByText("Favourites")).toBeInTheDocument();
    });
  });

  //Test: Default Tab
  //Checks if the Bills tab is displayed by default.
  test("displays Bills tab content by default", async () => {
    const billsPanel = await screen.findByRole("tabpanel");

    await act(async () => {
      expect(billsPanel).toBeVisible();
      expect(billsPanel).toHaveAttribute("aria-labelledby", "simple-tab-0");
    });
  });

  //Test: Tab Switching
  //Validates that clicking the Favourites tab shows correct content.
  test("switches to Favourites tab when clicked", async () => {
    const favouritesTab = await screen.findByText("Favourites");

    await act(async () => {
      fireEvent.click(favouritesTab);
    });

    const favouritesPanel = await screen.findByRole("tabpanel");

    await act(async () => {
      expect(favouritesPanel).toBeVisible();
      expect(favouritesPanel).toHaveAttribute(
        "aria-labelledby",
        "simple-tab-1"
      );
      expect(favouritesPanel).toHaveTextContent("No Favourite Bills Found");
    });
  });

  //Test: Accessibility
 //Ensures proper ARIA attributes for screen readers.

  test("maintains proper ARIA attributes for accessibility", async () => {
    const tabList = await screen.findByRole("tablist");

    await act(async () => {
      expect(tabList).toHaveAttribute("aria-label", "bill tabs");
    });

    const tabs = await screen.findAllByRole("tab");

    await act(async () => {
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    });
  });

  //Test: Styling
  // Verifies component renders with correct responsive classes.

  test("renders with correct styling classes", async () => {
    const container = (await screen.findByRole("tabpanel")).parentElement;

    await act(async () => {
      expect(container).toHaveClass(
        "h-[650px]",
        "min-w-[1100px]",
        "border",
        "rounded-md",
        "p-0"
      );
    });
  });
});

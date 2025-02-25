import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { Layout } from "@/components/layout/_layout_";
import { RecoilRoot } from "recoil";
import { billsState } from "@/state/atoms/billsState";
import { billHeadState } from "@/state/atoms/billHeadState";
import { mockBills } from "@/tests/mocks/mockBills";
import * as billsApi from "@/api/bills";

// Replace all API calls with mock functions to avoid real network requests
jest.mock("@/api/bills", () => ({
  fetchBills: jest.fn(),
  favoriteService: {
    toggleFavorite: jest.fn(),
  },
}));

describe("Layout Component", () => {
  beforeEach(() => {
    // Before each test, set up a fake successful API response
    // This simulates the bills data we'd normally get from the server
    (billsApi.fetchBills as jest.Mock).mockResolvedValue(mockBills[0]);
  });

  afterEach(() => {
    // Clean up DOM and reset all mocks after each test
    // This prevents tests from affecting each other
    cleanup();
    jest.clearAllMocks();
  });

  // Helper function to render our component with necessary providers and state
  const renderComponent = (children?: React.ReactNode) => {
    return render(
      <RecoilRoot
        initializeState={({ set }) => {
          // Initialize bills state with mock data and no favorites
          set(
            billsState,
            mockBills[0].results.map((item) => ({
              ...item.bill,
              isFavorite: false,
            }))
          );

          // Set up initial bill metadata like counts and date range
          set(billHeadState, {
            counts: {
              billCount: 5, // Total number of bills
              resultCount: 5, // Number of bills in current view
            },
            dateRange: {
              start: "1900-01-01T00:00:00.000Z", // Start of date range
              end: "2099-01-01T00:00:00.000Z", // End of date range
            },
            lang: "en", // Default language
          });
        }}
      >
        <Layout />
      </RecoilRoot>
    );
  };

  describe("Layout header", () => {
    // Verify that the main header shows up with correct text
    test("renders header with dashboard title", async () => {
      renderComponent();
      await waitFor(() => {
        const header = screen.getByTestId("layout-header");
        expect(header).toHaveTextContent("Bills Dashboard");
      });
    });

    // Make sure the main bills panel is displayed
    test("render bills tab panel", async () => {
      renderComponent();
      await waitFor(() => {
        const tabPanel = screen.getByTestId("bills-tab-panel");
        expect(tabPanel).toBeInTheDocument();
      });
    });
  });
});

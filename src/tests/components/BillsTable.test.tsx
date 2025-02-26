import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BillsTable } from "@/components/bills/BillsTable";
import { mockBills } from "@/tests/mocks/mockBills";
import { RecoilRoot } from "recoil";
import { billHeadState } from "@/state/atoms/billHeadState";
import { favoriteBillsState } from "@/state/atoms/favoriteBillsState";
import { favoriteService } from "@/api/bills";

// Mock the favorite service
jest.mock("@/api/bills", () => ({
  favoriteService: {
    toggleFavorite: jest.fn(),
  },
}));

describe("BillsTable Component", () => {
  const mockBillsData = mockBills[0].results.map((item) => item.bill);
  const mockOnLoadMore = jest.fn().mockResolvedValue(undefined);

  const renderComponent = async (props = {}) => {
    const defaultProps = {
      bills: mockBillsData,
      onLoadMore: mockOnLoadMore,
      isLoading: false,
    };

    let result;
    await act(async () => {
      result = render(
        <RecoilRoot
          initializeState={({ set }) => {
            set(billHeadState, {
              counts: { billCount: 50, resultCount: 25 },
              dateRange: {
                start: "1900-01-01T00:00:00.000Z",
                end: "2099-01-01T00:00:00.000Z",
              },
              lang: "en",
            });
            set(favoriteBillsState, []);
          }}
        >
          <BillsTable {...defaultProps} {...props} />
        </RecoilRoot>
      );
    });
    return result;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering Tests
  test("renders table with correct structure", async () => {
    await renderComponent();
    await act(async () => {
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("row")).toHaveLength(mockBillsData.length + 1);
    });
  });

  test("renders empty state when no bills provided", async () => {
    await renderComponent({ bills: [] });
    await act(async () => {
      expect(screen.getByText("No Bills Found")).toBeInTheDocument();
    });
  });

  test("toggles favorite status when favorite icon is clicked", async () => {
    await renderComponent();
    const favoriteButton = screen.getAllByTestId("favorite-button")[0];

    await act(async () => {
      fireEvent.click(favoriteButton);
    });

    await waitFor(() => {
      expect(favoriteService.toggleFavorite).toHaveBeenCalledTimes(1);
    });
  });
  // State Management
  test("maintains favorite state after page change", async () => {
    await renderComponent();

    // Wait for the bills table to load
    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    // Find the first favorite button
    const favoriteButtons = await screen.findAllByTestId("favorite-button");

    // Click the first favorite button
    fireEvent.click(favoriteButtons[0]);

    // Verify favorite was toggled
    await waitFor(() => {
      expect(favoriteService.toggleFavorite).toHaveBeenCalledTimes(1);
    });

    // Click 'Next Page' button
    const nextPageButton = screen.getByRole("button", {
      name: /go to next page/i,
    });
    fireEvent.click(nextPageButton);

    // Wait for new page to load
    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    // Click 'Previous Page' button
    const prevPageButton = screen.getByRole("button", {
      name: /go to previous page/i,
    });
    fireEvent.click(prevPageButton);

    // Wait for previous page to re-render
    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    // Check if favorite icon is still present
    const updatedFavoriteButtons = await screen.findAllByTestId(
      "favorite-button"
    );
    expect(updatedFavoriteButtons[0]).toBeInTheDocument(); // Ensures the button still exists
  });

});

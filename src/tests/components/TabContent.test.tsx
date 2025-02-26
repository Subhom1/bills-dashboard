import { render, screen } from "@testing-library/react";
import { TabContent } from "@/components/bills/TabContent";
import { Bill } from "@/types";
import { BillsTable } from "@/components/bills/BillsTable";
import { mockBills } from "@/tests/mocks/mockBills";

// Ensure mockBills is correctly typed as Bill[]
// This line performs a type assertion to ensure that the mockBills data is treated as an array of Bill objects (Bill[]).
// TypeScript's type assertion is used here to explicitly tell the compiler that mockBills should be treated as Bill[].
// The 'as unknown' part is an intermediate step to bypass TypeScript's type checking, casting mockBills to the unknown type first.
// Then, it casts the result to Bill[], ensuring that the mock data is correctly typed for use in the tests.
// This helps with type safety and prevents type-related errors, ensuring that the bills prop in the TabContent component is correctly typed as Bill[].
const typedMockBills: Bill[] = mockBills as unknown as Bill[];

// Mock the Loader component to isolate the TabContent component for testing
jest.mock("@/components/common/Loader", () => () => <div>Loading...</div>);

// Mock the BillsTable component to isolate the TabContent component for testing
jest.mock("@/components/bills/BillsTable", () => ({
  BillsTable: jest.fn(() => <div>Bills Table</div>),
}));

describe("TabContent", () => {
  // Define default props to use in the tests to avoid repetition
  const defaultProps = {
    bills: [] as Bill[],
    onLoadMore: jest.fn(),
    isLoading: false,
    msg: "No bills found",
    isFavoriteView: false,
    isFilterOn: false,
    filteredBillLength: 0,
  };

  // Test case to verify that the loading state is rendered when isLoading is true and no bills are present
  it("renders loading state when isLoading is true and no bills are present", () => {
    render(<TabContent {...defaultProps} isLoading={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // Test case to verify that the empty state message is rendered when no bills are present and isLoading is false
  it("renders empty state message when no bills are present and not loading", () => {
    render(<TabContent {...defaultProps} />);
    expect(screen.getByText("No bills found")).toBeInTheDocument();
  });

  // Test case to verify that the BillsTable component is rendered when bills are present
  it("renders BillsTable when bills are present", () => {
    const bills: Bill[] = typedMockBills;
    render(<TabContent {...defaultProps} bills={bills} />);
    expect(screen.getByText("Bills Table")).toBeInTheDocument();
  });

  // Test case to verify that the correct props are passed to the BillsTable component
  it("passes correct props to BillsTable", () => {
    const bills: Bill[] = typedMockBills;
    render(
      <TabContent
        {...defaultProps}
        bills={bills}
        isLoading={true}
        isFavoriteView={true}
        isFilterOn={true}
        filteredBillLength={10}
      />
    );
    expect(BillsTable).toHaveBeenCalledWith(
      expect.objectContaining({
        bills,
        onLoadMore: defaultProps.onLoadMore,
        isLoading: true,
        isFavoriteView: true,
        isFilterOn: true,
        filteredBillLength: 10,
      }),
      {}
    );
  });
});

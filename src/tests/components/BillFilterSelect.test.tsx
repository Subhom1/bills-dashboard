// src/tests/components/BillFilterSelect.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { BillFilterSelect } from "@/components/common/BillFilterSelect";
import { RecoilRoot } from "recoil";
import { billsState } from "@/state/atoms/billsState";
import { mockBills } from "@/tests/mocks/mockBills";

describe("BillFilterSelect Component", () => {
  const mockOnFilterChange = jest.fn();
  const mockBillsData = mockBills[0].results.map((item) => item.bill);

  beforeEach(() => {
    // Initialize with mock data
    const initializeState = ({ set }: any) => {
      set(billsState, mockBillsData);
    };

    render(
      <RecoilRoot initializeState={initializeState}>
        <BillFilterSelect onFilterChange={mockOnFilterChange} />
      </RecoilRoot>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders select component with label", () => {
    expect(screen.getByLabelText("Filter by Bill Type")).toBeInTheDocument();
  });

  test("includes 'All' option in select", () => {
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  test("renders unique bill types as options", () => {
    // Get unique bill types from mock data
    const uniqueTypes = Array.from(
      new Set(mockBillsData.map((bill) => bill.billType))
    );

    // Check if each unique type is rendered as an option
    uniqueTypes.forEach((type) => {
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });

  test("calls onFilterChange when selection changes", () => {
    const select = screen.getByLabelText("Filter by Bill Type");
    const billType = mockBillsData[0].billType;

    fireEvent.change(select, { target: { value: billType } });

    expect(mockOnFilterChange).toHaveBeenCalled();
    // First argument should be filtered bills array
    expect(mockOnFilterChange.mock.calls[0][0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ billType: billType })
      ])
    );
    // Second argument should be selected type
    expect(mockOnFilterChange.mock.calls[0][1]).toBe(billType);
  });

  test("filters bills correctly when type is selected", () => {
    const select = screen.getByLabelText("Filter by Bill Type");
    const billType = mockBillsData[0].billType;

    fireEvent.change(select, { target: { value: billType } });

    const expectedFilteredBills = mockBillsData.filter(
      (bill) => bill.billType === billType
    );

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expectedFilteredBills,
      billType
    );
  });

  test("shows all bills when 'All' is selected", () => {
    const select = screen.getByLabelText("Filter by Bill Type");

    // First select a specific type
    const billType = mockBillsData[0].billType;
    fireEvent.change(select, { target: { value: billType } });

    // Then select 'All'
    fireEvent.change(select, { target: { value: "All" } });

    expect(mockOnFilterChange).toHaveBeenLastCalledWith(
      mockBillsData,
      "All"
    );
  });

  test("maintains selected value after change", () => {
    const select = screen.getByLabelText("Filter by Bill Type");
    const billType = mockBillsData[0].billType;

    fireEvent.change(select, { target: { value: billType } });

    expect(select).toHaveValue(billType);
  });
});
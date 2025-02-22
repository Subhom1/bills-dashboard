import { render, screen } from "@testing-library/react";
import { BillsTable } from "@/components/bills/BillsTable";
import { mockBills } from "@/tests/mocks/mockBills";
import { RecoilRoot } from "recoil";

/**
 * Test Suite for BillsTable Component
 * Tests the rendering and functionality of the bills table
 * Includes tests for:
 * - Header rendering
 * - Accessibility attributes
 * - Component structure
 * - Content display
 */
describe("BillsTable Component", () => {
  // Prepare mock data for testing
  const mockBillsData = mockBills[0].results.map((item) => item.bill);

  /**
   * Setup before each test
   * Renders the BillsTable component within RecoilRoot
   * to provide necessary context for state management
   */
  beforeEach(() => {
    render(
      <RecoilRoot>
        <BillsTable bills={mockBillsData} />
      </RecoilRoot>
    );
  });

  /**
   * Test: Header Text Content
   * Verifies that all expected column headers are present
   * and displayed with correct text content
   */
  test("renders table headers correctly", () => {
    expect(screen.getByText("Bill Number")).toBeInTheDocument();
    expect(screen.getByText("Bill Type")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Sponsor")).toBeInTheDocument();
    expect(screen.getByText("Favorite")).toBeInTheDocument();
  });

  /**
   * Test: Accessibility
   * Ensures the table has proper aria-label for screen readers
   */
  test("renders table with correct aria-label", () => {
    expect(screen.getByRole("table")).toHaveAttribute(
      "aria-label",
      "bills table"
    );
  });

  /**
   * Test: Component Structure
   * Verifies that the table is wrapped in a Paper component
   * for proper Material-UI styling and elevation
   */
  test("renders in a Paper component", () => {
    const paperElement = screen.getByTestId("bills-table-paper");
    expect(paperElement).toBeInTheDocument();
  });

  /**
   * Test: Table Structure
   * Checks if the table element is present in the document
   * and maintains minimum width requirement
   */
  test("table has minimum width", () => {
    const tableElement = screen.getByRole("table");
    expect(tableElement).toBeInTheDocument();
  });

  /**
   * Test: Header Content
   * Validates that header cells contain the expected text
   * in the correct order for proper table structure
   */
  test("header cells have correct content", () => {
    const headerCells = screen.getAllByRole("columnheader");
    const expectedHeaders = ["Bill Number", "Bill Type", "Status", "Sponsor", "Favorite"];
    
    headerCells.forEach((cell, index) => {
      expect(cell).toHaveTextContent(expectedHeaders[index]);
    });
  });
});
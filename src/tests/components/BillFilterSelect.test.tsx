import { render, screen, fireEvent } from "@testing-library/react";
import { BillFilterSelect } from "@/components/common/BillFilterSelect";

describe("BillFilterSelect", () => {
  // Define default props to use in the tests to avoid repetition
  const defaultProps = {
    onFilterChange: jest.fn(),
    activeTab: 0,
  };

  // Test case to verify that the component renders without crashing
  it("renders without crashing", () => {
    render(<BillFilterSelect {...defaultProps} />);
    expect(screen.getByLabelText("Filter by Bill Status")).toBeInTheDocument();
  });

  // Test case to verify that all bill statuses are displayed in the dropdown
  it("displays all bill statuses in the dropdown", () => {
    render(<BillFilterSelect {...defaultProps} />);
    // Open the dropdown
    fireEvent.mouseDown(screen.getByLabelText("Filter by Bill Status"));
    // Get all options in the dropdown
    const options = screen.getAllByRole("option");
    // Verify the number of options (6 statuses + 1 "All" option)
    expect(options).toHaveLength(7);
    // Verify the text content of each option
    expect(options[0]).toHaveTextContent("All");
    expect(options[1]).toHaveTextContent("Current");
    expect(options[2]).toHaveTextContent("Withdrawn");
    expect(options[3]).toHaveTextContent("Enacted");
    expect(options[4]).toHaveTextContent("Rejected");
    expect(options[5]).toHaveTextContent("Defeated");
    expect(options[6]).toHaveTextContent("Lapsed");
  });

  // Test case to verify that the onFilterChange function is called with the selected status
  it("calls onFilterChange with the selected status", () => {
    render(<BillFilterSelect {...defaultProps} />);
    // Open the dropdown
    fireEvent.mouseDown(screen.getByLabelText("Filter by Bill Status"));
    // Select the "Enacted" option
    fireEvent.click(screen.getByText("Enacted"));
    // Verify that onFilterChange is called with "Enacted"
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("Enacted");
  });

  // Test case to verify that the selected status is reset when the active tab changes
  it("resets the selected status when the active tab changes", () => {
    const { rerender } = render(<BillFilterSelect {...defaultProps} />);
    // Open the dropdown
    fireEvent.mouseDown(screen.getByLabelText("Filter by Bill Status"));
    // Select the "Enacted" option
    fireEvent.click(screen.getByText("Enacted"));
    // Verify that the selected status is "Enacted"
    expect(screen.getByLabelText("Filter by Bill Status")).toHaveTextContent(
      "Enacted"
    );

    // Change the active tab and re-render the component
    rerender(<BillFilterSelect {...defaultProps} activeTab={1} />);
    // Verify that the selected status is reset to "All"
    expect(screen.getByLabelText("Filter by Bill Status")).toHaveTextContent(
      "All"
    );
  });
});

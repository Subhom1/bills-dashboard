import { render, screen, fireEvent } from "@testing-library/react";
import { ModalTabPanel } from "@/components/common/ModalTabPanel";
import { Bill } from "@/types";

describe("ModalTabPanel", () => {
  // Define a mock bill object with all necessary properties
  const mockBill: Bill = {
    billNo: "1",
    billType: "Type1",
    status: "Status1",
    sponsors: [],
    uri: "uri1",
    shortTitleEn: "Short Title English",
    longTitleEn: "<p>Long Title English</p>",
    shortTitleGa: "Short Title Irish",
    longTitleGa: "<p>Long Title Irish</p>",
    act: null,
    amendmentLists: [],
    billTypeURI: "",
    billYear: "",
    debates: [],
    events: [],
    lastUpdated: "",
    method: "",
    methodURI: "",
    mostRecentStage: {
      event: {
        chamber: {
          showAs: "",
          uri: "",
        },
        dates: [],
        house: {
          chamberCode: "",
          chamberType: "",
          houseCode: "",
          houseNo: "",
          showAs: "",
          uri: "",
        },
        progressStage: 0,
        showAs: "",
        stageCompleted: false,
        stageOutcome: null,
        stageURI: "",
        uri: "",
      },
    },
    originHouse: {
      showAs: "",
      uri: "",
    },
    originHouseURI: "",
    relatedDocs: [],
    source: "",
    sourceURI: "",
    stages: [],
  };

  // Define default props to use in the tests to avoid repetition
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    bill: mockBill,
  };

  // Test case to verify that the component renders without crashing
  it("renders without crashing", () => {
    render(<ModalTabPanel {...defaultProps} />);
    expect(screen.getByText("Short Title English")).toBeInTheDocument();
  });

  // Test case to verify that the English title and content are displayed by default
  it("displays the English title and content by default", () => {
    render(<ModalTabPanel {...defaultProps} />);
    expect(screen.getByText("Short Title English")).toBeInTheDocument();
    expect(screen.getByText("Long Title English")).toBeInTheDocument();
  });

  // Test case to verify that the content switches to Irish when the Irish tab is clicked
  it("switches to Irish content when the Irish tab is clicked", () => {
    render(<ModalTabPanel {...defaultProps} />);
    fireEvent.click(screen.getByText("Gaeilge"));
    expect(screen.getByText("Short Title Irish")).toBeInTheDocument();
    expect(screen.getByText("Long Title Irish")).toBeInTheDocument();
  });

  // Test case to verify that the onClose function is called when the close button is clicked
  it("calls onClose when the close button is clicked", () => {
    render(<ModalTabPanel {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("close dialog"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  // Test case to verify that nothing is rendered when no bill is selected
  it("does not render anything when no bill is selected", () => {
    const { container } = render(
      <ModalTabPanel {...defaultProps} bill={null} />
    );
    expect(container.firstChild).toBeNull();
  });
});

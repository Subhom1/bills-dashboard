import Paper from "@mui/material/Paper";
import { Bill } from "../../types/index";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

/**
 * Props interface for the BillsTable component
 * @interface BillsTableProps
 * @property {Bill[]} bills - Array of bill objects to display in the table
 */
interface BillsTableProps {
  bills: Bill[];
}

/**
 * BillsTable Component
 * Displays a responsive table of bills with pagination and favorite functionality
 * @param {BillsTableProps} props - Component props
 * @returns {JSX.Element} Rendered table component
 */
export const BillsTable = ({ bills }: BillsTableProps) => {
  return (
    <Paper
      sx={{ width: "100%", overflow: "hidden" }}
      data-testid="bills-table-paper"
    >
      {/* Container with max height to enable scrolling */}
      <TableContainer sx={{ maxHeight: "calc(100vh - 100px)" }}>
        <Table
          stickyHeader
          sx={{
            minWidth: 650,
            // Responsive cell styling for different screen sizes
            "& .MuiTableCell-root": {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: {
                xs: "100px", // Mobile view
                sm: "150px", // Tablet view
                md: "200px", // Desktop view
              },
            },
          }}
          aria-label="bills table"
        >
          {/* Table header with fixed column names */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Bill Number</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Bill Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Sponsor</TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", width: "80px" }}
              >
                Favorite
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Table body content will be populated with bill data */}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

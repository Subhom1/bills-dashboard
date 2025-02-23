import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import { Bill } from "../../types/index";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import {useRecoilValue} from "recoil";
import {billHeadState} from "@/state/atoms/billHeadState";
/**
 * Props interface for the BillsTable component
 * @interface BillsTableProps
 * @property {Bill[]} bills - Array of bill objects to display in the table
 */
interface BillsTableProps {
  bills: Bill[];
  onLoadMore?: (skip: number) => Promise<void>;
  isLoading?: boolean;
}

/**
 * BillsTable Component
 * Displays a responsive table of bills with pagination and favorite functionality
 * @param {BillsTableProps} props - Component props
 * @returns {JSX.Element} Rendered table component
 */
export const BillsTable = ({
  bills,
  onLoadMore,
  isLoading,
}: BillsTableProps) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 25; // Fixed number of rows per page
  const billHead = useRecoilValue(billHeadState);

  // Calculate the bills to display on the current page
  const displayedBills = bills.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  // Handle page change event
  const handleChangePage = async (event: unknown, newPage: number) => {
    if (isLoading) return; // Prevent multiple calls while loading
    setPage(newPage);

    // Only fetch more data when moving forward and onLoadMore is provided
    if (newPage > page && onLoadMore) {
      const newSkip = newPage * rowsPerPage;
      await onLoadMore(newSkip);
    }
  };
  return (
    <Paper
      sx={{
        width: "100%",
        height: "calc(650px - 70px)", // 650px is tab panel height, 70px is tabs height
        display: "flex",
        flexDirection: "column",
      }}
      data-testid="bills-table-paper"
    >
      {/* Container with max height to enable scrolling */}
      <TableContainer
        sx={{
          height: "calc(100% - 52px)", // Full height minus pagination height
          overflow: "auto",
        }}
      >
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
              <TableCell sx={{ fontWeight: "bold", width: "100px" }}>Bill Number</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "100px" }}>Bill Type</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "100px" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "300px" }}>Sponsor</TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", width: "100px" }}
              >
                Favorite
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedBills.length ? (
              displayedBills.map((bill) => (
                <TableRow
                  key={bill.uri + Math.random()}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {bill.billNo}
                  </TableCell>
                  <TableCell>{bill.billType}</TableCell>
                  <TableCell>{bill.status}</TableCell>
                  <TableCell>
                    {bill.sponsors[0]?.sponsor.as.showAs || "No sponsor"}
                  </TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={5} 
                  align="center" 
                  sx={{ 
                  height: '500px',
                  verticalAlign: 'middle'
                  }}
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={billHead?.counts?.billCount || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
        labelRowsPerPage={""}
        disabled={isLoading}
      />
    </Paper>
  );
};

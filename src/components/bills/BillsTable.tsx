import React, { useState, Suspense, lazy, useCallback } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { useRecoilValue, useRecoilState } from "recoil";
import { billHeadState } from "@/state/atoms/billHeadState";
import PropTypes from "prop-types";
import { Bill } from "@/types";
import { PAGINATION } from "@/constants";
import Loader from "@/components/common/Loader";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { favoriteBillsState } from "@/state/atoms/favoriteBillsState";
import { favoriteService } from "@/api/bills";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { fetchedPagesState } from '@/state/atoms/fetchedPagesState';

const ModalTabPanel = React.lazy(() => 
  import('@/components/common/ModalTabPanel').then(module => ({
    default: module.ModalTabPanel
  }))
);
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
  onLoadMore = undefined,
  isLoading = false,
}: BillsTableProps) => {
  const [page, setPage] = useState(0);
  const [fetchedPages, setFetchedPages] = useRecoilState(fetchedPagesState);
  const rowsPerPage = PAGINATION.ROWS_PER_PAGE; // Fixed number of rows per page
  const billHead = useRecoilValue(billHeadState);
  const [favoriteBills, setFavoriteBills] = useRecoilState(favoriteBillsState);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFavoriteClick = async (bill: Bill) => {
    try {
      const isFavorite = !favoriteBills.some(fav => fav.uri === bill.uri);
      
      // Update UI immediately for better UX
      setFavoriteBills(prevFavorites => {
        if (isFavorite) {
          return [...prevFavorites, bill];
        }
        return prevFavorites.filter(fav => fav.uri !== bill.uri);
      });

      // Call mock service
      await favoriteService.toggleFavorite(bill, isFavorite);
      
    } catch (error) {
      console.error('Failed to update favorite status:', error);
      // Revert UI state on error
      setFavoriteBills(prevFavorites => {
        if (favoriteBills.some(fav => fav.uri === bill.uri)) {
          return prevFavorites.filter(fav => fav.uri !== bill.uri);
        }
        return [...prevFavorites, bill];
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBill(null);
  };

  const handleRowClick = (event: React.MouseEvent, bill: Bill) => {
    // Check if click is on the last cell (favorite column)
    const isLastCell = (event.target as HTMLElement).closest(
      "td:last-child, th:last-child"
    );
    if (!isLastCell) {
      setSelectedBill(bill);
      setModalOpen(true);
    }
  };

  // Calculate the bills to display on the current page
  const displayedBills = bills.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  // Handle page change event
  const handleChangePage = useCallback(
    async (_: unknown, newPage: number) => {
      setPage(newPage);
      
      // Calculate the skip value based on page number
      const skip = newPage * rowsPerPage;
      
      // Check if we already have this page's data
      if (!fetchedPages.has(newPage) && onLoadMore) {
        try {
          await onLoadMore(skip);
          // Add this page to fetched pages
          setFetchedPages(prev => new Set(prev).add(newPage));
        } catch (error) {
          console.error('Failed to load more bills:', error);
        }
      }
    },
    [onLoadMore, rowsPerPage, fetchedPages, setFetchedPages]
  );

  return (
    <>
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
                <TableCell sx={{ fontWeight: "bold", width: "100px" }}>
                  Bill Number
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "100px" }}>
                  Bill Type
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "100px" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "300px" }}>
                  Sponsor
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", width: "100px" }}
                >
                  Favorite
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : displayedBills.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{
                      height: "400px",
                      verticalAlign: "middle",
                      border: "none",
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-gray-500 text-lg">
                        No Bills Found
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                displayedBills.map((bill) => (
                  <TableRow
                    key={bill.uri + Math.random()}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: favoriteBills.some(
                          (fav) => fav.uri === bill.uri
                        )
                          ? "rgba(244, 67, 54, 0.1)"
                          : "rgba(0, 0, 0, 0.04)",
                      },
                      "&:last-child td, &:last-child th": { border: 0 },
                      "& td:last-child": {
                        cursor: "default",
                      },
                      backgroundColor: favoriteBills.some(
                        (fav) => fav.uri === bill.uri
                      )
                        ? "rgba(244, 67, 54, 0.1)"
                        : "inherit",
                    }}
                    onClick={(e) => handleRowClick(e, bill)}
                  >
                    <TableCell component="th" scope="row">
                      {bill.billNo}
                    </TableCell>
                    <TableCell>{bill.billType}</TableCell>
                    <TableCell>{bill.status}</TableCell>
                    <TableCell>
                      {bill.sponsors[0]?.sponsor.as.showAs || "No sponsor"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteClick(bill);
                        }}
                        aria-label="toggle favorite"
                        size="small"
                        color="error"
                      >
                        {favoriteBills.some((fav) => fav.uri === bill.uri) ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
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
      <Suspense fallback={<Loader />}>
        <ModalTabPanel
          open={modalOpen}
          onClose={handleCloseModal}
          bill={selectedBill}
        />
      </Suspense>
    </>
  );
};

BillsTable.propTypes = {
  bills: PropTypes.arrayOf(
    PropTypes.shape({
      billNo: PropTypes.string.isRequired,
      billType: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      sponsors: PropTypes.arrayOf(
        PropTypes.shape({
          sponsor: PropTypes.shape({
            as: PropTypes.shape({
              showAs: PropTypes.string,
            }),
          }),
        })
      ).isRequired,
      uri: PropTypes.string.isRequired,
      isFavorite: PropTypes.bool,
    })
  ).isRequired,
  onLoadMore: PropTypes.func,
  isLoading: PropTypes.bool,
};

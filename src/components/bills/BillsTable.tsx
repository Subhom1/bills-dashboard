import React, {
  useState,
  Suspense,
  lazy,
  useCallback,
  JSX,
  useEffect,
  useMemo,
  memo,
} from "react";
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
import { fetchedPagesState } from "@/state/atoms/fetchedPagesState";

const ModalTabPanel = lazy(() =>
  import("@/components/common/ModalTabPanel").then((module) => ({
    default: module.ModalTabPanel,
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
  isFavoriteView?: boolean;
  isFilterOn?: boolean;
  filteredBillLength?: number;
}

/**
 * BillsTable Component
 *
 * This is the main table component that displays all bills with features like:
 * - Pagination
 * - Favorite toggling
 * - Row click to view details
 * - Loading states with skeletons
 * - Smart caching of loaded pages
 * @param {BillsTableProps} props - Component props
 * @returns {JSX.Element} Rendered table component
 */
export const BillsTable = ({
  bills,
  onLoadMore = undefined,
  isLoading = false,
  isFavoriteView = false,
  isFilterOn = false,
  filteredBillLength = 0,
}: BillsTableProps): JSX.Element => {
  const [page, setPage] = useState<number>(0);
  const [fetchedPages, setFetchedPages] = useRecoilState(fetchedPagesState);
  const rowsPerPage = PAGINATION.ROWS_PER_PAGE; // Fixed number of rows per page
  const billHead = useRecoilValue(billHeadState);
  const [favoriteBills, setFavoriteBills] = useRecoilState(favoriteBillsState);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const paginationCount = useMemo(() => {
    if (isFavoriteView) {
      return bills.length;
    }
    if (isFilterOn) {
      return filteredBillLength;
    }
    return billHead?.counts?.billCount || 0;
  }, [isFavoriteView, isFilterOn, bills.length, filteredBillLength, billHead]);

  const maxPage = useMemo(() => {
    return Math.max(0, Math.ceil(paginationCount / rowsPerPage) - 1);
  }, [paginationCount, rowsPerPage]);

  useEffect(() => {
    if (isFilterOn) {
      setPage(0);
    }
  }, [isFilterOn]);

  /**
   * Handles clicking the favorite icon for a bill
   * Uses optimistic updates - updates UI first, then calls API
   * If API fails, it reverts the UI change
   */
  const handleFavoriteClick = async (bill: Bill) => {
    try {
      // Check if this bill is already a favorite
      const isFavorite = !favoriteBills.some((fav) => fav.uri === bill.uri);

      // Update UI immediately for better user experience
      setFavoriteBills((prevFavorites) => {
        if (isFavorite) {
          return [...prevFavorites, bill];
        }
        return prevFavorites.filter((fav) => fav.uri !== bill.uri);
      });

      // mock save to the server
      await favoriteService.toggleFavorite(bill, isFavorite);
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      // If something went wrong, undo UI change
      setFavoriteBills((prevFavorites) => {
        if (favoriteBills.some((fav) => fav.uri === bill.uri)) {
          return prevFavorites.filter((fav) => fav.uri !== bill.uri);
        }
        return [...prevFavorites, bill];
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBill(null);
  };

  /**
   * Handles clicking on a table row
   * Opens the detail modal unless user clicked the favorite button
   */
  const handleRowClick = (event: React.MouseEvent, bill: Bill) => {
    // Don't open modal if they clicked the favorite button
    const isLastCell = (event.target as HTMLElement).closest(
      "td:last-child, th:last-child"
    );
    if (!isLastCell) {
      setSelectedBill(bill);
      setModalOpen(true);
    }
  };

  // Calculate the bills to display on the current page
  const displayedBills = useMemo(() => {
    return bills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [bills, page, rowsPerPage]);
  /**
   * Handles page changes in the table
   * Smart-loads data only for pages we haven't seen before
   */
  const handleChangePage = useCallback(
    async (
      _event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number
    ) => {
      const validPage = Math.max(0, Math.min(newPage, maxPage));
      setPage(validPage);
      if (isFavoriteView || isFilterOn) return;
      // Calculate how many items to skip based on page number
      const skip = validPage * rowsPerPage;

      // Only load if we haven't seen this page before
      if (!fetchedPages.has(validPage) && onLoadMore) {
        try {
          await onLoadMore(skip);
          //To Remember that we've loaded this page
          setFetchedPages((prev) => new Set(prev).add(validPage));
        } catch (error) {
          console.error("Failed to load more bills:", error);
        }
      }
    },
    [onLoadMore, rowsPerPage, fetchedPages, isFavoriteView, isFilterOn, maxPage]
  );
  console.log("count", paginationCount, "page", page);
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
            role="table"
          >
            {/* Table header with fixed column names */}
            <TableHead>
              <TableRow role="row">
                <TableCell
                  sx={{ fontWeight: "bold", width: "100px" }}
                  role="columnheader"
                >
                  Bill Number
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", width: "100px" }}
                  role="columnheader"
                >
                  Bill Type
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", width: "100px" }}
                  role="columnheader"
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", width: "300px" }}
                  role="columnheader"
                >
                  Sponsor
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", width: "100px" }}
                  role="columnheader"
                >
                  Favorite
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody data-testid="bills-table-body">
              {isLoading ? (
                <TableSkeleton />
              ) : displayedBills.length === 0 ? (
                <TableRow role="row">
                  <TableCell
                    role="cell"
                    colSpan={5}
                    align="center"
                    sx={{
                      height: "400px",
                      verticalAlign: "middle",
                      border: "none",
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span
                        className="text-gray-500 text-lg"
                        data-testid="no-bills"
                      >
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
                    <TableCell component="th" scope="row" role="cell">
                      {bill.billNo}
                    </TableCell>
                    <TableCell role="cell">{bill.billType}</TableCell>
                    <TableCell role="cell">{bill.status}</TableCell>
                    <TableCell role="cell">
                      {bill.sponsors[0]?.sponsor.as.showAs || "No sponsor"}
                    </TableCell>
                    <TableCell align="center" role="cell">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          handleFavoriteClick(bill);
                        }}
                        aria-label="toggle favorite"
                        size="small"
                        color="error"
                        data-testid="favorite-button"
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
          count={paginationCount}
          rowsPerPage={rowsPerPage}
          page={Math.min(page, maxPage)}
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

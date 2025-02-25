import { Skeleton } from "@mui/material";
import { TableRow, TableCell } from "@mui/material";

/**
 * TableSkeleton Component
 * 
 * Creates a loading placeholder that matches the structure of bills table.
 * Shows animated loading bars in place of actual content while data is being fetched.
 * 
 * Features:
 * - Mimics the actual table structure (5 columns)
 * - Shows 7 rows of loading placeholders
 * - Uses Material-UI's wave animation
 * - Maintains consistent table dimensions
 * 
 * @example
 * // Use within a table body when loading
 * <TableBody>
 *   {isLoading ? <TableSkeleton /> : <ActualContent />}
 * </TableBody>
 */
export const TableSkeleton = () => {
  // Create 7 placeholder rows to match typical page size
  return Array(7)
    .fill(0)
    .map((_, index) => (
      // Each row represents a bill that's loading
      <TableRow 
        key={index} 
        data-testid="table-skeleton"
        sx={{ height: "52px" }} // Match height of actual table rows
      >
        {/* Bill Number placeholder */}
        <TableCell>
          <Skeleton animation="wave" width="80px" />
        </TableCell>
        
        {/* Bill Type placeholder */}
        <TableCell>
          <Skeleton animation="wave" width="120px" />
        </TableCell>
        
        {/* Status placeholder */}
        <TableCell>
          <Skeleton animation="wave" width="100px" />
        </TableCell>
        
        {/* Sponsor placeholder */}
        <TableCell>
          <Skeleton animation="wave" width="200px" />
        </TableCell>
        
        {/* Favourite placeholder */}
        <TableCell>
          <Skeleton animation="wave" width="40px" />
        </TableCell>
      </TableRow>
    ));
};

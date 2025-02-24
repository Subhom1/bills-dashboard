import { Skeleton } from "@mui/material";
import { TableRow, TableCell } from "@mui/material";

export const TableSkeleton = () => {
  return Array(7)
    .fill(0)
    .map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave"/>
        </TableCell>
      </TableRow>
    ));
};

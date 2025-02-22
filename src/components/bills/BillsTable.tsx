import Paper from "@mui/material/Paper";
import { Bill } from "../../types/index";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface BillsTableProps {
  bills: Bill[];
}

export const BillsTable = ({ bills }: BillsTableProps) => {
  
  return (
    <Paper sx={{ width: "100%", overflow: "hidden"}}>
      <TableContainer sx={{ maxHeight: "calc(100vh - 100px)", }}>
        <Table
          stickyHeader
          sx={{
            minWidth: 650,
            "& .MuiTableCell-root": {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: {
                xs: "100px", // mobile
                sm: "150px", // tablet
                md: "200px", // desktop
              },
            },
          }}
          aria-label="bills table"
        >
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
            
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Stack,
  TablePagination,
} from "@mui/material";
import { usePagination } from "@app/_hooks/usePagination";

const ReferralTable = ({ referrals = [] }) => {
  const {
    page,
    rowsPerPage,
    paginatedItems,
    handleChangePage,
    handleChangeRowsPerPage,
    totalCount,
  } = usePagination(referrals, 5);

  const getStatusStyle = (status) => {
    switch (status) {
      case "green":
        return { label: "ACTIVE", color: "success", variant: "filled" };
      case "yellow":
        return { label: "PENDING", color: "warning", variant: "outlined" };
      default:
        return { label: "INACTIVE", color: "error", variant: "outlined" };
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="700" mb={2}>
        My Referrals ({referrals.length})
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
      >
        <Table sx={{ minWidth: 600 }}>
          <TableHead sx={{ bgcolor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Joined Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Account Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((refUser) => {
              const status = getStatusStyle(refUser.accountStatus);
              return (
                <TableRow key={refUser._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">
                      {refUser.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {refUser.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(refUser.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={status.label}
                      size="small"
                      color={status.color}
                      variant={status.variant}
                      sx={{ fontWeight: "bold", fontSize: "0.65rem" }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default ReferralTable;

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
  IconButton,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  Stack,
  Button,
  TablePagination,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

// Import your new utilities
import { usePagination } from "@app/_hooks/usePagination";
import { downloadCSV } from "@app/_utilities/helpers/exportCSV";

const OrderTable = ({
  orders = [],
  onViewDetails,
  onUpdateStatus,
  viewMode = "user",
}) => {
  // 1. USE THE CUSTOM PAGINATION HOOK
  const {
    page,
    rowsPerPage,
    paginatedItems, // This replaces 'paginatedOrders'
    handleChangePage,
    handleChangeRowsPerPage,
    totalCount,
  } = usePagination(orders, 5);

  // 2. USE THE EXPORT UTILITY
  const handleExport = () => {
    const headers = ["Order ID", "Date", "Customer", "Amount", "Status"];

    // Map the orders into simple arrays for the CSV utility
    const data = orders.map((order) => [
      `#${order._id.slice(-6).toUpperCase()}`,
      new Date(order.createdAt).toLocaleDateString(),
      `${order.shippingDetails?.firstName} ${order.shippingDetails?.lastName}`,
      order.totalAmount?.toFixed(2),
      order.orderStatus,
    ]);

    downloadCSV(data, headers, "orders_report");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return { color: "success", variant: "filled" };
      case "Cancelled":
        return { color: "error", variant: "filled" };
      case "Shipped":
        return { color: "info", variant: "outlined" };
      default:
        return { color: "warning", variant: "outlined" };
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="700">
          {viewMode === "admin"
            ? "Recent Transactions"
            : "Your Purchase History"}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport} // Using the new function
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Export CSV
        </Button>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map over paginatedItems from our hook */}
            {paginatedItems.map((order) => {
              const statusStyle = getStatusStyle(order.orderStatus);
              return (
                <TableRow key={order._id} hover>
                  <TableCell sx={{ fontWeight: "600", color: "primary.main" }}>
                    #{order._id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    ${order.totalAmount?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {viewMode === "admin" ? (
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={order.orderStatus}
                          onChange={(e) =>
                            onUpdateStatus(order._id, e.target.value)
                          }
                          sx={{ fontSize: "0.85rem", fontWeight: "bold" }}
                        >
                          {[
                            "Pending",
                            "Processing",
                            "Shipped",
                            "Delivered",
                            "Cancelled",
                          ].map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip
                        label={order.orderStatus}
                        size="small"
                        {...statusStyle}
                        sx={{ fontWeight: "bold" }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        onClick={() => onViewDetails(order)}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {viewMode === "user" &&
                        order.orderStatus === "Pending" && (
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() =>
                              onUpdateStatus(order._id, "Cancelled")
                            }
                            sx={{
                              fontSize: "0.65rem",
                              textTransform: "none",
                              px: 1,
                            }}
                          >
                            Cancel Order
                          </Button>
                        )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount} // From hook
          rowsPerPage={rowsPerPage} // From hook
          page={page} // From hook
          onPageChange={handleChangePage} // From hook
          onRowsPerPageChange={handleChangeRowsPerPage} // From hook
        />
      </TableContainer>
    </Box>
  );
};

export default OrderTable;

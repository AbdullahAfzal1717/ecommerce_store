import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { usePagination } from "@app/_hooks/usePagination";
import { downloadCSV } from "@app/_utilities/helpers/exportCSV";
import { toast } from "@app/_components/_core/MessageProvider";

const OrderTable = ({
  orders = [],
  onViewDetails,
  onUpdateStatus,
  viewMode = "user",
}) => {
  const {
    page,
    rowsPerPage,
    paginatedItems,
    handleChangePage,
    handleChangeRowsPerPage,
    totalCount,
  } = usePagination(orders, 5);

  // --- STATE FOR CONFIRMATION DIALOG ---
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("");

  const handleExport = () => {
    toast.info("Generating order report...");
    const headers = [
      "Order ID",
      "Date",
      "Customer",
      "Amount",
      "Wallet Used",
      "Status",
    ];
    const data = orders.map((order) => [
      `#${order._id.slice(-6).toUpperCase()}`,
      new Date(order.createdAt).toLocaleDateString(),
      `${order.shippingDetails?.firstName} ${order.shippingDetails?.lastName}`,
      order.totalAmount?.toFixed(2),
      order.walletAmountApplied?.toFixed(2) || "0.00",
      order.orderStatus,
    ]);
    downloadCSV(data, headers, "orders_report");
    toast.success("CSV Downloaded");
  };

  const handleStatusChangeAttempt = (order, newStatus) => {
    // If admin selects the SAME status, do nothing
    if (order.orderStatus === newStatus) return;

    setSelectedOrder(order);
    setPendingStatus(newStatus);
    setConfirmOpen(true);
  };

  const handleConfirmChange = () => {
    onUpdateStatus(selectedOrder._id, pendingStatus);

    if (pendingStatus === "Cancelled") {
      toast.error(
        `Order #${selectedOrder._id.slice(-6).toUpperCase()} Cancelled & Refunded`
      );
    } else {
      toast.success(`Order status updated to ${pendingStatus}`);
    }

    setConfirmOpen(false);
    setSelectedOrder(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return { color: "success", variant: "filled" };
      case "Cancelled":
        return { color: "error", variant: "filled" };
      case "Shipped":
        return { color: "info", variant: "outlined" };
      case "Processing":
        return { color: "primary", variant: "outlined" };
      default:
        return { color: "warning", variant: "outlined" };
    }
  };

  // Helper to check if the status is a "Final" state
  const isFinalStatus = (status) => ["Delivered", "Cancelled"].includes(status);

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="700">
          {viewMode === "admin" ? "Order Management" : "Your Purchase History"}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
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
              <TableCell sx={{ fontWeight: "bold" }}>Total Amount</TableCell>
              {viewMode === "admin" && (
                <TableCell sx={{ fontWeight: "bold" }}>Wallet Used</TableCell>
              )}
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((order) => {
              const statusStyle = getStatusStyle(order.orderStatus);
              const locked = isFinalStatus(order.orderStatus);

              return (
                <TableRow key={order._id} hover>
                  <TableCell sx={{ fontWeight: "600", color: "primary.main" }}>
                    #{order._id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Rs. {order.totalAmount?.toFixed(2)}
                  </TableCell>
                  {viewMode === "admin" && (
                    <TableCell sx={{ color: "error.main", fontWeight: "500" }}>
                      Rs. {order.walletAmountApplied?.toFixed(2) || "0.00"}
                    </TableCell>
                  )}
                  <TableCell>
                    {viewMode === "admin" ? (
                      locked ? (
                        // IF DELIVERED OR CANCELLED, SHOW CHIP (NO DROPDOWN)
                        <Chip
                          label={order.orderStatus}
                          size="small"
                          {...statusStyle}
                          sx={{ fontWeight: "bold", px: 1 }}
                        />
                      ) : (
                        // IF PENDING/PROCESSING/SHIPPED, SHOW DROPDOWN
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                          <Select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleStatusChangeAttempt(order, e.target.value)
                            }
                            sx={{
                              fontSize: "0.85rem",
                              fontWeight: "bold",
                              borderRadius: 2,
                            }}
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
                      )
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
                    <IconButton
                      onClick={() => onViewDetails(order)}
                      color="primary"
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* --- REUSABLE CONFIRMATION DIALOG --- */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: "800",
          }}
        >
          {pendingStatus === "Cancelled" ? (
            <WarningAmberIcon color="error" />
          ) : (
            <CheckCircleOutlineIcon color="primary" />
          )}
          Update Order Status?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are changing the status of Order{" "}
            <b>#{selectedOrder?._id.slice(-6).toUpperCase()}</b> to{" "}
            <b>{pendingStatus}</b>.
            {pendingStatus === "Cancelled" && (
              <Box
                component="span"
                sx={{
                  display: "block",
                  mt: 2,
                  color: "error.main",
                  fontWeight: "bold",
                }}
              >
                Warning: This will refund Rs.{" "}
                {selectedOrder?.walletAmountApplied?.toFixed(2)} and restock
                items.
              </Box>
            )}
            {pendingStatus === "Delivered" && (
              <Box
                component="span"
                sx={{
                  display: "block",
                  mt: 2,
                  color: "success.main",
                  fontWeight: "bold",
                }}
              >
                Notice: This will grant a Lucky Spin to the user and bonus to
                the referrer.
              </Box>
            )}
            <Box component="span" sx={{ display: "block", mt: 2 }}>
              Once set to <b>Delivered</b> or <b>Cancelled</b>, you cannot
              change the status again.
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmChange}
            color={pendingStatus === "Cancelled" ? "error" : "primary"}
            variant="contained"
            sx={{ fontWeight: "bold", borderRadius: 2 }}
          >
            Confirm Change
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderTable;

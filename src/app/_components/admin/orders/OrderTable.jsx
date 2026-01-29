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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const OrderTable = ({
  orders,
  onViewDetails,
  onUpdateStatus,
  viewMode = "user",
}) => {
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
          {orders?.map((order) => {
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

                    {/* USER VIEW: Show Cancel only if status is Pending */}
                    {viewMode === "user" && order.orderStatus === "Pending" && (
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => onUpdateStatus(order._id, "Cancelled")}
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
    </TableContainer>
  );
};

export default OrderTable;

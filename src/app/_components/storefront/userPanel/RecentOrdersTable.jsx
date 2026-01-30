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
} from "@mui/material";

const RecentOrdersTable = ({ orders, onRowClick }) => (
  <TableContainer
    component={Paper}
    elevation={0}
    sx={{ border: "1px solid #eee", borderRadius: 4 }}
  >
    <Table>
      <TableHead sx={{ bgcolor: "#f8f9fa" }}>
        <TableRow>
          <TableCell sx={{ fontWeight: "700" }}>Order ID</TableCell>
          <TableCell sx={{ fontWeight: "700" }}>Status</TableCell>
          <TableCell sx={{ fontWeight: "700" }}>Total</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders?.length > 0 ? (
          orders.map((order) => (
            <TableRow
              key={order._id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => onRowClick(order._id)}
            >
              <TableCell sx={{ fontWeight: 500 }}>
                #{order._id.substring(18).toUpperCase()}
              </TableCell>
              <TableCell>
                <Chip
                  label={order.orderStatus}
                  size="small"
                  color={
                    order.orderStatus === "Delivered" ? "success" : "primary"
                  }
                  variant="outlined"
                />
              </TableCell>
              <TableCell sx={{ fontWeight: "700" }}>
                Rs. {order.totalAmount}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={3}
              align="center"
              sx={{ py: 3, color: "text.secondary" }}
            >
              No recent orders found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default RecentOrdersTable;

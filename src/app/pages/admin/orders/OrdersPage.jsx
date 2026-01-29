import React, { useState, useEffect } from "react";
import { Container, Box, CircularProgress, Alert } from "@mui/material";
import axios from "axios";
import OrderTable from "@app/_components/admin/orders/OrderTable";
import OrderDetailsDrawer from "@app/_components/admin/orders/OrderDetailsDrawer";
import { orderService } from "@app/_services/order.service";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderService.getAllOrders();
      setOrders(res.data); // Clean and uses the interceptor's token!
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // 1. Call the backend API
      // Usually a PATCH request to /orders/:id
      await orderService.updateStatus(orderId, newStatus);

      // 2. Update local state so the UI changes instantly
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

      // Optional: Add a success notification here (e.g., using Snackbar)
    } catch (err) {
      console.error("Status update failed", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <OrderTable
        orders={orders}
        viewMode="admin"
        onViewDetails={handleOpenDetails}
        onUpdateStatus={handleUpdateStatus}
      />

      <OrderDetailsDrawer
        open={drawerOpen}
        viewMode="admin"
        order={selectedOrder}
        onClose={() => setDrawerOpen(false)}
      />
    </Container>
  );
};

export default AdminOrdersPage;

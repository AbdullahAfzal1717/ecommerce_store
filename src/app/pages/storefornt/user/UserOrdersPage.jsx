import React, { useState, useEffect } from "react";
import { Typography, Box, Alert, CircularProgress } from "@mui/material";
import { orderService } from "@app/_services/order.service";
import OrderTable from "@app/_components/admin/orders/OrderTable";
import OrderDetailsDrawer from "@app/_components/admin/orders/OrderDetailsDrawer";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Drawer States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getMyOrders();
      setOrders(res.data.data);
    } catch (err) {
      setError("Could not load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId, newStatus) => {
    if (newStatus !== "Cancelled") return;

    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await orderService.updateStatus(orderId, "Cancelled");

        // Update local list
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: "Cancelled" } : o
          )
        );

        // Update the selected order so the Drawer UI updates instantly too
        setSelectedOrder((prev) =>
          prev && prev._id === orderId
            ? { ...prev, orderStatus: "Cancelled" }
            : prev
        );
      } catch (err) {
        alert("Failed to cancel order. It might already be processed.");
      }
    }
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress color="inherit" />
      </Box>
    );

  return (
    <Box>
      <Typography variant="h4" fontWeight="800" mb={1}>
        My Orders
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        View details and track the status of your purchases.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Alert severity="info">You haven't placed any orders yet.</Alert>
      ) : (
        <OrderTable
          orders={orders}
          viewMode="user"
          onViewDetails={handleOpenDetails}
        />
      )}

      {/* Reusing Admin Drawer for User Details */}
      <OrderDetailsDrawer
        open={drawerOpen}
        viewMode="user"
        order={selectedOrder}
        onClose={() => setDrawerOpen(false)}
        onCancelOrder={handleCancelOrder}
      />
    </Box>
  );
};

export default UserOrdersPage;

import React, { useState, useEffect } from "react";
import { Typography, Box, Alert, CircularProgress } from "@mui/material";
import { orderService } from "@app/_services/order.service";
import OrderTable from "@app/_components/admin/orders/OrderTable";
import OrderDetailsDrawer from "@app/_components/admin/orders/OrderDetailsDrawer";
import ConfirmDialog from "@app/_utilities/helpers/ConfirmDialog"; // Your helper
import { toast } from "@app/_components/_core/MessageProvider";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Drawer States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Modern Cancel States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getMyOrders();
      // Adjusting based on your data structure (data.data)
      setOrders(res.data.data || res.data);
    } catch (err) {
      setError("Could not load your orders. Please try again later.");
      toast.error("Failed to fetch order history");
    } finally {
      setLoading(false);
    }
  };

  // 1. Trigger the modern Dialog
  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setConfirmOpen(true);
  };

  // 2. Perform the actual API call from the Dialog
  const handleConfirmCancel = async () => {
    setCancelLoading(true);
    try {
      await orderService.updateStatus(orderToCancel, "Cancelled");

      // Update local list for instant UI feedback
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderToCancel ? { ...o, orderStatus: "Cancelled" } : o
        )
      );

      // If the drawer is currently open for this order, update its state too
      if (selectedOrder && selectedOrder._id === orderToCancel) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: "Cancelled" }));
      }

      toast.success("Order cancelled successfully");
      setConfirmOpen(false);
    } catch (err) {
      toast.error("Failed to cancel order. It might already be processed.");
    } finally {
      setCancelLoading(false);
      setOrderToCancel(null);
    }
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
        <CircularProgress color="inherit" />
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, md: 0 } }}>
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

      {/* Side Drawer for Order Details */}
      <OrderDetailsDrawer
        open={drawerOpen}
        viewMode="user"
        order={selectedOrder}
        onClose={() => setDrawerOpen(false)}
        onCancelOrder={handleCancelClick} // Now triggers the helper dialog
      />

      {/* Your Reusable Confirmation Helper */}
      <ConfirmDialog
        open={confirmOpen}
        title="Cancel Your Order?"
        content="Are you sure you want to cancel this order? This action cannot be undone once processed."
        onConfirm={handleConfirmCancel}
        onClose={() => setConfirmOpen(false)}
        loading={cancelLoading}
      />
    </Box>
  );
};

export default UserOrdersPage;

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Stack,
  Divider,
  IconButton,
  Button,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// We use viewMode="admin" or viewMode="user" to decide what to show
const OrderDetailsDrawer = ({
  open,
  order,
  onClose,
  onCancelOrder,
  viewMode = "user",
}) => {
  if (!order) return null;

  // Logic: Only a person in "user" view can cancel,
  // and only if the status is not yet Shipped/Delivered.
  const canCancel =
    viewMode === "user" &&
    (order.orderStatus === "Pending" || order.orderStatus === "Processing");

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 450 } } }}
    >
      {/* HEADER */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#fcfcfc",
        }}
      >
        <Typography variant="h6" fontWeight="800">
          {viewMode === "admin" ? "Manage Order" : "Order Summary"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      <Box sx={{ p: 3 }}>
        <Stack spacing={4}>
          {/* STATUS SECTION */}
          <Box
            sx={{
              p: 2,
              bgcolor:
                order.orderStatus === "Cancelled"
                  ? "error.lighter"
                  : "primary.lighter",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="body2"
              color={
                order.orderStatus === "Cancelled"
                  ? "error.main"
                  : "primary.main"
              }
              fontWeight="700"
            >
              Current Status: {order.orderStatus}
            </Typography>
          </Box>

          {/* SHIPPING INFO - Always relevant */}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: "bold", textTransform: "uppercase" }}
            >
              Delivery Address
            </Typography>
            <Typography variant="body1" fontWeight="700" sx={{ mt: 1 }}>
              {order.shippingDetails?.firstName}{" "}
              {order.shippingDetails?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingDetails?.address}, {order.shippingDetails?.city}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Ph: {order.shippingDetails?.phoneNumber}
            </Typography>
          </Box>

          {/* ORDERED ITEMS */}
          <Box>
            <Typography variant="subtitle2" fontWeight="800" mb={2}>
              Items Ordered
            </Typography>
            <Stack spacing={2}>
              {order.items.map((item, idx) => (
                <Stack
                  key={idx}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2" fontWeight="600">
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="700">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* TOTALS */}
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6" fontWeight="800">
              Total Paid
            </Typography>
            <Typography variant="h6" fontWeight="800" color="primary">
              ${order.totalAmount?.toFixed(2)}
            </Typography>
          </Stack>

          {/* USER VIEW ACTION: CANCELLATION */}
          {canCancel && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="info" sx={{ mb: 2, fontSize: "0.75rem" }}>
                You can cancel this order before it leaves our warehouse.
              </Alert>
              <Button
                fullWidth
                variant="contained"
                color="error"
                size="large"
                onClick={() => {
                  if (
                    window.confirm(
                      "Cancel this order? Your refund will be processed to the original payment method."
                    )
                  ) {
                    onCancelOrder(order._id, "Cancelled");
                    onClose();
                  }
                }}
              >
                Cancel Order
              </Button>
            </Box>
          )}

          {/* ADMIN VIEW INFO: TECHNICAL DETAILS */}
          {viewMode === "admin" && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                border: "1px dashed #ccc",
              }}
            >
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                fontWeight="bold"
              >
                STRIPE TRANSACTION DETAILS
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  mt: 1,
                  display: "block",
                }}
              >
                ID: {order.stripePaymentId}
              </Typography>
              <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                Payment Status:{" "}
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {order.paymentStatus}
                </span>
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
};

export default OrderDetailsDrawer;

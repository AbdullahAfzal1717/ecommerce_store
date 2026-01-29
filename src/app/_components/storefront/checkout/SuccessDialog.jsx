import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";

const SuccessDialog = ({ open }) => (
  <Dialog
    open={open}
    onClose={() => (window.location.href = "/products")}
    PaperProps={{ sx: { p: 2, textAlign: "center", borderRadius: "12px" } }}
  >
    <DialogContent>
      <CheckCircleOutline sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
      <Typography variant="h4" fontWeight="800" gutterBottom>
        Order Placed!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Thank you for your purchase. Your order has been processed successfully
        and is being prepared for shipping.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
      <Button
        variant="contained"
        onClick={() => (window.location.href = "/")}
        sx={{ bgcolor: "#000", px: 4, fontWeight: "bold" }}
      >
        Continue Shopping
      </Button>
    </DialogActions>
  </Dialog>
);

export default SuccessDialog;

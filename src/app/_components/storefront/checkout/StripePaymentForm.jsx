import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useCart } from "@app/_components/_core/CartProvider/hooks";
import { orderService } from "@app/_services/order.service";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { paymentService } from "@app/_services/payment.service";
import { toast } from "@app/_components/_core/MessageProvider";

const StripePaymentForm = ({
  total,
  payableTotal,
  walletAmountApplied,
  shippingInfo,
  isFormValid,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, clearCart } = useCart();
  const { isAuthenticated, authUser, updateAuthUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !isAuthenticated) return;

    setLoading(true);
    setError(null);
    toast.info("Processing your transaction...");

    try {
      let stripePaymentId = "WALLET_ONLY";
      let paymentStatus = "Paid";

      // ONLY call Stripe if there is a remaining balance to pay
      if (payableTotal > 0) {
        const {
          data: { clientSecret },
        } = await paymentService.createIntent(payableTotal);

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
              email: authUser.email,
              phone: shippingInfo.phoneNumber,
            },
          },
        });

        if (result.error) {
          setError(result.error.message);
          toast.error(result.error.message);
          setLoading(false);
          return;
        }
        stripePaymentId = result.paymentIntent.id;
      }

      // PLACE ORDER ON BACKEND
      const orderResponse = await orderService.placeOrder({
        user: authUser.id,
        items: cartItems.map((item) => ({
          productId: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantityInCart,
        })),
        shippingDetails: shippingInfo,
        totalAmount: total, // Original Price
        walletAmountApplied: walletAmountApplied, // How much wallet used
        finalAmountPaid: payableTotal, // How much card used
        stripePaymentId: stripePaymentId,
        paymentStatus: paymentStatus,
      });

      // Update local User context (Wallet balance will be lower)
      if (orderResponse.updatedUser) {
        updateAuthUser(orderResponse.updatedUser);
      } else {
        // Fallback: manually update locally if backend didn't return user
        updateAuthUser({
          ...authUser,
          walletBalance: authUser.walletBalance - walletAmountApplied,
        });
      }

      toast.success("Order placed successfully!");
      clearCart();
      onSuccess();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong with the transaction.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {payableTotal > 0 ? (
        <>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Pay Balance via Card
          </Typography>
          <Box
            sx={{
              p: 2,
              border: "1px solid #ccc",
              borderRadius: "4px",
              bgcolor: "white",
              mb: 2,
            }}
          >
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            p: 2,
            bgcolor: "success.lighter",
            borderRadius: 1,
            mb: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="success.main" fontWeight="bold">
            Full Wallet Payment - No Card Needed
          </Typography>
        </Box>
      )}

      {error && (
        <Typography
          color="error"
          variant="caption"
          display="block"
          sx={{ mb: 1 }}
        >
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={(!stripe && payableTotal > 0) || loading || !isFormValid}
        sx={{ py: 1.5, fontWeight: "bold", mt: 1 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : payableTotal > 0 ? (
          `Pay Rs. ${payableTotal.toFixed(2)}`
        ) : (
          "Confirm Order"
        )}
      </Button>
    </Box>
  );
};

export default StripePaymentForm;

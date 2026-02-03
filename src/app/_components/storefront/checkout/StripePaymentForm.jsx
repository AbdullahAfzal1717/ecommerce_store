import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import { useCart } from "@app/_components/_core/CartProvider/hooks";
import { useNavigate } from "react-router-dom";
import { orderService } from "@app/_services/order.service";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { paymentService } from "@app/_services/payment.service";
import { toast } from "@app/_components/_core/MessageProvider"; // Added import

const StripePaymentForm = ({ total, shippingInfo, isFormValid, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, clearCart } = useCart();
  const { isAuthenticated, authUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !isAuthenticated) return;

    setLoading(true);
    setError(null);
    toast.info("Processing your payment..."); // Initial feedback

    try {
      const {
        data: { clientSecret },
      } = await paymentService.createIntent(total);

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
        toast.error(result.error.message); // Error notification
      } else if (result.paymentIntent.status === "succeeded") {
        await orderService.placeOrder({
          user: authUser.id,
          items: cartItems.map((item) => ({
            productId: item._id,
            title: item.title,
            price: item.price,
            quantity: item.quantityInCart,
          })),
          shippingDetails: shippingInfo,
          totalAmount: total,
          stripePaymentId: result.paymentIntent.id,
          paymentStatus: "Paid",
        });

        toast.success("Payment successful! Your order has been placed."); // Success notification
        clearCart();
        onSuccess();
      }
    } catch (err) {
      const msg = "Something went wrong with the transaction.";
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Credit or Debit Card
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

      {error && (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={!stripe || loading || !isFormValid}
        sx={{ py: 1.5, fontWeight: "bold", mt: 2 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          `Pay $${total.toFixed(2)}`
        )}
      </Button>
    </Box>
  );
};

export default StripePaymentForm;

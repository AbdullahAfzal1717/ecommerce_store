import React from "react";
import {
  Container,
  Grid,
  Typography,
  Stack,
  Divider,
  Paper,
  Box,
} from "@mui/material";
import { useCart } from "@app/_components/_core/CartProvider/hooks";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// IMPORT SUB-COMPONENTS
import StripePaymentForm from "@app/_components/storefront/checkout/StripePaymentForm";
import CartTable from "@app/_components/storefront/checkout/CartTable";
import ShippingForm from "@app/_components/storefront/checkout/ShippingForm";
import SuccessDialog from "@app/_components/storefront/checkout/SuccessDialog";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const { cartItems, total, updateQuantity, removeItem } = useCart();
  const { authUser } = useAuth();

  const [shippingInfo, setShippingInfo] = React.useState({
    firstName: authUser?.username?.split(" ")[0] || "", // Basic split for name
    lastName: authUser?.username?.split(" ")[1] || "",
    email: authUser?.email || "", // Crucial to include this
    address: "",
    city: "",
    phoneNumber: "",
  });
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    shippingInfo.firstName &&
    shippingInfo.address &&
    shippingInfo.phoneNumber &&
    cartItems.length > 0;

  return (
    <Elements stripe={stripePromise}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          sx={{ fontWeight: 800, mb: 6, textAlign: "center" }}
        >
          Checkout
        </Typography>

        <Grid container spacing={6}>
          <Grid item xs={12} lg={8}>
            <CartTable
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
            <ShippingForm
              shippingInfo={shippingInfo}
              handleInputChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "1px solid #eee",
                bgcolor: "#fcfcfc",
                borderRadius: "8px",
                position: "sticky",
                top: 20,
              }}
            >
              <Typography variant="h5" fontWeight="700" mb={3}>
                Order Summary
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight="700">${total.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography color="success.main" fontWeight="700">
                    Free
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h5" fontWeight="800">
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight="800" color="primary">
                    ${total.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>

              <StripePaymentForm
                total={total}
                shippingInfo={shippingInfo}
                isFormValid={isFormValid}
                onSuccess={() => setIsSuccessOpen(true)}
              />

              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Box
                  component="img"
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  sx={{ height: 25, opacity: 0.6 }}
                />
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                  mt={1}
                >
                  Guaranteed safe & secure checkout
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <SuccessDialog open={isSuccessOpen} />
    </Elements>
  );
};

export default CheckoutPage;

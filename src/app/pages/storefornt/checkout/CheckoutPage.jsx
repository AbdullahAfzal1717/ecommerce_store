import React from "react";
import {
  Container,
  Grid,
  Typography,
  Stack,
  Divider,
  Paper,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useCart } from "@app/_components/_core/CartProvider/hooks";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

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
  const [useWallet, setUseWallet] = React.useState(false);

  // WALLET CALCULATIONS
  const availableWallet = authUser?.walletBalance || 0;
  const walletDeduction = useWallet ? Math.min(availableWallet, total) : 0;
  const amountToPayStripe = total - walletDeduction;

  const [shippingInfo, setShippingInfo] = React.useState({
    firstName: authUser?.username?.split(" ")[0] || "",
    lastName: authUser?.username?.split(" ")[1] || "N/A",
    email: authUser?.email || "",
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

              {/* WALLET SELECTION SECTION */}
              {availableWallet > 0 && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: useWallet ? "primary.lighter" : "#f0f0f0",
                    border: "1px dashed",
                    borderColor: useWallet ? "primary.main" : "#ccc",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <AccountBalanceWalletIcon
                      color="primary"
                      fontSize="small"
                    />
                    <Typography variant="subtitle2" fontWeight="700">
                      Wallet Balance
                    </Typography>
                  </Stack>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={useWallet}
                        onChange={(e) => setUseWallet(e.target.checked)}
                        size="small"
                      />
                    }
                    label={`Apply Rs. ${availableWallet.toFixed(2)}`}
                  />
                </Box>
              )}

              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Cart Subtotal</Typography>
                  <Typography fontWeight="700">
                    Rs. {total.toFixed(2)}
                  </Typography>
                </Stack>

                {useWallet && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="error.main">Wallet Deduction</Typography>
                    <Typography color="error.main" fontWeight="700">
                      - Rs. {walletDeduction.toFixed(2)}
                    </Typography>
                  </Stack>
                )}

                <Divider sx={{ my: 1 }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h5" fontWeight="800">
                    Payable
                  </Typography>
                  <Typography variant="h5" fontWeight="800" color="primary">
                    Rs. {amountToPayStripe.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>

              {/* PASSING DEDUCTION TO FORM */}
              <StripePaymentForm
                total={total} // The original cart total
                payableTotal={amountToPayStripe} // The actual charge for Stripe
                walletAmountApplied={walletDeduction} // To be saved in DB
                shippingInfo={shippingInfo}
                isFormValid={isFormValid}
                onSuccess={() => setIsSuccessOpen(true)}
              />

              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                  Secured by Stripe | NUML E-Store
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

import React from "react";
import { Box, Typography, Grid, TextField } from "@mui/material";

const ShippingForm = ({ shippingInfo, handleInputChange }) => {
  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" fontWeight="700" mb={4}>
        Shipping Information
      </Typography>
      <Grid container spacing={3}>
        {/* Row 1: Names */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={shippingInfo.firstName}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={shippingInfo.lastName}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
        </Grid>

        {/* Row 2: Email (Professional touch: keep it for order contact) */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={shippingInfo.email}
            onChange={handleInputChange}
            variant="outlined"
            required
            helperText="We'll send the receipt to this email."
          />
        </Grid>

        {/* Row 3: Address */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            name="address"
            value={shippingInfo.address}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
        </Grid>

        {/* Row 4: City and Phone */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={shippingInfo.city}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={shippingInfo.phoneNumber}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShippingForm;

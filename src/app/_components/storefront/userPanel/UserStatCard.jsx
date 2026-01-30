import React from "react";
import { Paper, Stack, Box, Typography } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const UserStatCard = ({ title, value, type }) => {
  // Define styles based on type
  const config = {
    orders: { icon: <ShoppingBagIcon />, color: "#000000" },
    shipping: { icon: <LocalShippingIcon />, color: "#1976d2" },
    wallet: { icon: <AccountBalanceWalletIcon />, color: "#2e7d32" },
  };

  const { icon, color } = config[type] || config.orders;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid #eee",
        borderRadius: 4,
        transition: "0.3s",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          transform: "translateY(-4px)",
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            bgcolor: `${color}15`,
            color: color,
            p: 1.5,
            borderRadius: 3,
            display: "flex",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight="600">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="800">
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default UserStatCard;

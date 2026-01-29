import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { orderService } from "@app/_services/order.service";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, icon, color }) => (
  <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee", borderRadius: 4 }}>
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

const UserDashboard = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    // Logic to calculate stats from orders
    const fetchStats = async () => {
      const res = await orderService.getMyOrders(); 
      const orders = res.data.data;
      const total = orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );
      const pendingCount = orders.filter(
        (o) => o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled"
      ).length;

      setStats({
        totalOrders: orders.length,
        pending: pendingCount,
        totalSpent: total.toFixed(2),
      });
    };
    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight="800" mb={1}>
        Welcome back, {authUser?.username}!
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Here's what's happening with your account today.
      </Typography>

      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingBagIcon />}
            color="#000000"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="In Progress"
            value={stats.pending}
            icon={<LocalShippingIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Spent"
            value={`$${stats.totalSpent}`}
            icon={<AccountBalanceWalletIcon />}
            color="#2e7d32"
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 4 }} />

      <Paper
        elevation={0}
        sx={{ p: 4, bgcolor: "black", color: "white", borderRadius: 4 }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box>
            <Typography variant="h5" fontWeight="700">
              Ready for more?
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Check out our newest tech arrivals.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("/products")}
            sx={{
              bgcolor: "white",
              color: "black",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#eee" },
            }}
          >
            Explore Store
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default UserDashboard;

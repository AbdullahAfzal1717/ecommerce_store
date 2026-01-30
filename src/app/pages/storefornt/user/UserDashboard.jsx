import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Stack,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { orderService } from "@app/_services/order.service";
import UserStatCard from "@app/_components/storefront/userPanel/UserStatCard";
import RecentOrdersTable from "@app/_components/storefront/userPanel/RecentOrdersTable";
import UserSpendingChart from "@app/_components/storefront/userPanel/UserSpendingChart";

const UserDashboard = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        // Using the same "One API Call" strategy as Admin
        const res = await orderService.getUserAnalytics();
        console.log(res);
        setData(res);
      } catch (err) {
        console.error("User Dashboard Fetch Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="900" letterSpacing={-0.5}>
          Hello, {authUser?.username}!
        </Typography>
        <Typography color="text.secondary">
          Your account activity at a glance.
        </Typography>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={4}>
          <UserStatCard
            title="Orders Placed"
            value={data?.summary?.totalOrders || 0}
            type="orders"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <UserStatCard
            title="Active Shipments"
            value={data?.summary?.activeOrders || 0}
            type="shipping"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <UserStatCard
            title="Total Spent"
            value={`Rs. ${data?.summary?.totalSpent || 0}`}
            type="wallet"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack spacing={4}>
            {/* Spending Graph */}
            <UserSpendingChart data={data?.spendingData} />

            {/* Recent Orders List */}
            <Box>
              <Typography variant="h6" fontWeight="700" mb={2}>
                Recent Orders
              </Typography>
              <RecentOrdersTable
                orders={data?.recentOrders}
                onRowClick={(id) => navigate(`/orders/${id}`)}
              />
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Promo Card */}
            <Box
              sx={{ p: 4, bgcolor: "black", color: "white", borderRadius: 6 }}
            >
              <Typography variant="h5" fontWeight="800" mb={1}>
                Explore Store
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
                Don't miss out on our latest tech deals.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/products")}
                sx={{
                  bgcolor: "white",
                  color: "black",
                  fontWeight: "bold",
                  py: 1.5,
                  "&:hover": { bgcolor: "#eee" },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Shop Now
              </Button>
            </Box>

            {/* Navigation Shortcuts */}
            <Paper
              elevation={0}
              sx={{ p: 3, border: "1px solid #eee", borderRadius: 4 }}
            >
              <Typography variant="subtitle2" color="text.secondary" mb={2}>
                ACCOUNT SHORTCUTS
              </Typography>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  align="left"
                  variant="text"
                  onClick={() => navigate("/account/profile")}
                  sx={{ justifyContent: "flex-start", color: "black" }}
                >
                  Profile Settings
                </Button>
                <Button
                  fullWidth
                  align="left"
                  variant="text"
                  onClick={() => navigate("/account/orders")}
                  sx={{ justifyContent: "flex-start", color: "black" }}
                >
                  Full Order History
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;

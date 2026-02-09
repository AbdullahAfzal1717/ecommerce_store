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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "@app/_components/_core/MessageProvider";
import ReferralTable from "@app/_components/storefront/referral/ReferralTable";

const UserDashboard = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);

  const referralLink = `${window.location.origin}/auth/signup-1?ref=${authUser?.referralCode}`;

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const getStatusMessage = () => {
    if (authUser?.accountStatus === "red")
      return "Your ID is INACTIVE. Place your first order to start earning!";
    if (authUser?.accountStatus === "yellow")
      return "Order Pending! Once delivered, your ID turns GREEN.";
    return "You are a Verified GREEN Member! Keep referring to earn more.";
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const res = await orderService.getUserAnalytics();
        setData(res);

        // NEW: Fetch Referral History
        const refRes = await orderService.getReferralHistory();
        setReferrals(refRes); // Adjust based on your API response structure
      } catch (err) {
        toast.error("We couldn't load your dashboard stats right now.");
        console.error("Dashboard Fetch Error", err);
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
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 4,
          bgcolor: authUser?.accountStatus === "green" ? "#e8f5e9" : "#fff3e0",
          border: "1px solid",
          borderColor:
            authUser?.accountStatus === "green"
              ? "success.light"
              : "warning.light",
        }}
      >
        <Typography
          variant="body2"
          fontWeight="700"
          color={
            authUser?.accountStatus === "green"
              ? "success.main"
              : "warning.main"
          }
        >
          🚀 {getStatusMessage()}
        </Typography>
      </Paper>
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
        <Grid item xs={12} sm={6} md={3}>
          <UserStatCard
            title="Wallet Balance"
            value={`Rs. ${authUser?.walletBalance || 0}`}
            type="bonus"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <UserStatCard
            title="Lucky Spins"
            value={authUser?.availableSpins || 0}
            type="spins"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <UserStatCard
            title="Total Spent"
            value={`Rs. ${data?.summary?.totalSpent || 0}`}
            type="wallet"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <UserStatCard
            title="Orders"
            value={data?.summary?.totalOrders || 0}
            type="orders"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack spacing={4}>
            {/* Spending Graph */}
            <UserSpendingChart data={data?.spendingData} />

            <Box mt={4}>
              <ReferralTable referrals={referrals} />
            </Box>

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
              sx={{
                p: 3,
                border: "1px solid #eee",
                borderRadius: 4,
                bgcolor: "#f9f9f9",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" mb={2}>
                REFER YOUR FRIENDS
              </Typography>

              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: "white",
                  borderRadius: 2,
                  border: "1px dashed #ccc",
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  YOUR CODE
                </Typography>
                <Typography variant="h5" fontWeight="900" color="primary">
                  {authUser?.referralCode}
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={() =>
                    copyToClipboard(referralLink, "Referral link copied!")
                  }
                >
                  Copy Invite Link
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    copyToClipboard(authUser?.referralCode, "Code copied!")
                  }
                >
                  Copy Only Code
                </Button>
              </Stack>

              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #eee" }}>
                <Typography
                  variant="caption"
                  display="block"
                  textAlign="center"
                >
                  Account Status:
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: "bold",
                      color: "white",
                      bgcolor:
                        authUser?.accountStatus === "green"
                          ? "success.main"
                          : authUser?.accountStatus === "yellow"
                            ? "warning.main"
                            : "error.main",
                    }}
                  >
                    {authUser?.accountStatus?.toUpperCase()}
                  </Box>
                </Typography>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;

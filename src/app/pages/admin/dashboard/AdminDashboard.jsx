import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Stack,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupsIcon from "@mui/icons-material/Groups";
import PaidIcon from "@mui/icons-material/Paid";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { orderService } from "@app/_services/order.service";
import { useNavigate } from "react-router-dom";
import { SalesOverview } from "@app/_components/widgets/SalesOverView";
import { Orders } from "@app/_components/widgets/Orders"; // Your small green widget

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

const AdminDashboard = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const res = await orderService.getDashboardAnalytics();
        console.log(res); // The new combined API
        setDashboardData(res);
      } catch (err) {
        console.error("Dashboard Load Failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight="800">
            Business Overview
          </Typography>
          <Typography color="text.secondary">
            Welcome back, Administrator {authUser?.username}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<InventoryIcon />}
          onClick={() => navigate("/admin/products")}
          sx={{
            borderRadius: 2,
            bgcolor: "black",
            "&:hover": { bgcolor: "#333" },
          }}
        >
          Add Product
        </Button>
      </Stack>

      {/* Summary Cards - Using data from our single API call */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`Rs. ${dashboardData?.summary?.totalRevenue}`}
            icon={<PaidIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Orders
            title="Order Volume"
            count={dashboardData?.summary?.totalOrders}
            data={dashboardData?.chartData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Needs Action"
            value={dashboardData?.summary?.pendingOrders}
            icon={<PendingActionsIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={dashboardData?.summary?.deliveredOrders}
            icon={<InventoryIcon />}
            color="#1976d2"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* BIG SALES CHART - Pass chartData as a prop */}
        <Grid item xs={12} md={8}>
          <SalesOverview
            title="Sales Overview"
            data={dashboardData?.chartData}
          />
        </Grid>

        {/* SMALL ORDERS WIDGET - Also uses the same data */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              height: "100%",
              border: "1px solid #eee",
            }}
          >
            <Typography variant="h6" fontWeight="700" mb={2}>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/admin/categories")}
              >
                Manage Categories
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/admin/orders")}
              >
                View All Orders
              </Button>
              <Button fullWidth variant="outlined" color="error">
                System Logs
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

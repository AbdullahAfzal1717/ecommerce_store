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

// Reusing your StatCard design for consistency
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
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        // Using getAllOrders because Admin sees EVERYTHING
        const res = await orderService.getAllOrders();
        const allOrders = res.data;

        const revenue = allOrders
          .filter((o) => o.orderStatus !== "Cancelled")
          .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const pending = allOrders.filter(
          (o) => o.orderStatus === "Pending" || o.orderStatus === "Processing"
        ).length;
        const delivered = allOrders.filter(
          (o) => o.orderStatus === "Delivered"
        ).length;

        setStats({
          totalRevenue: revenue.toFixed(2),
          totalOrders: allOrders.length,
          pendingOrders: pending,
          deliveredOrders: delivered,
        });
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
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

      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue}`}
            icon={<PaidIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<GroupsIcon />}
            color="#000000"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Needs Action"
            value={stats.pendingOrders}
            icon={<PendingActionsIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.deliveredOrders}
            icon={<InventoryIcon />}
            color="#1976d2"
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed #ccc",
            }}
          >
            <Typography color="text.secondary">
              [ Sales Chart Placeholder - Use Chart.js or Recharts here later ]
            </Typography>
          </Paper>
        </Grid>
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

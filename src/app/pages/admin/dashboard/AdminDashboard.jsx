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
import { TotalRevenueThisYear } from "@app/_components/widgets/TotalRevenue";
import { OrdersReport } from "@app/_components/widgets/OrderReport";

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
      {/* Header & Quick Actions Row */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight="800">
            Business Overview
          </Typography>
          <Typography color="text.secondary">
            Welcome back, {authUser?.username}
          </Typography>
        </Box>

        {/* Compact Quick Actions */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/admin/categories")}
          >
            Categories
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/admin/orders")}
          >
            Orders
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<InventoryIcon />}
            onClick={() => navigate("/admin/products")}
            sx={{ bgcolor: "black", "&:hover": { bgcolor: "#333" } }}
          >
            Add Product
          </Button>
        </Stack>
      </Stack>

      {/* Row 1: Small Visual Cards (Total Revenue & Order Volume) */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <TotalRevenueThisYear
            revenue={dashboardData?.summary?.totalRevenue}
            subheader="Total Sales Revenue"
            chartData={dashboardData?.chartData}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Orders
            title="Order Volume"
            count={dashboardData?.summary?.totalOrders}
            data={dashboardData?.chartData}
          />
        </Grid>
      </Grid>

      {/* Row 2: Main Analytics (Sales Overview & Radar Report) */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <SalesOverview
            title="Sales Performance"
            data={dashboardData?.chartData}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <OrdersReport
            title="Order Status"
            subheader="Completed vs Pending"
            data={dashboardData?.reportData}
            chartHeight={280} // Radar chart looks great when it has room to breathe here
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

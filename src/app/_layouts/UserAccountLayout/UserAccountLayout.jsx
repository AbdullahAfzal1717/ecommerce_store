import React from "react";
import {
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

export const UserAccountLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: <DashboardOutlinedIcon />,
      path: "/account",
    },
    {
      label: "My Orders",
      icon: <ShoppingBagOutlinedIcon />,
      path: "/account/orders",
    },
    {
      label: "Profile Settings",
      icon: <PersonOutlineOutlinedIcon />,
      path: "/account/profile",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "80vh" }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* SIDEBAR */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h4"
              fontWeight="800"
              mb={4}
              sx={{ letterSpacing: "-1px" }}
            >
              My Account
            </Typography>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #eee",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <List disablePadding>
                {menuItems.map((item) => (
                  <ListItemButton
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    selected={pathname === item.path}
                    sx={{
                      py: 2,
                      px: 3,
                      "&.Mui-selected": {
                        bgcolor: "black",
                        color: "white",
                        "&:hover": { bgcolor: "black" },
                        "& .MuiListItemIcon-root": { color: "white" },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontWeight: "600" }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* DYNAMIC CONTENT AREA */}
          <Grid item xs={12} md={9}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                border: "1px solid #eee",
                minHeight: "500px",
              }}
            >
              <Outlet />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Div } from "@jumbo/shared";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import {
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { JumboDdPopover } from "@jumbo/components/JumboDdPopover";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import EditProfileDialog from "@app/_components/admin/profile/EditProfileDialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AuthUserPopover = () => {
  const { theme } = useJumboTheme();
  const { logout, authUser } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();

  // Normalize role check
  const isAdmin = authUser?.role?.toLowerCase() === "admin";

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login-1");
  };

  const navigateToProfile = () => {
    // Assuming your profile route is /user/profile or /account
    navigate("/account/profile");
  };

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <Avatar
            src={authUser?.avatar}
            sizes={"small"}
            sx={{ boxShadow: 3, cursor: "pointer", border: "1px solid #eee" }}
          />
        }
        sx={{ ml: 3 }}
      >
        {/* CLICKABLE HEADER SECTION */}
        <Div
          onClick={navigateToProfile}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            p: 2.5,
            cursor: "pointer",
            "&:hover": { bgcolor: "action.hover" },
            transition: "background 0.2s",
          }}
        >
          <Avatar
            src={authUser?.avatar}
            alt={authUser?.username}
            sx={{
              width: 60,
              height: 60,
              mb: 2,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />
          <Typography variant={"h5"} fontWeight="700">
            {authUser?.username}
          </Typography>
          <Typography variant={"body2"} color="text.secondary">
            {authUser?.email}
          </Typography>
        </Div>

        <Divider />

        <nav>
          <List disablePadding sx={{ py: 1 }}>
            {/* Quick Profile Link */}
            <ListItemButton onClick={() => navigate("/account")}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PersonOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="My Profile"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItemButton>

            <ListItemButton onClick={() => navigate("/account/orders")}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ShoppingBagOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="My Orders"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItemButton>

            {/* ADMIN ONLY QUICK LINK */}
            {isAdmin && (
              <ListItemButton
                onClick={() => navigate("/admin")}
                sx={{
                  my: 0.5,
                  color: "secondary.main",
                  bgcolor: "secondary.lighter",
                  "&:hover": { bgcolor: "secondary.light", color: "white" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DashboardCustomizeOutlinedIcon
                    fontSize="small"
                    color="inherit"
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Admin Panel"
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: "bold",
                  }}
                />
              </ListItemButton>
            )}

            <Divider sx={{ my: 1 }} />

            <ListItemButton onClick={() => setEditOpen(true)}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EditOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItemButton>

            <ListItemButton onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItemButton>
          </List>

          <EditProfileDialog
            open={editOpen}
            onClose={() => setEditOpen(false)}
          />
        </nav>
      </JumboDdPopover>
    </ThemeProvider>
  );
};

export { AuthUserPopover };

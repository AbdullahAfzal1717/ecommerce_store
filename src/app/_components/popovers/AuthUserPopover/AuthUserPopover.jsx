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

  const isAdmin = authUser?.role === "admin" || authUser?.role === "Admin";

  async function handleLogout() {
    await logout();
    return navigate("/auth/login-1");
  }

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <Avatar
            src={authUser?.avatar}
            sizes={"small"}
            sx={{ boxShadow: 23, cursor: "pointer" }}
          />
        }
        sx={{ ml: 3 }}
      >
        <Div
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            p: (theme) => theme.spacing(2.5),
          }}
        >
          <Avatar
            src={authUser?.avatar}
            alt={authUser?.username}
            sx={{ width: 60, height: 60, mb: 2 }}
          />
          <Typography variant={"h5"}>{authUser?.username}</Typography>
          <Typography variant={"body1"} color="text.secondary">
            {authUser?.email}
          </Typography>
        </Div>
        <Divider />
        <nav>
          <List disablePadding sx={{ pb: 1 }}>
            {/* PERSONAL AREA: Accessible by everyone */}
            <ListItemButton onClick={() => navigate("/account")}>
              <ListItemIcon>
                <PersonOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="My Account" />
            </ListItemButton>

            <ListItemButton onClick={() => navigate("/account/orders")}>
              <ListItemIcon>
                <ShoppingBagOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="My Orders" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            {/* ADMIN ONLY QUICK LINK: Jump to management panel */}
            {isAdmin && (
              <ListItemButton
                onClick={() => navigate("/admin")}
                sx={{ color: "primary.main", bgcolor: "primary.lighter" }}
              >
                <ListItemIcon>
                  <DashboardCustomizeOutlinedIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Admin Panel" />
              </ListItemButton>
            )}

            <ListItemButton onClick={() => setEditOpen(true)}>
              <ListItemIcon>
                <EditOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </ListItemButton>

            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ my: 0 }} />
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

import React from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Stack,
  Box,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  DashboardCustomizeOutlined,
  AccountCircleOutlined,
} from "@mui/icons-material";
import CartHeaderIcon from "../Header/components/CartIcon/CartIcon";
import { AuthUserPopover } from "@app/_components/popovers/AuthUserPopover";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

function StoreHeader() {
  const navigate = useNavigate();
  const { authUser } = useAuth();

  const isAdmin = authUser?.role === "admin" || authUser?.role === "Admin";
  const isLoggedIn = !!authUser;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        zIndex: 1100,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            height: 90,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}
          <Box
            component="img"
            src="/FASCO.svg"
            alt="FASCO Logo"
            onClick={() => navigate("/")}
            sx={{ height: 40, cursor: "pointer" }}
          />

          {/* ACTIONS */}
          <Stack direction="row" spacing={2} alignItems="center">
            {isLoggedIn && (
              <>
                {/* PROFESSIONAL LOGIC:
                  If Admin: Show link to Admin Panel.
                  If User: Show link to Personal Account.
                */}
                <Tooltip
                  title={isAdmin ? "Go to Admin Panel" : "Go to My Account"}
                >
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={
                      isAdmin ? (
                        <DashboardCustomizeOutlined />
                      ) : (
                        <AccountCircleOutlined />
                      )
                    }
                    onClick={() =>
                      navigate(isAdmin ? "/admin" : "/account/dashboard")
                    }
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: "bold",
                      display: { xs: "none", sm: "flex" },
                    }}
                  >
                    {isAdmin ? "Admin Panel" : "Account"}
                  </Button>
                </Tooltip>

                {/* Mobile Icon Toggle */}
                <IconButton
                  sx={{ display: { xs: "flex", sm: "none" } }}
                  onClick={() =>
                    navigate(isAdmin ? "/admin" : "/account/dashboard")
                  }
                >
                  {isAdmin ? (
                    <DashboardCustomizeOutlined />
                  ) : (
                    <AccountCircleOutlined />
                  )}
                </IconButton>
              </>
            )}

            <CartHeaderIcon />
            <AuthUserPopover />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default StoreHeader;

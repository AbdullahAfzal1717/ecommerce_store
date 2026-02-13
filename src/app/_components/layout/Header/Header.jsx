import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  IconButton,
  Stack,
  Tooltip,
  useMediaQuery,
  Box,
} from "@mui/material";
import {
  AccountCircleOutlined,
  DashboardCustomizeOutlined,
  LoginOutlined,
} from "@mui/icons-material";

// JUMBO & CORE IMPORTS
import { AuthUserPopover } from "@app/_components/popovers/AuthUserPopover";
import {
  useJumboLayout,
  useSidebarState,
} from "@jumbo/components/JumboLayout/hooks";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { SIDEBAR_STYLES } from "@jumbo/utilities/constants";
import { Logo, SidebarToggleButton } from "@app/_components/_core";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

// SUB-COMPONENTS
import CartHeaderIcon from "./components/CartIcon/CartIcon";

function Header() {
  const { isSidebarStyle } = useSidebarState();
  const { authUser } = useAuth();
  const { headerOptions } = useJumboLayout();
  const { theme } = useJumboTheme();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(authUser);

  const isBelowLg = useMediaQuery(
    theme.breakpoints.down(headerOptions?.drawerBreakpoint ?? "xl")
  );

  const showCart = !location.pathname.startsWith("/admin");
  const isAdmin = authUser?.role?.toLowerCase() === "admin";
  const isLoggedIn = !!authUser;

  return (
    <React.Fragment>
      {/* 1. SIDEBAR TOGGLE & LOGO */}
      <SidebarToggleButton />
      {isSidebarStyle(SIDEBAR_STYLES.CLIPPED_UNDER_HEADER) && !isBelowLg && (
        <Logo sx={{ mr: 3, minWidth: 150 }} mode={theme.type} />
      )}

      {/* 2. HEADER ACTIONS */}
      <Stack direction="row" alignItems="center" gap={1.25} sx={{ ml: "auto" }}>
        {/* SHOPPING CART (Shown to everyone except on Admin routes) */}
        {showCart && <CartHeaderIcon />}

        {/* 3. DYNAMIC AUTHENTICATION SECTION */}
        {isLoggedIn ? (
          <React.Fragment>
            {/* Desktop Navigation Button */}
            <Tooltip
              title={
                isAdmin && showCart ? "Go to Admin Panel" : "Go to My Account"
              }
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={
                  isAdmin && showCart ? (
                    <DashboardCustomizeOutlined />
                  ) : (
                    <AccountCircleOutlined />
                  )
                }
                onClick={() =>
                  navigate(isAdmin && showCart ? "/admin" : "/account")
                }
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: "bold",
                  display: { xs: "none", sm: "flex" },
                  borderWidth: "2px",
                  "&:hover": { borderWidth: "2px" },
                }}
              >
                {isAdmin && showCart ? "Admin Panel" : "Account"}
              </Button>
            </Tooltip>

            {/* Mobile Navigation Icon */}
            <IconButton
              color="primary"
              sx={{ display: { xs: "flex", sm: "none" } }}
              onClick={() =>
                navigate(isAdmin && showCart ? "/admin" : "/account")
              }
            >
              {authUser ? (
                <DashboardCustomizeOutlined />
              ) : (
                <AccountCircleOutlined />
              )}
            </IconButton>

            {/* Profile Avatar Popover */}
            <AuthUserPopover />
          </React.Fragment>
        ) : (
          /* GUEST VIEW: SHOW LOGIN BUTTON */
          <Button
            variant="contained"
            disableElevation
            startIcon={<LoginOutlined />}
            onClick={() => navigate("/login")}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "700",
              px: 3,
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Login
          </Button>
        )}
      </Stack>
    </React.Fragment>
  );
}

export { Header };

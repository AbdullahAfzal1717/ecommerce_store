import { AuthUserPopover } from "@app/_components/popovers/AuthUserPopover";
import {
  useJumboLayout,
  useSidebarState,
} from "@jumbo/components/JumboLayout/hooks";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";

import { SIDEBAR_STYLES } from "@jumbo/utilities/constants";

import {
  Button,
  IconButton,
  Stack,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { Search, SearchIconButtonOnSmallScreen } from "./components";
import { TranslationPopover } from "@app/_components/popovers/TranslationPopover";
import { ThemeModeOption } from "./components/ThemeModeOptions";
import { Logo, SidebarToggleButton } from "@app/_components/_core";
import CartHeaderIcon from "./components/CartIcon/CartIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import {
  AccountCircleOutlined,
  DashboardCustomizeOutlined,
} from "@mui/icons-material";

function Header() {
  const { isSidebarStyle } = useSidebarState();
  const { authUser } = useAuth();
  const [searchVisibility, setSearchVisibility] = React.useState(false);
  const { headerOptions } = useJumboLayout();
  const { theme } = useJumboTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isBelowLg = useMediaQuery(
    theme.breakpoints.down(headerOptions?.drawerBreakpoint ?? "xl")
  );
  const handleSearchVisibility = React.useCallback((value) => {
    setSearchVisibility(value);
  }, []);
  const showCart = !location.pathname.startsWith("/admin");
  const isAdmin = authUser?.role === "admin" || authUser?.role === "Admin";
  const isLoggedIn = !!authUser;

  return (
    <React.Fragment>
      <SidebarToggleButton />
      {isSidebarStyle(SIDEBAR_STYLES.CLIPPED_UNDER_HEADER) && !isBelowLg && (
        <Logo sx={{ mr: 3, minWidth: 150 }} mode={theme.type} />
      )}
      <Stack direction="row" alignItems="center" gap={1.25} sx={{ ml: "auto" }}>
        {isLoggedIn && (
          <>
            {/* PROFESSIONAL LOGIC:
                  If Admin: Show link to Admin Panel.
                  If User: Show link to Personal Account.
                */}
            <Tooltip
              title={
                isAdmin && showCart ? "Go to Admin Panel" : "Go to My Account"
              }
            >
              <Button
                variant="outlined"
                color="inherit"
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
                }}
              >
                {isAdmin && showCart ? "Admin Panel" : "Account"}
              </Button>
            </Tooltip>

            {/* Mobile Icon Toggle */}
            <IconButton
              sx={{ display: { xs: "flex", sm: "none" } }}
              onClick={() =>
                navigate(isAdmin && showCart ? "/admin" : "/account")
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
        {showCart && <CartHeaderIcon />}
        <AuthUserPopover />
      </Stack>
    </React.Fragment>
  );
}

export { Header };

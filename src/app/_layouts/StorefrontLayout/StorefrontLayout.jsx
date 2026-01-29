import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import StoreHeader from "@app/_components/layout/storefrontlayout/Header";
import StoreFooter from "@app/_components/layout/storefrontlayout/Footer";

export function StorefrontLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <StoreHeader />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Centers the container
        }}
      >
        {/* Container maxWidth="xl" ensures your content doesn't exceed ~1536px.
          Everything inside the Outlet will now stay aligned with your Header and Footer.
        */}
        <Container
          maxWidth="xl"
          disableGutters
          sx={{
            p: 0,
          }}
        >
          <Outlet />
        </Container>
      </Box>

      <StoreFooter />
    </Box>
  );
}

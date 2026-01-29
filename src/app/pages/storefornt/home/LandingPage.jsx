import React from "react";
import { Box } from "@mui/material";
import HeroSection from "@app/_components/storefront/home/HeroSection";
import BrandStrip from "@app/_components/storefront/home/BrandStrip";
import DealsSection from "@app/_components/storefront/home/DealsSection";
import NewArrivals from "@app/_components/storefront/home/NewArrivals";

const LandingPage = () => {
  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <HeroSection />
      <BrandStrip />
      <DealsSection />
      <NewArrivals />
    </Box>
  );
};

export default LandingPage;

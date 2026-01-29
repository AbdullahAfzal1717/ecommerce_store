import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn } from "@mui/icons-material";

const StoreFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={10}>
          <Grid item xs={12} md={4}>
            <img src="/FASCO.svg" alt="" style={{ marginBottom: "10px" }} />
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.8 }}
            >
              Elevate your lifestyle with the latest in technology. From
              high-performance laptops to smart home gadgets, we bring the
              future to your doorstep.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small">
                <Instagram />
              </IconButton>
              <IconButton size="small">
                <Twitter />
              </IconButton>
              <IconButton size="small">
                <Facebook />
              </IconButton>
              <IconButton size="small">
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Shop
            </Typography>
            <Stack spacing={2}>
              <Link href="#" color="text.secondary" underline="none">
                Laptops
              </Link>
              <Link href="#" color="text.secondary" underline="none">
                Smartphones
              </Link>
              <Link href="#" color="text.secondary" underline="none">
                Accessories
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Support
            </Typography>
            <Stack spacing={2}>
              <Link href="#" color="text.secondary" underline="none">
                Order Tracking
              </Link>
              <Link href="#" color="text.secondary" underline="none">
                Return Policy
              </Link>
              <Link href="#" color="text.secondary" underline="none">
                Contact Us
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Subscribe to get special offers and tech news.
            </Typography>
            {/* You can add a simple Input field here later */}
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Abdullah Store. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight="500">
            Faisalabad, Pakistan | Professional Portfolio Project
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default StoreFooter;
